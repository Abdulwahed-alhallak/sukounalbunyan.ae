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
    echo "Updating all logo settings to DION logos...\n";
    
    DB::table('settings')->where('key', 'logo_dark')->update(['value' => 'logo-dark-dion.png']);
    DB::table('settings')->where('key', 'logo_light')->update(['value' => 'logo-light-dion.png']);
    DB::table('settings')->where('key', 'favicon')->update(['value' => 'favicon.png']);
    
    echo "Done.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

