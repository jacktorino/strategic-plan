<?php

namespace App\Http\Controllers\President;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\KraSubArea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index');
    }

    /**
     * /reports/kras/{code} — e.g. "1.1". Shows this sub-area's KPIs, each
     * with its current-year target, latest monthly submission per unit,
     * responsible units, and action plans.
     *
     * Note: monthly_submissions is keyed by (kpi_id, unit_id, year, month) —
     * there is no per-action-plan submission row. The frontend derives each
     * action plan's relevant submissions by matching the action plan's
     * responsible unit(s) against the KPI's submissions.
     */
    public function kra(string $code): Response
    {
        $currentYear = AcademicYear::where('is_current', true)->first();

        $subArea = KraSubArea::query()
            ->where('code', $code)
            ->with([
                'kra:id,number,title,reference',
                'kpis.units:id,code,name',
                'kpis.actionPlans.units:id,code,name',
                'kpis.targets' => fn ($q) => $currentYear
                    ? $q->where('academic_year_id', $currentYear->id)
                    : $q,
                'kpis.monthlySubmissions' => fn ($q) => $currentYear
                    ? $q->where('academic_year_id', $currentYear->id)
                        ->orderByDesc('year')->orderByDesc('month')
                    : $q->orderByDesc('year')->orderByDesc('month'),
                'kpis.monthlySubmissions.unit:id,code,name',
            ])
            ->firstOrFail();

        return Inertia::render('reports/kras/show', [
            'subArea' => [
                'code' => $subArea->code,
                'title' => $subArea->title,
                'kra' => $subArea->kra,
            ],
            'currentAcademicYear' => $currentYear,
            'kpis' => $subArea->kpis,
        ]);
    }

    /**
     * /reports/monthly?year=&month= — all submissions for that month,
     * typically grouped back up by KRA for a president-level overview.
     */
    public function monthly(Request $request): Response
    {
        $validated = $request->validate([
            'year' => ['required', 'integer'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        $submissions = \App\Models\MonthlySubmission::query()
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->with(['kpi.subArea.kra:id,number,title', 'unit:id,code,name'])
            ->get()
            ->groupBy(fn ($s) => $s->kpi->subArea->kra->number);

        return Inertia::render('reports/monthly', [
            'year' => $validated['year'],
            'month' => $validated['month'],
            'submissionsByKra' => $submissions,
        ]);
    }
}