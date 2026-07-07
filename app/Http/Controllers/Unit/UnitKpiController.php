<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UnitKpiController extends Controller
{
    public function index() { return inertia('my/kpis/index'); }
}
