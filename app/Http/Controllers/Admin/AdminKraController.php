<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminKraController extends Controller
{
    public function index()
    {
        $kras = DB::table('kras')->orderBy('code', 'asc')->get();

        return Inertia::render('admin/kras/index', [
            'kras' => $kras
        ]);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'code' => 'required|string|unique:kras,code',
        'title' => 'required|string|max:255', // 🌟 Changed from name to title
        'description' => 'nullable|string',
    ]);

    DB::table('kras')->insert([
        'code' => $validated['code'],
        'title' => $validated['title'], // 🌟 Changed from name to title
        'description' => $validated['description'],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return redirect()->back()->with('success', 'KRA created successfully.');
}
}