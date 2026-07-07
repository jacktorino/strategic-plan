<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class KpiSubmissionController extends Controller
{
    public function index() { return inertia('admin/kpi-submissions/index'); }
}
