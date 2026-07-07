<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use App\Support\ResponsibleUnits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UnitKpiController extends Controller
{
    public function index(Request $request)
    {
        $unitCode = $request->user()->responsible_unit;
        $selectedAY = $request->query('ay', '2026-2027');

        abort_if(! $unitCode, 403, 'Your account has no responsible unit assigned. Contact an admin.');

        $kras = DB::table('kras')
            ->orderBy('code', 'asc')
            ->get()
            ->map(function ($kra) use ($unitCode, $selectedAY) {
                $kra->kpis = DB::table('kpis')
                    ->where('kra_id', $kra->id)
                    ->orderBy('code', 'asc')
                    ->get()
                    ->map(function ($kpi) use ($unitCode, $selectedAY) {
                        // Only the action plans actually assigned to this unit
                        // (directly, or via an "All {Group}" wholesale assignment).
                        $kpi->action_plans = DB::table('innovative_action_plans')
                            ->where('kpi_id', $kpi->id)
                            ->orderBy('created_at', 'asc')
                            ->get()
                            ->map(function ($plan) {
                                $plan->responsible_units = $plan->responsible_units
                                    ? json_decode($plan->responsible_units, true)
                                    : [];
                                return $plan;
                            })
                            ->filter(fn ($plan) => ResponsibleUnits::assignmentIncludesUnit(
                                $plan->responsible_units,
                                $unitCode,
                            ))
                            ->values();

                        // This unit's own submission history for this KPI —
                        // scoped by unit_code, not blended with other units.
                        $kpi->submissions = DB::table('kpi_submissions')
                            ->where('kpi_id', $kpi->id)
                            ->where('unit_code', $unitCode)
                            ->where('academic_year', $selectedAY)
                            ->orderBy('created_at', 'desc')
                            ->get();

                        $kpi->average_compliance = $kpi->submissions->isNotEmpty()
                            ? round($kpi->submissions->avg('compliance_percentage'))
                            : 0;

                        $kpi->active_target = '100%';

                        return $kpi;
                    })
                    // Drop KPIs that have no action plan assigned to this unit at all.
                    ->filter(fn ($kpi) => $kpi->action_plans->isNotEmpty())
                    ->values();

                return $kra;
            })
            // Drop KRAs with nothing assigned to this unit.
            ->filter(fn ($kra) => $kra->kpis->isNotEmpty())
            ->values();

        return Inertia::render('my/kpis/index', [
            'kras' => $kras,
            'selectedAY' => $selectedAY,
            'unitCode' => $unitCode,
        ]);
    }

    public function storeSubmission(Request $request, int $kpi)
    {
        $unitCode = $request->user()->responsible_unit;
        abort_if(! $unitCode, 403);

        $validated = $request->validate([
            'academic_year' => 'required|string',
            'submission_month' => 'required|string',
            'compliance_percentage' => 'required|integer|min:0|max:100',
        ]);

        // Confirm this KPI actually has an action plan assigned to this
        // unit — a unit shouldn't be able to report against a KPI it
        // isn't responsible for, even if they know the ID.
        $isAssigned = DB::table('innovative_action_plans')
            ->where('kpi_id', $kpi)
            ->get()
            ->contains(function ($plan) use ($unitCode) {
                $units = $plan->responsible_units ? json_decode($plan->responsible_units, true) : [];
                return ResponsibleUnits::assignmentIncludesUnit($units, $unitCode);
            });

        abort_unless($isAssigned, 403, 'This KPI is not assigned to your unit.');

        DB::table('kpi_submissions')->updateOrInsert(
            [
                'kpi_id' => $kpi,
                'unit_code' => $unitCode,
                'academic_year' => $validated['academic_year'],
                'submission_month' => $validated['submission_month'],
            ],
            [
                'compliance_percentage' => $validated['compliance_percentage'],
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );

        return redirect()->back()->with('success', 'Progress submitted.');
    }
}