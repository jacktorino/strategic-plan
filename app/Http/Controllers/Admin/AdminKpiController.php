<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

class AdminKpiController extends Controller
{
    public function index()
    {
        return inertia('admin/kpis/index');
    }
}