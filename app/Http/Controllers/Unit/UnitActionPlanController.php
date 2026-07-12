<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UnitActionPlanController extends Controller
{
    /**
     * /my/action-plans — action plans belonging to KPIs under the current
     * staff member's assigned KRA sub-area.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $subArea = $user->kraSubArea;

        if (! $subArea) {
            return Inertia::render('my/action-plans/index', [
                'subArea' => null,
                'actionPlans' => [],
            ]);
        }

        $subArea->load(['kpis.actionPlans.units:id,code,name']);

        $actionPlans = $subArea->kpis->flatMap(function ($kpi) {
            return $kpi->actionPlans->map(function ($plan) use ($kpi) {
                return [
                    'id' => $plan->id,
                    'description' => $plan->description,
                    'units' => $plan->units,
                    'kpi' => [
                        'id' => $kpi->id,
                        'code' => $kpi->code,
                        'description' => $kpi->description,
                    ],
                ];
            });
        })->values();

        return Inertia::render('my/action-plans/index', [
            'subArea' => [
                'code' => $subArea->code,
                'title' => $subArea->title,
            ],
            'actionPlans' => $actionPlans,
        ]);
    }
}