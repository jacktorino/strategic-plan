<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): mixed
    {
        // Fortify already logged the new user in — immediately log them
        // back out so a pending/rejected account can't use the session
        // it was just granted before an admin has approved it.
        Auth::guard('web')->logout();

        /** @var Request $request */
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->wantsJson()) {
            return response()->json(['status' => 'pending'], 201);
        }

        return redirect()
            ->route('registration.pending')
            ->with('status', 'Thanks for registering! Your account is awaiting administrator approval.');
    }
}