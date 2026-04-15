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

try {
    echo "Running migrations...\n";
    $status = \Artisan::call('migrate', ['--force' => true]);
    echo \Artisan::output();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

