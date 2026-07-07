<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminActionPlanController extends Controller
{
    public function index() { return inertia('admin/action-plans/index'); }
}
