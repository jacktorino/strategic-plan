<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UnitReportController extends Controller
{
    /**
     * /my/reports — same shape as President\ReportController::kra(), but
     * always scoped to the current staff member's own kra_sub_area_id
     * rather than an arbitrary {code} route parameter.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $subArea = $user->kraSubArea;

        if (! $subArea) {
            return Inertia::render('my/reports/index', [
                'subArea' => null,
                'kpis' => [],
                'message' => 'Your account is not yet assigned to a KRA sub-area. Contact an admin.',
            ]);
        }

        $currentYear = AcademicYear::where('is_current', true)->first();

        $subArea->load([
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
        ]);

        return Inertia::render('my/reports/index', [
            'subArea' => [
                'code' => $subArea->code,
                'title' => $subArea->title,
                'kra' => $subArea->kra,
            ],
            'currentAcademicYear' => $currentYear,
            'kpis' => $subArea->kpis,
        ]);
    }
}