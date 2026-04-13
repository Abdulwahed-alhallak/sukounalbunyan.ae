<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config([
    'database.connections.mysql.host' => '193.203.166.17',
    'database.connections.mysql.database' => 'u256167180_noble',
    'database.connections.mysql.username' => 'u256167180_noble',
    'database.connections.mysql.password' => 'm:&!u>Do!P3',
]);

use App\Models\User;
use App\Models\Plan;

try {
    $user = User::find(2);
    echo "User: " . $user->email . "\n";
    echo "Active Plan: " . $user->active_plan . "\n";
    $plan = Plan::find($user->active_plan);
    echo "Plan Modules (DB): " . json_encode($plan->modules) . "\n";
    
    $modules = \App\Models\UserActiveModule::where('user_id', 2)->pluck('module')->toArray();
    echo "UserActiveModules: " . json_encode($modules) . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

