<?php

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$permissions = [
    'manage-ai-assistant', 
    'manage-ai-assistant-settings', 
    'manage-slack-integration', 
    'manage-slack-settings', 
    'manage-telegram-integration', 
    'manage-telegram-settings', 
    'manage-twilio-integration', 
    'manage-twilio-settings', 
    'manage-webhook-integration', 
    'manage-webhook-settings', 
    'manage-google-captcha', 
    'manage-google-captcha-settings', 
    'manage-landing-page', 
    'manage-landing-page-settings', 
    'manage-stripe-integration', 
    'manage-stripe-settings', 
    'manage-paypal-integration', 
    'manage-paypal-settings'
];

echo "Registering " . count($permissions) . " new permissions...\n";

foreach ($permissions as $p) {
    Permission::findOrCreate($p, 'web');
    echo "✅ Registered: $p\n";
}

$roles = ['company', 'superadmin'];
foreach ($roles as $roleName) {
    $role = Role::where('name', $roleName)->first();
    if ($role) {
        $role->givePermissionTo($permissions);
        echo "⭐️ Assigned to role: $roleName\n";
    }
}

echo "\nSYNC COMPLETE. All new modules are now permissioned for Admin.\n";
