<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     * Redirects users to their specific workspace based on their database role.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $role = $request->user()->role;

        return match ($role) {
            'admin'     => redirect()->route('admin.kras'),
            'staff'     => redirect()->route('my.kpis'),
            'president' => redirect()->route('kras.index'),
            default     => abort(403, 'Unauthorized role assignment.'),
        };
    }
}