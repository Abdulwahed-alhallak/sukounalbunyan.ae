<?php

$user = \App\Models\User::where('email', 'admin@noblearchitecture.net')->first();
$plan = \App\Models\Plan::orderBy('id', 'desc')->first(); // Usually Professional Plan which has all modules

if ($user && $plan) {
    if (function_exists('assignPlan')) {
         assignPlan($user->id, $plan->id);
    } else {
         $user->active_plan = $plan->id;
         $user->save();
    }
    
    // Explicitly set the expire date to Lifetime (NULL or far future)
    $user->plan_expire_date = null; // Sometimes null handles lifetime, sometimes a far date.
    $user->trial_expire_date = null;
    $user->is_trial_done = 1;

    // Optional: Maximize capacities
    $user->storage_limit = 999999999;
    $user->total_user = -1; // Unlimited users
    $user->save();

    // Check if there is an active_module column in users or workspaces to assign all from plan
    if (\Schema::hasColumn('users', 'active_module')) {
        $user->active_module = implode(',', $plan->modules ?? []);
        $user->save();
    }
    
    // Update active workspace if applicable
    $workspace = \App\Models\Workspace::where('created_by', $user->id)->first();
    if ($workspace) {
        $workspace->active_modules = is_array($plan->modules) ? implode(',', $plan->modules) : $plan->modules;
        $workspace->save();
    }

    echo "✅ Success: Noble Architecture Company upgraded to LIFETIME PLAN with ALL MODULES.\n";
} else {
    echo "❌ Error: Could not find user or plan.\n";
}
