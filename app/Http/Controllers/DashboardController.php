<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // Dynamically compile a small bundle of stats depending on who is logged in
        $metrics = match ($user->role) {
            'admin' => [
                'total_units' => 14,
                'pending_proposals' => 3,
                'active_kpis' => 42,
            ],
            'staff' => [
                'my_assigned_kpis' => 5,
                'completed_tasks' => 12,
                'pending_tasks' => 4,
            ],
            'president' => [
                'overall_completion' => '74%',
                'total_kras' => 5,
                'critical_alerts' => 2,
            ],
            default => [],
        };

        return Inertia::render('dashboard', [
            'role' => $user->role,
            'unit' => $user->responsible_unit,
            'metrics' => $metrics
        ]);
    }
}