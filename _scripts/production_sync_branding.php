<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

$admin = User::where('type', 'superadmin')->first();

if (!$admin) {
    echo "Superadmin not found.\n";
    exit;
}

$brand_settings = [
    'logo_dark' => 'logo_dark.png',
    'logo_light' => 'logo_light.png',
    'favicon' => 'favicon.png',
    'titleText' => 'Noble Architecture',
    'footerText' => 'Copyright © 2026 Noble Architecture SaaS',
    'metaTitle' => 'Noble Architecture - All-in-One Business Management',
];

foreach ($brand_settings as $key => $value) {
    Setting::updateOrCreate(
        ['key' => $key, 'created_by' => $admin->id],
        ['value' => $value]
    );
}

// Clear production cache
try {
    Artisan::call('optimize:clear');
    Artisan::call('view:clear');
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    echo "Cache cleared on server.\n";
} catch (\Exception $e) {
    echo "Error clearing cache: " . $e->getMessage() . "\n";
}

echo "Production rebranding complete!\n";

