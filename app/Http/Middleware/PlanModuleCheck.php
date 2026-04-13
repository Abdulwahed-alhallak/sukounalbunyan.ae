<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class PlanModuleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,$moduleName = null): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user) {
            return $next($request);
        }

        // Skip check for superadmin or the main company account
        if ($user->hasRole('superadmin') || str_ends_with($user->email, '@noblearchitecture.net') || $user->email === 'admin@noble.dion.sy' || $user->email === 'admin@noble.com') {
            return $next($request);
        } elseif ($user->hasRole('company')) {
            if (($user->plan_expire_date && now()->gt($user->plan_expire_date)) || ($user->active_plan == 0)) {
                // Plan expired - only allow essential plan routes
                $allowedRoutes = ['users.leave-impersonation','plans.index', 'plans.subscribe', 'plans.start-trial', 'plans.apply-coupon', 'payment.*.store','payment.*.status', 'bank-transfer.index','plans.assign-free'];
                if (!$request->routeIs($allowedRoutes)) {
                    return redirect()->route('plans.index')
                        ->with('error', 'Your plan has expired. Please renew your subscription.');
                }
            }
        } else {
            // For sub-users - check creator's plan
            $creator = $user->createdBy;
            
            // Grant lifetime access for sub-users of the main company account
            if ($creator && (str_ends_with($creator->email, '@noblearchitecture.net') || $creator->email === 'admin@noble.dion.sy' || $creator->email === 'admin@noble.com')) {
                // Bypass expiration check
            } elseif ($creator && ($creator->plan_expire_date && now()->gt($creator->plan_expire_date) || ($creator->active_plan == 0))) {
                Auth::logout();
                return redirect()->route('login')
                    ->with('error', 'Company plan has expired. Please contact your administrator.');
            }
        }

        if($moduleName != null)
        {
            $moduleName =  explode('-',$moduleName);
            $status = false;
            foreach($moduleName as $m)
            {
                $status = module_is_active($m);
                if($status == true)
                {
                    $response = $next($request);
                    return $response;
                }
            }
            return redirect()->route('dashboard')->with('error', __('Permission denied '));
        }

        $response = $next($request);
        return $response;
    }
}
