<?php
// _scripts/noble_final_fix.php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

echo "--- Noble Architecture Final Fix ---\n";

try {
    // 1. Fix Database Branding
    echo "1. Correcting 'DionONE' and 'Nobel' in database...\n";
    $affected = DB::table('settings')
        ->where('value', 'LIKE', '%Dion%')
        ->orWhere('value', 'LIKE', '%Nobel%')
        ->get();
        
    foreach ($affected as $row) {
        $newValue = str_replace(
            ['DionONE', 'Nobel', 'Nobel.dion.sy'], 
            ['Noble Architecture', 'Noble', 'noble.dion.sy'], 
            $row->value
        );
        DB::table('settings')->where('id', $row->id)->update(['value' => $newValue]);
        echo "   Updated ID {$row->id}: {$row->key}\n";
    }
    
    // 2. Clear All Caches
    echo "2. Clearing Laravel caches...\n";
    Artisan::call('optimize:clear');
    Artisan::call('cache:clear');
    echo "   Caches cleared.\n";

    echo "\n--- SUCCESS ---\n";
} catch (\Exception $e) {
    echo "\n[ERROR] " . $e->getMessage() . "\n";
}
