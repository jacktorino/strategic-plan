<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminKpiController extends Controller
{
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
                    
                    // Calculate running average for THIS specific year
                    $kpi->average_compliance = count($kpi->submissions) > 0 
                        ? round($kpi->submissions->avg('compliance_percentage')) 
                        : 0;

                    // 🌟 Dynamically map the correct historical or active target column based on the selection
                    // Looks up column string suffix matching target format: target_2024, target_2027, etc.
                    $yearSuffix = explode('-', $selectedAY)[1] ?? '2027'; 
                    $targetColumn = 'target_' . $yearSuffix;
                    
                    // Fallback to a default if the column doesn't exist, otherwise grab its value safely
                    $kpi->active_target = $kpi->$targetColumn ?? '100%';

                    return $kpi;
                });
            return $kra;
        });

        return Inertia::render('admin/kpis/index', [
            'kras' => $kras,
            'selectedAY' => $selectedAY // Send this back to keep state synchronized in the UI
        ]);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'kra_id'           => 'required|exists:kras,id',
        'code'             => 'required|string',
        'name'             => 'required|string',
        'responsible_unit' => 'required|string', // 🌟 Added validation
        'target_2027'      => 'required|string',
        'target_2028'      => 'required|string',
        'target_2029'      => 'required|string',
    ]);

    DB::table('kpis')->insert([
        'kra_id'           => $validated['kra_id'],
        'code'             => $validated['code'],
        'name'             => $validated['name'],
        'responsible_unit' => $validated['responsible_unit'], // 🌟 Saved to DB
        'target_2027'      => $validated['target_2027'],
        'target_2028'      => $validated['target_2028'],
        'target_2029'      => $validated['target_2029'],
        'created_at'       => now(),
        'updated_at'       => now(),
    ]);

    return redirect()->back()->with('success', 'KPI with assigned responsible unit created.');
}
}