<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Kra;

class AdminKraController extends Controller
{
    /**
     * Display a listing of Key Result Areas.
     */
    public function index(): Response
    {
        return Inertia::render('admin/kras/index', [
            'kras' => Kra::all(), // Passing data directly down to React
        ]);
    }
}