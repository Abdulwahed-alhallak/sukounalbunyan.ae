<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Remote Hostinger Database Configuration
config([
    'database.connections.mysql.host' => '193.203.166.17',
    'database.connections.mysql.database' => 'u256167180_noble',
    'database.connections.mysql.username' => 'u256167180_noble',
    'database.connections.mysql.password' => 'm:&!u>Do!P3',
]);

use App\Models\User;
use App\Models\Plan;
use App\Models\AddOn;
use App\Models\UserActiveModule;
use Illuminate\Support\Facades\DB;

$email = 'admin@noblearchitecture.net';

try {
    // 0. Verify connection
    DB::connection()->getPdo();
    echo "Successfully connected to remote production database.\n";

    $user = User::where('email', $email)->first();

    if (!$user) {
        echo "User not found on remote database.\n";
        exit;
    }

    echo "Found user: " . $user->name . " (ID: " . $user->id . ")\n";

    // 1. Enable ALL system modules (AddOn table)
    echo "Enabling all system add-ons...\n";
    AddOn::query()->update(['is_enable' => 1]);
    $all_modules = AddOn::pluck('module')->toArray();
    echo "Total modules enabled: " . count($all_modules) . "\n";

    // 2. Grant lifetime plan expiration
    echo "Setting lifetime subscription (2099)...\n";
    $user->plan_expire_date = '2099-12-31';
    $user->active_plan = $user->active_plan ?: 1; 
    $user->save();

    // 3. Update the user's active plan with ALL modules
    $planId = $user->active_plan;
    $plan = Plan::find($planId);
    if ($plan) {
        echo "Updating plan '" . $plan->name . "' with all modules...\n";
        $plan->modules = $all_modules;
        $plan->number_of_users = -1; // Unlimited
        $plan->storage_limit = 999999; // Huge storage
        $plan->save();
        echo "Plan ID " . $planId . " updated.\n";
    } else {
        echo "Warning: Active plan ID " . $planId . " not found.\n";
    }

    // 4. Also add all modules to user_active_modules for redundancy
    echo "Syncing user_active_modules table for user " . $user->id . "...\n";
    foreach ($all_modules as $module) {
        UserActiveModule::updateOrCreate(
            ['user_id' => $user->id, 'module' => $module],
            []
        );
    }
    echo "UserActiveModule sync complete.\n";

    // 5. Update system name in settings table too
    echo "Updating system name toNobleArchitecture in remote settings...\n";
    DB::table('settings')->where('key', 'titleText')->update(['value' => 'Sukoun Albunyan']);
    DB::table('settings')->where('key', 'footerText')->update(['value' => 'Copyright © 2026 Sukoun Albunyan SaaS']);

    echo "\nSUCCESS: Remote production database updated. Lifetime access granted for " . $email . ".\n";
    echo "Please clear the server cache manually or wait for next cache cycle.\n";

} catch (\Exception $e) {
    echo "Error processing remote renewal: " . $e->getMessage() . "\n";
    if (str_contains($e->getMessage(), "actively refused")) {
        echo "HINT: Your local IP addressing is likely not whitelisted for remote MySQL access in Hostinger.\n";
    }
}


