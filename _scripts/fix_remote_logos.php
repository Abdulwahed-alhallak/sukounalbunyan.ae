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

use Illuminate\Support\Facades\DB;

try {
    echo "Fixing logo filenames on remote database...\n";
    
    // Update logos to match what's actually on the server
    DB::table('settings')->where('key', 'logo_dark')->update(['value' => 'logo-dark-dion.png']);
    DB::table('settings')->where('key', 'logo_light')->update(['value' => 'logo-light-dion.png']);
    
    echo "Logo filenames fixed.\n";
    echo "SUCCESS: Remote database updated.\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

