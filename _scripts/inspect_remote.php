<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config([
    'database.connections.mysql.host' => '193.203.166.17',
    'database.connections.mysql.database' => 'u256167180_noble',
    'database.connections.mysql.username' => 'u256167180_noble',
    'database.connections.mysql.password' => 'm:&!u>Do!P3',
]);

echo "--- Remote Inspection ---\n";

// 1. Storage settings
echo "1. Logo Settings in DB:\n";
$settings = DB::connection('mysql')->table('settings')->whereIn('key', ['logo_dark', 'logo_light', 'favicon', 'metaImage'])->get();
foreach ($settings as $s) {
    echo "  - {$s->key}: {$s->value}\n";
}

// 2. Plans table
echo "\n2. Plans Table Schema:\n";
$columns = DB::connection('mysql')->getSchemaBuilder()->getColumnListing('plans');
echo "  Columns: " . implode(', ', $columns) . "\n";

// 3. Subscription Info
echo "\n3. Superadmin Subscriptions:\n";
$super = DB::connection('mysql')->table('users')->where('email', 'superadmin@dion.sy')->first();
if ($super) {
    echo "  Superadmin: {$super->name}\n";
    echo "  Plan ID: {$super->active_plan}\n";
}

echo "\n--- Done ---\n";

