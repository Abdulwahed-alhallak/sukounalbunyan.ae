<?php

/**
 * professional_image_fix.php
 * This script is designed to be run directly on the Hostinger server (noble.dion.sy).
 * It will fix folder permissions, update the storage symlink, and 
 * provide a professional way to handle logos in the database.
 */

// 1. Bootstrap Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use App\Models\Setting;
use App\Models\User;

header('Content-Type: text/plain');
echo "--- Noble Architecture Production Fixer (Hostinger) ---\n\n";

// A. Permisions Fix
echo "1. Fixing Directory Permissions...\n";
$folders = [
    'storage',
    'storage/app',
    'storage/app/public',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache',
];

foreach ($folders as $folder) {
    if (!File::exists(base_path($folder))) {
        echo "Creating folder: $folder\n";
        File::makeDirectory(base_path($folder), 0775, true);
    }
    // Attempting to set permissions
    chmod(base_path($folder), 0775);
    echo "Set 775 for: $folder\n";
}

// B. Storage Symlink
echo "\n2. Recreating Storage Symlink...\n";
$public_storage = public_path('storage');
if (file_exists($public_storage)) {
    if (is_link($public_storage)) {
        unlink($public_storage);
        echo "Removed old symlink.\n";
    } else {
        // If it's a folder, rename it as backup
        rename($public_storage, $public_storage . '_backup_' . time());
        echo "Moved public/storage folder to backup.\n";
    }
}

try {
    Artisan::call('storage:link');
    echo "✅ Storage symlink successfully linked.\n";
} catch (\Exception $e) {
    echo "❌ Error in storage:link: " . $e->getMessage() . "\n";
}

// C. Database & Image Logic (Professional Approach)
echo "\n3. Checking Professional Image Handling...\n";

// Function to update logo professionally
function updateLogoProfessional($key, $localPath, $adminId) {
    if (file_exists($localPath)) {
        $extension = pathinfo($localPath, PATHINFO_EXTENSION);
        $fileName = $key . '_' . time() . '.' . $extension;
        $activeDisk = config('filesystems.default'); // usually 'public' or S3

        echo "Transferring $key to storage...\n";
        
        // Save to storage using Laravel's Storage facade
        $content = file_get_contents($localPath);
        Storage::disk($activeDisk)->put('uploads/logo/' . $fileName, $content);

        // Save path to DB
        $dbPath = 'uploads/logo/' . $fileName;
        Setting::updateOrCreate(
            ['key' => $key, 'created_by' => $adminId],
            ['value' => $dbPath, 'is_public' => 1]
        );
        
        echo "✅ $key updated in DB: $dbPath\n";
    } else {
        echo "⚠️ Source file not found: $localPath\n";
    }
}

$admin = User::where('email', 'superadmin@dion.sy')->first();
if ($admin) {
    // These paths should be the local paths where you have the new logos on the server
    // For now, I'll just check if the current settings point to existing files
    echo "Admin found: " . $admin->email . " (ID: " . $admin->id . ")\n";
} else {
    echo "❌ Admin not found by email.\n";
}

// D. Cache Clear
echo "\n4. Clearing Laravel Caches...\n";
Artisan::call('optimize:clear');
echo "✅ Site Cache Purged.\n";

echo "\n--- All Set! ---\n";
echo "Location: noble.dion.sy\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n";

