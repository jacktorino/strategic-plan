<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserApprovalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/accounts/index', [
            'pending' => User::query()
                ->where('status', User::STATUS_PENDING)
                ->orderBy('created_at')
                ->get(['id', 'name', 'email', 'created_at']),
            'decided' => User::query()
                ->whereIn('status', [User::STATUS_APPROVED, User::STATUS_REJECTED])
                ->with('approver:id,name')
                ->orderByDesc('approved_at')
                ->limit(25)
                ->get(['id', 'name', 'email', 'status', 'role', 'approved_at', 'approved_by']),
        ]);
    }

    public function approve(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'in:president,admin,staff'],
        ]);

        // forceFill bypasses the model's $fillable guard on purpose here —
        // status/role/approved_at/approved_by are never meant to be user
        // mass-assignable (that's what keeps registration safe), but this
        // is a trusted, server-side admin action with validated input.
        $user->forceFill([
            'status' => User::STATUS_APPROVED,
            'role' => $validated['role'],
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ])->save();

        // Optional: notify the user their account is active.
        // $user->notify(new AccountApproved());

        return back()->with('success', "{$user->name}'s account has been approved.");
    }

    public function reject(Request $request, User $user): RedirectResponse
    {
        $user->forceFill([
            'status' => User::STATUS_REJECTED,
            'approved_at' => now(),
            'approved_by' => $request->user()->id,
        ])->save();

        return back()->with('success', "{$user->name}'s registration has been rejected.");
    }
}