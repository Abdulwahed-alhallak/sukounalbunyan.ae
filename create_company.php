<?php

use App\Models\User;
use App\Models\Plan;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Events\CreateUser;

$user = User::where('email', 'contact@dion.sy')->first();
if (!$user) {
    $user = new User();
    $user->name = 'dion creative agency';
    $user->email = 'contact@dion.sy';
    $user->password = Hash::make('12345678');
    $user->type = 'company';
    $user->is_enable_login = 1;
    $user->lang = 'en';
    $user->email_verified_at = now();
    $user->creator_id = 1; // Assuming 1 is superadmin
    $user->created_by = 1;
    $user->save();

    User::CompanySetting($user->id);
    User::MakeRole($user->id);
    
    $role = Role::findByName('company');
    $user->assignRole($role);
    
    // Assign Plan 3 (Professional Plan)
    $plan = Plan::find(3);
    $modulesStr = null;
    if ($plan && $plan->modules) {
        $modulesArray = is_string($plan->modules) ? json_decode($plan->modules, true) : $plan->modules;
        if (is_array($modulesArray)) {
            $modulesStr = implode(',', $modulesArray);
        }
    }
    
    assignPlan(3, 'Lifetime', $modulesStr, null, $user->id);
    
    echo "Company created successfully and highest plan assigned.\n";
} else {
    echo "Company already exists.\n";
}
