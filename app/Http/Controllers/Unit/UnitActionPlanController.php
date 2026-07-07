<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UnitActionPlanController extends Controller
{
    public function index() { return inertia('my/action-plans/index'); }
}
