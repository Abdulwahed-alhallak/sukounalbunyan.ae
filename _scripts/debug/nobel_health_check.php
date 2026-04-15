<?php

/**
 * noble_health_check.php
 * Diagnostic and auto-fix for noble.dion.sy 500 errors.
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

header('Content-Type: text/plain');
echo "--- NOBEL HEALTH CHECK ---\n\n";

// 1. Check DB Connection
try {
    DB::connection()->getPdo();
    echo "✅ DB Connection: OK\n";
} catch (\Exception $e) {
    echo "❌ DB Connection: FAILED (" . $e->getMessage() . ")\n";
}

// 2. Check Table columns for common failures
$tables = ['plans', 'settings', 'users', 'add_ons'];
foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        echo "✅ Table '$table': EXISTS\n";
    } else {
        echo "❌ Table '$table': MISSING\n";
    }
}

// 3. Check for specific image column in plans
if (Schema::hasColumn('plans', 'image')) {
    echo "✅ Plans Column 'image': EXISTS\n";
} else {
    echo "⚠️ Plans Column 'image': MISSING (Adding now...)\n";
    try {
        Schema::table('plans', function($table) {
            $table->string('image')->nullable()->after('description');
        });
        echo "✅ Plans Column 'image': ADDED SUCCESSFULLY\n";
    } catch (\Exception $e) {
        echo "❌ Plans Column 'image': FAILED TO ADD (" . $e->getMessage() . ")\n";
    }
}

// 4. Force Clear ALL Cache (Solves most 500s)
echo "\n--- SYSTEM PURGE ---\n";
try {
    Artisan::call('optimize:clear');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    echo "✅ System Cache Purged.\n";
} catch (\Exception $e) {
    echo "❌ System Cache Purge FAILED: " . $e->getMessage() . "\n";
}

// 5. Check Permissions
$paths = ['storage', 'bootstrap/cache'];
foreach ($paths as $path) {
    $abs = base_path($path);
    if (is_writable($abs)) {
        echo "✅ Path '$path': WRITABLE\n";
    } else {
        echo "❌ Path '$path': NOT WRITABLE (Fixing...)\n";
        @chmod($abs, 0775);
    }
}

echo "\n--- DIAGNOSTIC COMPLETE ---\n";

