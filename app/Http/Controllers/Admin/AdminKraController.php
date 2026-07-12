<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminKraController extends Controller
{
    public function index(): Response
    {
        $kras = Kra::query()
            ->withCount('subAreas')
            ->orderBy('number')
            ->get();

        return Inertia::render('admin/kras/index', [
            'kras' => $kras,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => ['required', 'integer', 'unique:key_result_areas,number'],
            'title' => ['required', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:255'],
        ]);

        Kra::create($validated);

        return redirect()->back()->with('success', 'KRA created successfully.');
    }

    public function storeSubArea(Request $request, Kra $kra)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:kra_sub_areas,code'],
            'title' => ['required', 'string', 'max:255'],
        ]);

        $kra->subAreas()->create([
            'code' => $validated['code'],
            'title' => $validated['title'],
            'sort_order' => $kra->subAreas()->count(),
        ]);

        return redirect()->back()->with('success', 'Sub-area created successfully.');
    }
}