<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Plan;
use App\Models\AddOn;
use App\Models\UserActiveModule;
use Illuminate\Support\Facades\Artisan;

$email = 'admin@noblearchitecture.net';
$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found.\n";
    exit;
}

echo "Found user: " . $user->name . " (ID: " . $user->id . ")\n";

// 1. Enable ALL system modules
echo "Enabling all system add-ons...\n";
AddOn::query()->update(['is_enable' => 1]);
$all_modules = AddOn::pluck('module')->toArray();
echo "Total modules enabled: " . count($all_modules) . "\n";

// 2. Grant lifetime plan
echo "Setting lifetime subscription (2099)...\n";
$user->plan_expire_date = '2099-12-31';
$user->save();

// 3. Update the user's active plan with ALL modules
$planId = $user->active_plan ?: 1;
$plan = Plan::find($planId);
if ($plan) {
    echo "Updating plan '" . $plan->name . "' with all modules...\n";
    $plan->modules = $all_modules;
    $plan->number_of_users = -1; // Unlimited
    $plan->storage_limit = 999999; // Huge storage
    $plan->save();
}

// 4. Also add all modules to user_active_modules for redundancy
echo "Syncing user_active_modules...\n";
foreach ($all_modules as $module) {
    UserActiveModule::updateOrCreate(
        ['user_id' => $user->id, 'module' => $module],
        []
    );
}

// 5. Clear all caches
echo "Clearing caches...\n";
Artisan::call('optimize:clear');

echo "SUCCESS: Lifetime access and all services enabled for " . $email . " on domain noble.dion.sy\n";
