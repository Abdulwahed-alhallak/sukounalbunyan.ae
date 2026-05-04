<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Setting;
use App\Models\User;

$admin = User::where('type', 'superadmin')->first();

$settings = [
    'logo_dark' => 'logo_dark.png',
    'logo_light' => 'logo_light.png',
    'favicon' => 'favicon.png',
    'titleText' => 'Sukoun Albunyan',
    'footerText' => 'Copyright © 2026 Sukoun Albunyan SaaS',
    'metaTitle' => 'Sukoun Albunyan - All-in-One Business Management',
    'metaKeywords' => 'Sukoun Albunyan, ERP, CRM, HRM, Accounting, POS, Project Management',
    'metaDescription' => 'Modern all-in-one business management platform.',
];

foreach ($settings as $key => $value) {
    Setting::updateOrCreate(
        ['key' => $key, 'created_by' => $admin->id],
        ['value' => $value]
    );
}

// Clear cache
\Illuminate\Support\Facades\Artisan::call('optimize:clear');
echo "Logos and branding updated in database.\n";

