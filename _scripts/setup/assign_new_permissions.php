<?php

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$permissions = [
    'manage-ai-assistant' => 'AIAssistant', 
    'manage-ai-assistant-settings' => 'AIAssistant', 
    'manage-slack-integration' => 'Slack', 
    'manage-slack-settings' => 'Slack', 
    'manage-telegram-integration' => 'Telegram', 
    'manage-telegram-settings' => 'Telegram', 
    'manage-twilio-integration' => 'Twilio', 
    'manage-twilio-settings' => 'Twilio', 
    'manage-webhook-integration' => 'Webhook', 
    'manage-webhook-settings' => 'Webhook', 
    'manage-google-captcha' => 'GoogleCaptcha', 
    'manage-google-captcha-settings' => 'GoogleCaptcha', 
    'manage-landing-page' => 'LandingPage', 
    'manage-landing-page-settings' => 'LandingPage', 
    'manage-stripe-integration' => 'Stripe', 
    'manage-stripe-settings' => 'Stripe', 
    'manage-paypal-integration' => 'Paypal', 
    'manage-paypal-settings' => 'Paypal'
];

echo "Registering " . count($permissions) . " new permissions...\n";

foreach ($permissions as $p => $moduleName) {
    if (!Permission::where('name', $p)->exists()) {
        $label = ucwords(str_replace(['manage-', '-'], ['', ' '], $p));
        Permission::create([
            'name' => $p,
            'guard_name' => 'web',
            'add_on' => $moduleName,
            'module' => $moduleName,
            'label' => $label
        ]);
        echo "✅ Registered: $p ($moduleName) [$label]\n";
    } else {
        echo "⏭️ Exists: $p\n";
    }
}

$roles = ['company', 'superadmin'];
foreach ($roles as $roleName) {
    $role = Role::where('name', $roleName)->first();
    if ($role) {
        $role->givePermissionTo(array_keys($permissions));
        echo "⭐️ Assigned to role: $roleName\n";
    }
}

echo "\nSYNC COMPLETE. All new modules are now permissioned for Admin.\n";
