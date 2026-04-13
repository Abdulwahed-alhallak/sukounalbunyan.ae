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

try {
    echo "--- User Checks ---\n";
    $userCount = \DB::table('users')->count();
    echo "Total Users: $userCount\n";
    
    $admin = \DB::table('users')->where('email', 'admin@noblearchitecture.net')->first();
    if($admin) {
        echo "Admin User Found. ID: {$admin->id}, Type: {$admin->type}, Created By: {$admin->created_by}\n";
    } else {
        echo "Admin User NOT FOUND.\n";
    }

    echo "\n--- Module Checks ---\n";
    if(\Schema::hasTable('user_active_modules')) {
        $modules = \DB::table('user_active_modules')->get();
        echo "User Active Modules Count: " . $modules->count() . "\n";
    } else {
        echo "user_active_modules Table NOT FOUND.\n";
    }

    echo "\n--- Data Integrity Checks ---\n";
    // Check if there are users created by a non-existent user
    $orphanUsers = \DB::table('users')
        ->whereNotNull('created_by')
        ->whereNot('created_by', 0)
        ->whereNotIn('created_by', \DB::table('users')->pluck('id'))
        ->count();
    echo "Orphan Users (created_by not in users table): $orphanUsers\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

