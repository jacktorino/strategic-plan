<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Models\KeyPerformanceIndicator; 
use App\Models\ActionPlan;
use App\Models\Unit;

class ProposeKpi extends Controller
{
    /**
     * Display the KPI proposal form.
     */
    public function index(Request $request)
    {
        $units = Unit::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Automatically resolve the user's governance entity name
        // Adjust 'governance' to match your actual relation or column name on the User model
        $userGovernance = $request->user()->governance?->name ?? 'Your Assigned Governance';

        // Calculate the next KPI code prefix automatically (e.g., based on sub_area_id 1)
        $nextKpiCode = $this->generateNextKpiCode(1);
        
        return Inertia::render('my/propose-kpi/index', [
            'units' => $units,
            'next_kpi_code' => $nextKpiCode,
            'user_governance' => $userGovernance,
        ]);
    }

    /**
     * Store a newly proposed KPI and its multiple action plans.
     */
    public function store(Request $request)
    {
        // 1. Validate inputs (responsible_unit and kpi_code are resolved securely on the backend)
        $validated = $request->validate([
            'kpi'                                    => 'required|string',
            'innovative_action_plans'                => 'required|array|min:1',
            'innovative_action_plans.*.description'  => 'required|string|min:3',
            'innovative_action_plans.*.unit_id'      => 'required|exists:units,id',
        ]);

        // 2. Perform safe database operations using a transaction
        DB::transaction(function () use ($validated, $request) {
            $subAreaId = 1; // Match your structural layout/needs

            // Auto-generate the next incremented KPI code securely
            $kpiCode = $this->generateNextKpiCode($subAreaId);
            
            // Resolve the Lead Responsible Unit directly from the logged-in user
            $responsibleUnit = $request->user()->governance?->name ?? 'Default Governance';

            // A. Create the Key Performance Indicator
            $kpi = KeyPerformanceIndicator::create([
                'sub_area_id'      => $subAreaId, 
                'code'             => $kpiCode,
                'description'      => $validated['kpi'],
                'responsible_unit' => $responsibleUnit, // Automatically assigned
                'sort_order'       => 0,
            ]);

            // B. Save each action plan and link to selected unit in the pivot table
            foreach ($validated['innovative_action_plans'] as $index => $plan) {
                $actionPlan = ActionPlan::create([
                    'kpi_id'      => $kpi->id,
                    'description' => $plan['description'],
                    'sort_order'  => $index,
                ]);

                // Sync pivot relation
                $actionPlan->units()->attach($plan['unit_id']);
            }
        });

        return redirect()->back();
    }

    /**
     * Helper logic to auto-increment the latest KPI code.
     */
    private function generateNextKpiCode($subAreaId)
    {
        $basePattern = "1.1";

        $latestKpi = KeyPerformanceIndicator::where('sub_area_id', $subAreaId)
            ->where('code', 'like', "{$basePattern}.%")
            ->orderByRaw('CAST(SUBSTRING_INDEX(code, ".", -1) AS UNSIGNED) DESC')
            ->first();

        if ($latestKpi) {
            $segments = explode('.', $latestKpi->code);
            $lastIndex = count($segments) - 1;
            $segments[$lastIndex] = (int)$segments[$lastIndex] + 1;
            
            return implode('.', $segments);
        }

        return "{$basePattern}.1";
    }
}