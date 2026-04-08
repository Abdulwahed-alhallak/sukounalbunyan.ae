<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \DB::table('users')->where('type', 'owner')->orWhere('type', 'super admin')->get();

echo "Users and their Plans/Services:\n";
foreach($users as $user) {
    echo "---------------------------\n";
    echo "User: {$user->name} ({$user->email}) - Type: {$user->type}\n";
    echo "Active Plan ID: {$user->active_plan}\n";
    
    $plan = \DB::table('plans')->where('id', $user->active_plan)->first();
    if ($plan) {
        echo "Plan Name: {$plan->name}\n";
        echo "Plan Modules (Services): " . $plan->modules . "\n";
    } else {
        echo "Plan: NONE IN DB\n";
    }
    
    // Check if there is user_active_modules table data
    if (\Schema::hasTable('user_active_modules')) {
        $active_modules = \DB::table('user_active_modules')->where('user_id', $user->id)->get();
        $moduleList = $active_modules->pluck('module')->toArray();
        echo "User Active Modules (from DB table): " . json_encode($moduleList) . "\n";
    }
}

// Ensure the plans match expected default services.
