<?php

/**
 * setup_production.php
 * This script ensures that all necessary directories have the correct permissions
 * and that the storage symlink is properly configured for the domain.
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

echo "--- Noble Architecture Production Setup ---\n";

$isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';

$paths = [
    base_path('storage'),
    base_path('storage/app'),
    base_path('storage/app/public'),
    base_path('storage/app/public/media'),
    base_path('storage/framework'),
    base_path('storage/framework/cache'),
    base_path('storage/framework/sessions'),
    base_path('storage/framework/views'),
    base_path('storage/logs'),
    base_path('bootstrap/cache'),
];

// 1. Create directories if they don't exist
foreach ($paths as $path) {
    if (!File::exists($path)) {
        echo "Creating directory: $path\n";
        File::makeDirectory($path, 0775, true);
    }
}

// 2. Set Permissions (Linux only)
if (!$isWindows) {
    echo "Setting Linux permissions (chmod 775)...\n";
    foreach (['storage', 'bootstrap/cache'] as $dir) {
        $fullPath = base_path($dir);
        exec("chmod -R 775 $fullPath");
        exec("chown -R www-data:www-data $fullPath 2>/dev/null"); // Try to set owner if possible
    }
} else {
    echo "Detected Windows environment. Skipping chmod.\n";
}

// 3. Recreate Storage Symlink
echo "Updating storage symlink...\n";
$publicStoragePath = public_path('storage');
if (file_exists($publicStoragePath)) {
    if (is_link($publicStoragePath)) {
        echo "Removing existing symlink...\n";
        unlink($publicStoragePath);
    } else {
        echo "Warning: public/storage is a real directory, moving it to storage/app/public better...\n";
        // If it's a directory, we might want to move its content or just delete it if empty
    }
}

try {
    Artisan::call('storage:link');
    echo "✅ Storage symlink created successfully.\n";
} catch (\Exception $e) {
    echo "❌ Error creating storage symlink: " . $e->getMessage() . "\n";
}

// 4. Clear Cache
echo "Clearing system cache...\n";
Artisan::call('optimize:clear');
echo "✅ System cache cleared.\n";

echo "--- Setup Complete ---\n";
echo "You can now test image uploads.\n";

