<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Update Users
    $affectedUsers = DB::table('users')
        ->where('email', 'like', '%sukounalbunyan.net%')
        ->update(['email' => DB::raw("REPLACE(email, 'sukounalbunyan.net', 'sukounalbunyan.ae')")]);

    echo "Local users updated: " . $affectedUsers . "\n";

    // Update Settings
    $affectedSettings = DB::table('settings')
        ->where('value', 'like', '%sukounalbunyan.net%')
        ->update(['value' => DB::raw("REPLACE(value, 'sukounalbunyan.net', 'sukounalbunyan.ae')")]);

    echo "Local settings updated: " . $affectedSettings . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
