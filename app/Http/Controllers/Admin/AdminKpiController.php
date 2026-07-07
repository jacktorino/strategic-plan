<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminKpiController extends Controller
{
    // 🌟 Responsible units grouped by category — mirrors the frontend's
    // RESPONSIBLE_UNIT_GROUPS. Used to validate that each action plan's
    // responsible_units only contains real unit codes or valid "All {Group}"
    // whole-group markers.
    private const RESPONSIBLE_UNIT_GROUPS = [
        'Academic Units' => ['CAHS', 'CAS', 'CBA', 'CCJE', 'COED', 'CETA', 'COME', 'GLS'],
        'Academic Support' => [
            'CPAD', 'QMSO', 'FMD', 'ICTD', 'FAD', 'HRD', 'CRI', 'COMEX',
            'IAD', 'SASC', 'ARC', 'ACD', 'CIE', 'DPIA', 'IQA', 'CPARC',
            'SRMD', 'SSD', 'CTESD',
        ],
        'Satellite Campuses' => ['PARDO', 'MINGLANILLA', 'TOLEDO', 'DALAGUETE'],
    ];

    private function validResponsibleUnitValues(): array
    {
        $values = [];

        foreach (self::RESPONSIBLE_UNIT_GROUPS as $group => $units) {
            $values[] = "All {$group}";
            array_push($values, ...$units);
        }

        return $values;
    }

    public function index(Request $request)
    {
        // 🌟 Capture selected Academic Year from dropdown filter (Defaults to current active tracking year)
        $selectedAY = $request->query('ay', '2026-2027');

        $kras = DB::table('kras')->orderBy('code', 'asc')->get()->map(function ($kra) use ($selectedAY) {
            $kra->kpis = DB::table('kpis')
                ->where('kra_id', $kra->id)
                ->orderBy('code', 'asc')
                ->get()
                ->map(function ($kpi) use ($selectedAY) {

                    // 🌟 Fetch submissions ONLY for the selected individual academic year
                    $kpi->submissions = DB::table('kpi_submissions')
                        ->where('kpi_id', $kpi->id)
                        ->where('academic_year', $selectedAY)
                        ->orderBy('created_at', 'desc')
                        ->get();

                    // Calculate running average for THIS specific year from each
                    // responsible unit's submissions — this replaces the old
                    // manually-entered per-year target columns entirely.
                    $kpi->average_compliance = count($kpi->submissions) > 0
                        ? round($kpi->submissions->avg('compliance_percentage'))
                        : 0;

                    // 🌟 The annual target is no longer a manually-entered
                    // per-year value; it's the fixed 100% compliance goal
                    // that average_compliance is measured against.
                    $kpi->active_target = '100%';

                    // 🌟 Attach each Innovative Action Plan row, decoding its
                    // JSON-stored responsible_units into a plain array for
                    // the frontend.
                    $kpi->action_plans = DB::table('innovative_action_plans')
                        ->where('kpi_id', $kpi->id)
                        ->orderBy('created_at', 'asc')
                        ->get()
                        ->map(function ($plan) {
                            $plan->responsible_units = $plan->responsible_units
                                ? json_decode($plan->responsible_units, true)
                                : [];

                            return $plan;
                        });

                    return $kpi;
                });
            return $kra;
        });

        return Inertia::render('admin/kpis/index', [
            'kras' => $kras,
            'selectedAY' => $selectedAY, // Send this back to keep state synchronized in the UI
        ]);
    }

    public function store(Request $request)
    {
        $validUnitValues = $this->validResponsibleUnitValues();

        $validated = $request->validate([
            'kra_id'                              => 'required|exists:kras,id',
            'code'                                 => 'required|string',
            'name'                                  => 'required|string',
            // 🌟 Each action plan now carries its own description AND its
            // own responsible_units — at least one action plan is required,
            // each needs a description, and responsible_units must contain
            // only known unit codes or "All {Group}" markers.
            'action_plans'                           => 'required|array|min:1',
            'action_plans.*.description'             => 'required|string',
            'action_plans.*.responsible_units'       => 'required|array|min:1',
            'action_plans.*.responsible_units.*'     => [
                'required',
                'string',
                Rule::in($validUnitValues),
            ],
        ]);

        DB::transaction(function () use ($validated) {
            $kpiId = DB::table('kpis')->insertGetId([
                'kra_id'     => $validated['kra_id'],
                'code'       => $validated['code'],
                'name'       => $validated['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $actionPlans = collect($validated['action_plans'])
                ->map(fn (array $plan) => [
                    'kpi_id'            => $kpiId,
                    'description'       => $plan['description'],
                    'responsible_units' => json_encode($plan['responsible_units']),
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ])
                ->all();

            DB::table('innovative_action_plans')->insert($actionPlans);
        });

        return redirect()->back()->with('success', 'KPI with assigned action plans and responsible units created.');
    }
}