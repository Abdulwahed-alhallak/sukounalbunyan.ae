<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Fixing Default Language to Arabic ===\n\n";

// 1. Fix admin_setting (the system-level default)
$adminSettings = [
    ['key' => 'defaultLanguage', 'value' => 'ar'],
];

foreach ($adminSettings as $setting) {
    $existing = DB::table('settings')
        ->whereNull('created_by')
        ->where('key', $setting['key'])
        ->first();

    if ($existing) {
        DB::table('settings')
            ->whereNull('created_by')
            ->where('key', $setting['key'])
            ->update(['value' => $setting['value']]);
        echo "Updated admin setting: {$setting['key']} = {$setting['value']}\n";
    } else {
        DB::table('settings')->insert([
            'key' => $setting['key'],
            'value' => $setting['value'],
            'created_by' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "Created admin setting: {$setting['key']} = {$setting['value']}\n";
    }
}

// 2. Fix user lang for all superadmin/admin users
$updated = DB::table('users')
    ->whereIn('type', ['superadmin', 'admin'])
    ->update(['lang' => 'ar']);
echo "Updated {$updated} admin user(s) lang to 'ar'\n";

// 3. Fix company settings for all users (currency + language)
$userIds = DB::table('users')->pluck('id');
foreach ($userIds as $uid) {
    $settingsToFix = [
        ['key' => 'defaultLanguage', 'value' => 'ar'],
        ['key' => 'defaultCurrency', 'value' => 'AED'],
        ['key' => 'currencySymbol', 'value' => 'د.إ'],
        ['key' => 'currencySymbolPosition', 'value' => 'after'],
        ['key' => 'currencySymbolSpace', 'value' => '1'],
    ];

    foreach ($settingsToFix as $s) {
        DB::table('settings')
            ->where('created_by', $uid)
            ->where('key', $s['key'])
            ->update(['value' => $s['value']]);
    }
}
echo "Updated company settings for " . count($userIds) . " users (AED currency, Arabic language)\n";

echo "\n=== DONE ===\n";
echo "The application will now default to Arabic for all new sessions.\n";
echo "Existing sessions need to clear localStorage to take effect.\n";
