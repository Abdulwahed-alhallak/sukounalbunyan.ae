<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class IsMissionCommand
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            abort(403, 'Unauthorized access.');
        }

        // Allow if user is superadmin
        if ($user->type === 'superadmin') {
            return $next($request);
        }

        // Allow if user is Dion Creative agency (by name or email domain)
        // Hard-checking to ensure highest security for this module.
        if ($user->type === 'company' && (
            str_contains(strtolower($user->email), '@dion.sy') || 
            strtolower($user->name) === 'dion creative' ||
            strtolower($user->name) === 'dion creative agency' ||
            strtolower($user->name) === 'Noble Architecture'
        )) {
            return $next($request);
        }

        abort(403, 'Classified Mission Command Ecosystem. Access Denied.');
    }
}

