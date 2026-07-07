<?php
namespace App\Http\Controllers\Unit;
use App\Http\Controllers\Controller;

class UnitKpiSubmissionController extends Controller
{
    public function create()
    {
        return inertia('my/kpi-submissions/create');
    }
}