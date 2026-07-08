<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== User::STATUS_APPROVED) {
            $message = $user->isRejected()
                ? 'Your registration was not approved. Please contact the administrator.'
                : 'Your account is awaiting administrator approval. You will be notified once it is activated.';

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('registration.pending')
                ->with('status', $message);
        }

        return $next($request);
    }
}