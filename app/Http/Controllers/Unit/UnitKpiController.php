<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Admin\KpiSubmissionController;
use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Kpi;
use App\Models\MonthlySubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UnitKpiController extends Controller
{
    private const MONTHS = [
        1 => 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    /**
     * /my/kpis — shows the KPIs for one KRA sub-area (e.g. "1.1" Governance)
     * directly from the seeded data: sub-area, its KPIs, targets, action
     * plans, and units. Not gated on any staff/unit assignment — just
     * renders whatever sub-area code is requested (or the user's own
     * kra_sub_area_id if set, falling back to "1.1" for now).
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $academicYear = $this->resolveAcademicYear($request);

        $code = $request->query('sub_area', $user->kraSubArea->code ?? '1.1');

        $subArea = \App\Models\KraSubArea::where('code', $code)
            ->with([
                'kra:id,number,title',
                'kpis.subArea.kra:id,number,title',
                'kpis.units:id,code,name',
                'kpis.actionPlans.units:id,code,name',
                'kpis.targets' => fn ($q) => $academicYear
                    ? $q->where('academic_year_id', $academicYear->id)
                    : $q,
                'kpis.monthlySubmissions' => fn ($q) => $academicYear
                    ? $q->where('academic_year_id', $academicYear->id)->orderBy('month')
                    : $q->orderBy('month'),
                'kpis.monthlySubmissions.unit:id,code,name',
            ])
            ->first();

        if (! $subArea) {
            return Inertia::render('my/kpis/index', [
                'kras' => [],
                'selectedAY' => $academicYear
                    ? "{$academicYear->start_year}-{$academicYear->end_year}"
                    : '',
                'unitCode' => $code,
            ]);
        }

        $kra = $subArea->kra;

        return Inertia::render('my/kpis/index', [
            'kras' => [[
                'id' => $kra->id,
                'code' => (string) $kra->number,
                'title' => "{$subArea->code} {$subArea->title}",
                'kpis' => $subArea->kpis->map(fn (Kpi $kpi) => $this->formatKpi($kpi)),
            ]],
            'selectedAY' => $academicYear
                ? "{$academicYear->start_year}-{$academicYear->end_year}"
                : '',
            'unitCode' => $subArea->code,
        ]);
    }

    private function formatKpi(Kpi $kpi): array
    {
        $submissions = $kpi->monthlySubmissions;
        $average = $submissions->isNotEmpty()
            ? round($submissions->avg('percentage_achieved'))
            : 0;

        $target = $kpi->targets->first();

        return [
            'id' => $kpi->id,
            'code' => $kpi->code,
            'name' => $kpi->description,
            'action_plans' => $kpi->actionPlans->map(fn ($plan) => [
                'id' => $plan->id,
                'description' => $plan->description,
                'responsible_units' => $plan->units->pluck('code')->all(),
            ]),
            'submissions' => $submissions->map(fn (MonthlySubmission $s) => [
                'id' => $s->id,
                'action_plan_id' => $s->action_plan_id,
                'submission_month' => self::MONTHS[$s->month] ?? (string) $s->month,
                'compliance_percentage' => (float) $s->percentage_achieved,
                'unit_code' => $s->unit->code ?? null,
            ])->values(),
            'average_compliance' => $average,
            'active_target' => $target ? "{$target->target_percentage}%" : 'N/A',
        ];
    }

    /**
     * POST /my/kpis/{kpi} — matches the per-row cells in unit/kpis/index.tsx:
     * { academic_year: "2025-2026", submission_month: "July",
     *   compliance_percentage: number, action_plan_id: number|null }.
     *
     * Authorization is scoped by KRA sub-area (e.g. "1.1 Governance"), not by
     * responsible unit — a staff account belongs to one kra_sub_area, and can
     * only submit for KPIs that live under that same sub-area. The
     * responsible_units on an action plan are just the people/units involved,
     * not an access boundary.
     *
     * action_plan_id is nullable because a KPI with no action plans still
     * gets one editable row. When it IS present it must belong to this KPI
     * — this is what lets two action plans under the same KPI, same
     * sub-area, same month each keep their own percentage instead of
     * overwriting each other (see the action_plan_id column + updated
     * unique index in the monthly_submissions migration).
     */
    public function storeSubmission(Request $request, Kpi $kpi)
    {
        $user = Auth::user();

        abort_if(! $user->kraSubArea, 403, 'Your account has no assigned key result area.');

        abort_unless(
            $kpi->subArea && $kpi->subArea->id === $user->kraSubArea->id,
            403,
            'This KPI does not belong to your key result area.'
        );

        $actionPlanId = $request->input('action_plan_id');

        if ($actionPlanId !== null) {
            // Submitting against a specific action plan — the plan must
            // belong to this KPI.
            $plan = $kpi->actionPlans()->where('id', $actionPlanId)->first();

            abort_if(! $plan, 404, 'This action plan does not belong to this KPI.');
        }

        $validated = $request->validate([
            'academic_year' => ['required', 'string', 'regex:/^\d{4}-\d{4}$/'],
            'submission_month' => ['required', 'string', 'in:'.implode(',', self::MONTHS)],
            'compliance_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'action_plan_id' => [
                'nullable',
                'integer',
                Rule::exists('action_plans', 'id'),
                function ($attribute, $value, $fail) use ($kpi) {
                    if ($value !== null && ! $kpi->actionPlans()->where('id', $value)->exists()) {
                        $fail('The selected action plan does not belong to this KPI.');
                    }
                },
            ],
        ]);

        [$startYear] = explode('-', $validated['academic_year']);
        $academicYear = AcademicYear::where('start_year', (int) $startYear)->firstOrFail();
        $month = array_search($validated['submission_month'], self::MONTHS, true);

        MonthlySubmission::updateOrCreate(
            [
                'kpi_id' => $kpi->id,
                'action_plan_id' => $validated['action_plan_id'] ?? null,
                'academic_year_id' => $academicYear->id,
                'year' => $academicYear->start_year,
                'month' => $month,
            ],
            [
                'percentage_achieved' => $validated['compliance_percentage'],
                'status' => 'submitted',
                'submitted_by' => $user->id,
                'submitted_at' => now(),
            ]
        );

        return redirect()->back()->with('success', 'Submission recorded.');
    }

 public function bulkStore(Request $request)
{
    $user = Auth::user();

    abort_if(! $user->kraSubArea, 403, 'Your account has no assigned key result area.');

    $validated = $request->validate([
        'academic_year' => ['required', 'string', 'regex:/^\d{4}-\d{4}$/'],
        'submission_month' => ['required', 'string', 'in:' . implode(',', self::MONTHS)],
        'entries' => ['required', 'array'],
        'entries.*.kpi_id' => ['required', 'exists:kpis,id'],
        'entries.*.action_plan_id' => ['nullable', 'exists:action_plans,id'],
        'entries.*.compliance_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
    ]);

    [$startYear] = explode('-', $validated['academic_year']);

    $academicYear = AcademicYear::where('start_year', (int) $startYear)->firstOrFail();

    $month = array_search($validated['submission_month'], self::MONTHS, true);

    foreach ($validated['entries'] as $entry) {

        $kpi = Kpi::with('subArea', 'actionPlans')->findOrFail($entry['kpi_id']);

        abort_unless(
            $kpi->subArea && $kpi->subArea->id === $user->kraSubArea->id,
            403,
            'This KPI does not belong to your key result area.'
        );

        if ($entry['action_plan_id']) {
            abort_unless(
                $kpi->actionPlans()->where('id', $entry['action_plan_id'])->exists(),
                404,
                'Invalid action plan.'
            );
        }

        MonthlySubmission::updateOrCreate(
            [
                'kpi_id' => $kpi->id,
                'action_plan_id' => $entry['action_plan_id'],
                'academic_year_id' => $academicYear->id,
                'year' => $academicYear->start_year,
                'month' => $month,
            ],
            [
                'percentage_achieved' => $entry['compliance_percentage'],
                'status' => 'submitted',
                'submitted_by' => $user->id,
                'submitted_at' => now(),
            ]
        );
    }

    return response()->json([
        'success' => true,
    ]);
}

    private function resolveAcademicYear(Request $request): ?AcademicYear
    {
        if ($request->filled('academic_year')) {
            [$startYear] = explode('-', $request->string('academic_year'));

            $academicYear = AcademicYear::where('start_year', (int) $startYear)->first();

            if ($academicYear) {
                return $academicYear;
            }
        }

        return AcademicYear::where('is_current', true)->first();
    }
}