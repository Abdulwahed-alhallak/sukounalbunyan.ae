<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Plan;
use App\Models\UserActiveModule;
use App\Models\AddOn;

$email = 'admin@noblearchitecture.net';
$user = User::where('email', $email)->first();

if (!$user) {
    // Try admin@noble.com as fallback
    $user = User::where('email', 'admin@noble.com')->first();
    if ($user) {
        echo "Found user as admin@noble.com. Changing to $email...\n";
        $user->email = $email;
        $user->save();
    } else {
        echo "User $email not found. Creating it...\n";
        $user = User::create([
            'name' => 'noble architecture',
            'email' => $email,
            'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
            'type' => 'company',
            'lang' => 'ar'
        ]);
    }
}

// Ensure user is company type to have a subscription or super admin
$user->type = 'company';
$user->save();

echo "Working on User: {$user->email} (ID: {$user->id})\n";

// 1. Enable ALL Addons in the system
echo "Enabling all AddOns in the system...\n";
AddOn::query()->update(['is_enable' => 1]);

// 2. Get All Modules
$allModules = AddOn::pluck('module')->toArray();
echo "Found " . count($allModules) . " modules in add_ons table.\n";

// 3. Give Lifetime Subscription to User
$user->plan_expire_date = '2099-12-31';
if (!$user->active_plan) {
    $user->active_plan = 1;
}
$user->save();

// 4. Activate all modules for this user specifically
foreach ($allModules as $mod) {
    UserActiveModule::updateOrCreate([
        'user_id' => $user->id,
        'module' => $mod
    ]);
}
echo "All modules specifically activated for user ID {$user->id}.\n";

// 5. Update the Plan to be Unlimited
$plan = Plan::find($user->active_plan);
if ($plan) {
    $plan->modules = $allModules; // Casted as array in model
    
    // Dynamically check columns to avoid SQL errors
    $columns = \Schema::getColumnListing('plans');
    
    $updateData = [
        'modules' => $allModules,
        'status' => 1
    ];
    
    if (in_array('number_of_users', $columns)) $updateData['number_of_users'] = -1;
    if (in_array('max_users', $columns)) $updateData['max_users'] = -1;
    if (in_array('storage_limit', $columns)) $updateData['storage_limit'] = -1;
    
    // Set some large numbers if -1 is not allowed
    if ($updateData['number_of_users'] == -1) $updateData['number_of_users'] = 999999;
    if ($updateData['storage_limit'] == -1) $updateData['storage_limit'] = 999999;

    $plan->update($updateData);
    echo "Plan {$plan->name} (ID: {$plan->id}) updated with all modules and high limits.\n";
}

// 6. Clear Cache
\Artisan::call('cache:clear');
echo "Cache cleared.\n";

echo "SUCCESS! admin@noblearchitecture.net now has lifetime access to everything.\n";
