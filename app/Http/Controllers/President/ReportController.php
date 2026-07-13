<?php

namespace App\Http\Controllers\President;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\KraSubArea;
use App\Models\MonthlySubmission;
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
     * /reports/kras/{code}?academic_year_id=
     *
     * Shows this sub-area's KPIs for one academic year. All months'
     * submissions for that year are sent down so the Month select can
     * switch client-side without a round trip; switching the Academic
     * Year select does trigger a round trip, since that changes which
     * targets/submissions are eligible at all.
     */
    public function kra(Request $request, string $code): Response
    {
        $academicYears = AcademicYear::query()
            ->orderByDesc('id')
            ->get(['id', 'label', 'is_current']);

        $selectedAcademicYear = null;

        if ($request->filled('academic_year_id')) {
            $selectedAcademicYear = $academicYears->firstWhere(
                'id',
                (int) $request->input('academic_year_id'),
            );
        }

        $selectedAcademicYear ??= $academicYears->firstWhere('is_current', true);
        $selectedAcademicYear ??= $academicYears->first();

        $subArea = KraSubArea::query()
            ->where('code', $code)
            ->with([
                'kra:id,number,title,reference',
                'kpis.units:id,code,name',
                'kpis.actionPlans.units:id,code,name',
                'kpis.targets' => fn ($q) => $selectedAcademicYear
                    ? $q->where('academic_year_id', $selectedAcademicYear->id)
                    : $q,
                'kpis.monthlySubmissions' => fn ($q) => $selectedAcademicYear
                    ? $q->where('academic_year_id', $selectedAcademicYear->id)
                        ->orderBy('year')->orderBy('month')
                    : $q->orderBy('year')->orderBy('month'),
                'kpis.monthlySubmissions.unit:id,code,name',
            ])
            ->firstOrFail();

        return Inertia::render('reports/kras/show', [
            'subArea' => [
                'code' => $subArea->code,
                'title' => $subArea->title,
                'kra' => $subArea->kra,
            ],
            'academicYears' => $academicYears,
            'selectedAcademicYear' => $selectedAcademicYear,
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

        $submissions = MonthlySubmission::query()
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