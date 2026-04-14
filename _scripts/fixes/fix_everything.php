<?php
// fix_all.php - Emergency Production Fix

// 1. Delete hot file to fix CSS 404s
$hotFile = __DIR__ . '/public/hot';
if (file_exists($hotFile)) {
    unlink($hotFile);
    echo "HOT file deleted. CSS should work now.<br>";
}

// 2. Load Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Plan;
use App\Models\Utility;

// 3. Disable ReCAPTCHA in DB
Utility::setSetting('recaptcha_enabled', 'off');
echo "ReCAPTCHA disabled in database.<br>";

// 4. Activate Lifetime Plan for NOBLE
$user = User::where('name', 'NOBLE')->orWhere('email', 'admin@example.com')->first();
if ($user) {
    $plan = Plan::updateOrCreate(
        ['name' => 'Legacy Master Plan'],
        [
            'price' => 0,
            'duration' => 'Lifetime',
            'enable_crm' => 1,
            'enable_hrm' => 1,
            'enable_account' => 1,
            'enable_pms' => 1,
            'enable_pos' => 1,
            'modules' => 'all',
            'max_users' => -1,
            'max_customers' => -1,
            'max_vendors' => -1
        ]
    );
    $user->plan_id = $plan->id;
    $user->plan_expire_date = null;
    $user->save();
    echo "LIFETIME ACTIVATED for " . $user->name . ".<br>";
}

echo "DONE. Please delete this file for security.";
