<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    // Matches academic_years.label, e.g. "2026-2027". Kept here so "current AY"
    // means the same thing everywhere in the app.
    private const CURRENT_AY_LABEL = '2026-2027';

    public function index(Request $request): Response
    {
        $user = $request->user();
        $ayLabel = $request->query('ay', self::CURRENT_AY_LABEL);
        $academicYearId = $this->resolveAcademicYearId($ayLabel);

        $metrics = match ($user->role) {
            'admin' => $this->adminMetrics($academicYearId),
            'staff' => $this->staffMetrics($user->responsible_unit, $academicYearId),
            'president' => $this->presidentMetrics($academicYearId),
            default => [],
        };

        return Inertia::render('dashboard', [
            'role' => $user->role,
            'unit' => $user->responsible_unit,
            'metrics' => $metrics,
        ]);
    }

    private function resolveAcademicYearId(string $label): ?int
    {
        return DB::table('academic_years')->where('label', $label)->value('id');
    }

    private function adminMetrics(?int $academicYearId): array
    {
        // AY runs August -> July; monthly_submissions.month is 1-12.
        $monthOrder = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7];
        $monthLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

        $submissionCounts = DB::table('monthly_submissions')
            ->where('academic_year_id', $academicYearId)
            ->select('month', DB::raw('count(*) as c'))
            ->groupBy('month')
            ->pluck('c', 'month');

        $activity = collect($monthOrder)
            ->map(fn($m, $i) => ['month' => $monthLabels[$i], 'submissions' => $submissionCounts[$m] ?? 0])
            ->values();

        return [
            'total_units' => DB::table('units')->count(),
            // 🔶 Assumption carried over: "Pending Action Proposals" has no backing
            // table, so this is pending *account* approvals instead.
            'pending_proposals' => User::where('status', User::STATUS_PENDING)->count(),
            'active_kpis' => DB::table('key_performance_indicators')->count(),
            'activity' => $activity,
        ];
    }

    private function staffMetrics(?string $unitCode, ?int $academicYearId): array
    {
        $unitId = $unitCode ? DB::table('units')->where('code', $unitCode)->value('id') : null;

        if (! $unitId || ! $academicYearId) {
            return ['my_assigned_kpis' => 0, 'completed_tasks' => 0, 'pending_tasks' => 0];
        }

        // KPIs assigned to this unit either directly (kpi_unit) or through one
        // of its action plans (action_plan_unit), since either can carry the
        // responsible unit depending on how granular the assignment is.
        $viaKpi = DB::table('kpi_unit')->where('unit_id', $unitId)->pluck('kpi_id');
        $viaActionPlan = DB::table('action_plans')
            ->join('action_plan_unit', 'action_plans.id', '=', 'action_plan_unit.action_plan_id')
            ->where('action_plan_unit.unit_id', $unitId)
            ->pluck('action_plans.kpi_id');

        $assignedKpiIds = $viaKpi->merge($viaActionPlan)->unique();

        $submissions = DB::table('monthly_submissions')
            ->where('unit_id', $unitId)
            ->where('academic_year_id', $academicYearId)
            ->get();

        $reportedKpiIds = $submissions->pluck('kpi_id')->unique();

        return [
            'my_assigned_kpis' => $assignedKpiIds->count(),
            // 🔶 Assumption: "completed" = at least one 100% submission this AY.
            'completed_tasks' => $submissions->where('percentage_achieved', '>=', 100)->count(),
            // 🔶 Assumption: "pending" = assigned KPIs with zero submissions yet this AY.
            'pending_tasks' => $assignedKpiIds->diff($reportedKpiIds)->count(),
        ];
    }

    private function presidentMetrics(?int $academicYearId): array
    {
        $allSubmissions = DB::table('monthly_submissions')
            ->where('academic_year_id', $academicYearId)
            ->get();

        $kraRows = DB::table('key_result_areas')->orderBy('number')->get();

    $kraPerformance = $kraRows->map(function ($kra) use ($academicYearId) {
            // KPIs sit under kra_sub_areas now, not directly under key_result_areas.
            $kpiIds = DB::table('key_performance_indicators')
                ->join('kra_sub_areas', 'key_performance_indicators.sub_area_id', '=', 'kra_sub_areas.id')
                ->where('kra_sub_areas.kra_id', $kra->id)
                ->pluck('key_performance_indicators.id');

            $avg = DB::table('monthly_submissions')
                ->whereIn('kpi_id', $kpiIds)
                ->where('academic_year_id', $academicYearId)
                ->avg('percentage_achieved');

            return [
                'name' => 'KRA ' . $kra->number . ': ' . Str::limit($kra->title, 22),
                'progress' => $avg ? (int) round($avg) : 0,
            ];
        })->values();

        // 🔶 Assumption, needs your confirmation: a unit counts as
        // - "Completed On-Time" if it has a submission for the CURRENT calendar
        //   month/year at >=100%,
        // - "Delayed Submissions" if it submitted this month but under 100%,
        // - "Pending Review" if it hasn't submitted this month at all.
        // Units with no assignment at all (neither kpi_unit nor
        // action_plan_unit) are skipped rather than counted as pending.
        $currentMonth = (int) now('Asia/Manila')->format('n');
        $currentYear = (int) now('Asia/Manila')->format('Y');
        $statusCounts = ['Completed On-Time' => 0, 'Pending Review' => 0, 'Delayed Submissions' => 0];

        foreach (DB::table('units')->get() as $unit) {
            $hasAssignment = DB::table('kpi_unit')->where('unit_id', $unit->id)->exists()
                || DB::table('action_plan_unit')->where('unit_id', $unit->id)->exists();

            if (! $hasAssignment) {
                continue;
            }

            $thisMonth = DB::table('monthly_submissions')
                ->where('unit_id', $unit->id)
                ->where('academic_year_id', $academicYearId)
                ->where('year', $currentYear)
                ->where('month', $currentMonth)
                ->avg('percentage_achieved');

            if ($thisMonth === null) {
                $statusCounts['Pending Review']++;
            } elseif ($thisMonth >= 100) {
                $statusCounts['Completed On-Time']++;
            } else {
                $statusCounts['Delayed Submissions']++;
            }
        }

        $unitCompliance = [
            ['name' => 'Completed On-Time', 'value' => $statusCounts['Completed On-Time'], 'color' => '#10b981'],
            ['name' => 'Pending Review', 'value' => $statusCounts['Pending Review'], 'color' => '#f59e0b'],
            ['name' => 'Delayed Submissions', 'value' => $statusCounts['Delayed Submissions'], 'color' => '#ef4444'],
        ];

        return [
            'overall_completion' => $allSubmissions->isNotEmpty()
                ? round($allSubmissions->avg('percentage_achieved')) . '%'
                : '0%',
            'total_kras' => $kraRows->count(),
            // 🔶 Assumption: "critical" = a KRA averaging under 50% this AY.
            'critical_alerts' => $kraPerformance->where('progress', '<', 50)->count(),
            'kra_performance' => $kraPerformance,
            'unit_compliance' => $unitCompliance,
            'total_units_tracked' => array_sum($statusCounts),
        ];
    }
}
