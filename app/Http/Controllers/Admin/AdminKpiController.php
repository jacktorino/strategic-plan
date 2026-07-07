<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminKpiController extends Controller
{
    public function index()
    {
        // Fetch KRAs and map their corresponding KPIs from the database
        $kras = DB::table('kras')->orderBy('code', 'asc')->get()->map(function ($kra) {
            $kra->kpis = DB::table('kpis')
                ->where('kra_id', $kra->id)
                ->orderBy('code', 'asc')
                ->get();
            return $kra;
        });

        return Inertia::render('admin/kpis/index', [
            'kras' => $kras
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kra_id' => 'required|exists:kras,id',
            'code' => 'required|string',
            'name' => 'required|string',
            'target_2024' => 'required|string',
            'target_2025' => 'required|string',
            'target_2026' => 'required|string',
        ]);

        DB::table('kpis')->insert([
            'kra_id' => $validated['kra_id'],
            'code' => $validated['code'],
            'name' => $validated['name'],
            'target_2024' => $validated['target_2024'],
            'target_2025' => $validated['target_2025'],
            'target_2026' => $validated['target_2026'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'KPI created successfully.');
    }
}