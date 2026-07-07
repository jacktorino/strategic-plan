<?php

namespace App\Http\Controllers\President;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index() { return inertia('academic-years/index'); }
}
