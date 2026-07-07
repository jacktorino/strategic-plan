<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UnitReportController extends Controller
{
    public function index() { return inertia('my/reports/index'); }
}
