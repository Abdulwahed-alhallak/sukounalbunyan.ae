<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Activating Account & Lead Modules for Sukoun ===\n\n";

$admin = DB::table('users')->where('email', 'admin@sukounalbunyan.ae')->first();
if (!$admin) {
    // Try the other admin email just in case
    $admin = DB::table('users')->where('type', 'superadmin')->first();
}

if ($admin) {
    echo "Found Admin: {$admin->name} (ID: {$admin->id})\n";
    
    $modules = ['Account', 'Lead', 'Rental', 'ProductService'];
    
    foreach ($modules as $module) {
        $exists = DB::table('user_module')
            ->where('user_id', $admin->id)
            ->where('module', $module)
            ->exists();
            
        if (!$exists) {
            DB::table('user_module')->insert([
                'user_id' => $admin->id,
                'module' => $module,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            echo "Activated module: {$module}\n";
        } else {
            echo "Module already active: {$module}\n";
        }
    }
} else {
    echo "Admin user not found.\n";
}

// 2. Ensure AddOns are enabled globally
$addOns = ['Account', 'Lead', 'Rental'];
foreach ($addOns as $addon) {
    DB::table('add_ons')->updateOrInsert(
        ['name' => $addon],
        ['is_enable' => 1, 'updated_at' => now()]
    );
    echo "Global AddOn enabled: {$addon}\n";
}

echo "\n=== Module Activation Complete ===\n";
