<?php
namespace App\Http\Controllers\Unit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UnitKpiSubmissionController extends Controller
{
    
public function index() { return inertia('my/kpi-submissions/index'); }
public function create()
    {
        return inertia('my/kpi-submissions/create');
    }
    // App\Http\Controllers\Unit\UnitKpiSubmissionController.php
public function store(Request $request)
{
    $validated = $request->validate([
        'kpi_id'                => 'required|exists:kpis,id',
        'academic_year'         => 'required|string',
        'submission_month'      => 'required|string',
        'compliance_percentage' => 'required|integer|between:0,100',
        'remarks'               => 'nullable|string',
    ]);

    // Check if they already submitted for this specific month/year combination to update it instead of making duplicates
    DB::table('kpi_submissions')->updateOrInsert(
        [
            'kpi_id'           => $validated['kpi_id'],
            'academic_year'    => $validated['academic_year'],
            'submission_month' => $validated['submission_month']
        ],
        [
            'compliance_percentage' => $validated['compliance_percentage'],
            'remarks'               => $validated['remarks'],
            'updated_at'            => now(),
            'created_at'            => now()
        ]
    );

    return redirect()->back()->with('success', 'Monthly compliance metrics submitted successfully.');
}
}