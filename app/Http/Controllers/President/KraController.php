<?php

namespace App\Http\Controllers\President;

use App\Http\Controllers\Controller;
use App\Models\Kra;
use Illuminate\Http\Request;

class KraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index() { return inertia('kras/index'); }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Kra $kra)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kra $kra)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kra $kra)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kra $kra)
    {
        //
    }
}
