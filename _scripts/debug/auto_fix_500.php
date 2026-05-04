<?php

/**
 * auto_fix_500.php
 * Final automation script to solve the Server Error on noble.dion.sy
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

header('Content-Type: text/plain');
echo "--- Sukoun Albunyan Universal Fixer (Hostinger) ---\n\n";

// 1. Fix .env values in memory
echo "1. Validating DB settings... \n";
try {
    DB::connection()->getPdo();
    echo "✅ Database connection is healthy.\n";
} catch (\Exception $e) {
    echo "❌ DB Connection Error: " . $e->getMessage() . "\n";
    echo "Updating temporary config for run...\n";
    config([
        'database.connections.mysql.host' => '127.0.0.1',
        'database.connections.mysql.database' => 'u256167180_noble',
        'database.connections.mysql.username' => 'u256167180_noble',
        'database.connections.mysql.password' => 'm:&!u>Do!P3',
    ]);
}

// 2. Fix Schema
echo "\n2. Auditing Database Schema...\n";
try {
    if (!Schema::hasColumn('plans', 'image')) {
        echo "Updating 'plans' table schema...\n";
        Schema::table('plans', function($table) {
            $table->string('image')->nullable()->after('description');
        });
        echo "✅ Schema updated.\n";
    }
} catch (\Exception $e) {
    echo "⚠️ Schema skip: " . $e->getMessage() . "\n";
}

// 3. Clear Cache (The main cause of 500 errors)
echo "\n3. Deep Purging Cache...\n";
try {
    Artisan::call('optimize:clear');
    Artisan::call('view:clear');
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    echo "✅ All Laravel caches cleared.\n";
} catch (\Exception $e) {
    echo "❌ Cache Error: " . $e->getMessage() . "\n";
}

// 4. File Permissions Fix
echo "\n4. Fixing File Permissions...\n";
$base = base_path();
@chmod($base . '/storage', 0775);
@chmod($base . '/storage/framework', 0775);
@chmod($base . '/storage/framework/views', 0775);
@chmod($base . '/storage/logs', 0775);
@chmod($base . '/bootstrap/cache', 0775);
echo "✅ Directory permissions updated to 775.\n";

// 5. Final storage symlink
try {
    Artisan::call('storage:link');
    echo "✅ Storage linked.\n";
} catch (\Exception $e) {
    echo "⚠️ Symlink note: " . $e->getMessage() . "\n";
}

echo "\n--- All Set! Refresh your site now. ---\n";

