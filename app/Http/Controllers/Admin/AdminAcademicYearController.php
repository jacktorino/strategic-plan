<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminAcademicYearController extends Controller
{
    public function index() { return inertia('admin/academic-years/index'); }
}
