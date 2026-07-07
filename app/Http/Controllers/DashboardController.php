<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\ResponsibleUnits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    // Matches the default already used in AdminKpiController — kept here so
    // "current AY" means the same thing everywhere in the app.
    private const CURRENT_AY = '2026-2027';

    public function index(Request $request): Response
    {
        $user = $request->user();
        $ay = $request->query('ay', self::CURRENT_AY);

        $metrics = match ($user->role) {
            'admin' => $this->adminMetrics($ay),
            'staff' => $this->staffMetrics($user->responsible_unit, $ay),
            'president' => $this->presidentMetrics($ay),
            default => [],
        };

        return Inertia::render('dashboard', [
            'role' => $user->role,
            'unit' => $user->responsible_unit,
            'metrics' => $metrics,
        ]);
    }

    private function adminMetrics(string $ay): array
    {
        $monthOrder = [
            'August', 'September', 'October', 'November', 'December', 'January',
            'February', 'March', 'April', 'May', 'June', 'July',
        ];

        $submissionCounts = DB::table('kpi_submissions')
            ->where('academic_year', $ay)
            ->select('submission_month', DB::raw('count(*) as c'))
            ->groupBy('submission_month')
            ->pluck('c', 'submission_month');

        $activity = collect($monthOrder)
            ->map(fn ($m) => ['month' => substr($m, 0, 3), 'submissions' => $submissionCounts[$m] ?? 0])
            ->values();

        return [
            'total_units' => count(ResponsibleUnits::allUnitCodes()),
            // 🔶 Assumption: "Pending Action Proposals" in the original mock had no
            // backing table. Repurposed as pending *account* approvals, since
            // that's the real pending queue that exists today. Swap this out if
            // you build a separate KPI-proposal flow later.
            'pending_proposals' => User::where('status', User::STATUS_PENDING)->count(),
            'active_kpis' => DB::table('kpis')->count(),
            'activity' => $activity,
        ];
    }

    private function staffMetrics(?string $unitCode, string $ay): array
    {
        if (! $unitCode) {
            return ['my_assigned_kpis' => 0, 'completed_tasks' => 0, 'pending_tasks' => 0];
        }

        $assignedKpiIds = DB::table('innovative_action_plans')
            ->get()
            ->filter(fn ($plan) => ResponsibleUnits::assignmentIncludesUnit(
                $plan->responsible_units ? json_decode($plan->responsible_units, true) : [],
                $unitCode,
            ))
            ->pluck('kpi_id')
            ->unique();

        $submissions = DB::table('kpi_submissions')
            ->where('unit_code', $unitCode)
            ->where('academic_year', $ay)
            ->get();

        $reportedKpiIds = $submissions->pluck('kpi_id')->unique();

        return [
            'my_assigned_kpis' => $assignedKpiIds->count(),
            // 🔶 Assumption: "completed" = at least one 100% submission this AY.
            'completed_tasks' => $submissions->where('compliance_percentage', '>=', 100)->count(),
            // 🔶 Assumption: "pending" = assigned KPIs with zero submissions yet this AY.
            'pending_tasks' => $assignedKpiIds->diff($reportedKpiIds)->count(),
        ];
    }

    private function presidentMetrics(string $ay): array
    {
        $allSubmissions = DB::table('kpi_submissions')->where('academic_year', $ay)->get();

        $kraRows = DB::table('kras')->orderBy('code')->get();
        $kraPerformance = $kraRows->map(function ($kra) use ($ay) {
            $kpiIds = DB::table('kpis')->where('kra_id', $kra->id)->pluck('id');
            $avg = DB::table('kpi_submissions')
                ->whereIn('kpi_id', $kpiIds)
                ->where('academic_year', $ay)
                ->avg('compliance_percentage');

            return [
                'name' => $kra->code.': '.Str::limit($kra->title, 22),
                'progress' => $avg ? (int) round($avg) : 0,
            ];
        })->values();

        // 🔶 Assumption, needs your confirmation: a unit counts as
        // - "Completed On-Time" if it has a submission for the CURRENT calendar
        //   month at >=100%,
        // - "Delayed Submissions" if it submitted this month but under 100%,
        // - "Pending Review" if it hasn't submitted this month at all.
        // This ignores units with nothing assigned to them at all — decide if
        // those should count separately rather than being silently excluded.
        $currentMonth = now('Asia/Manila')->format('F');
        $statusCounts = ['Completed On-Time' => 0, 'Pending Review' => 0, 'Delayed Submissions' => 0];

        foreach (ResponsibleUnits::allUnitCodes() as $code) {
            $hasAssignment = DB::table('innovative_action_plans')
                ->get()
                ->contains(fn ($plan) => ResponsibleUnits::assignmentIncludesUnit(
                    $plan->responsible_units ? json_decode($plan->responsible_units, true) : [],
                    $code,
                ));

            if (! $hasAssignment) {
                continue;
            }

            $thisMonth = DB::table('kpi_submissions')
                ->where('unit_code', $code)
                ->where('academic_year', $ay)
                ->where('submission_month', $currentMonth)
                ->avg('compliance_percentage');

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
                ? round($allSubmissions->avg('compliance_percentage')).'%'
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