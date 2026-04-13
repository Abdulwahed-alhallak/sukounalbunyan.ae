<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Fixing database branding...\n";

$tables = ['settings'];
$count = 0;

foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        // Fix DionONE -> Noble Architecture
        $affected = DB::table($table)
            ->where('value', 'LIKE', '%DionONE%')
            ->get();
            
        foreach ($affected as $row) {
            $newValue = str_replace('DionONE', 'Noble Architecture', $row->value);
            DB::table($table)->where('id', $row->id)->update(['value' => $newValue]);
            echo "Updated $table ID {$row->id}: DionONE -> Noble Architecture\n";
            $count++;
        }
        
        // Fix nobel -> noble in URLs/paths
        $affectedPaths = DB::table($table)
            ->where('value', 'LIKE', '%nobel.dion.sy%')
            ->get();
            
        foreach ($affectedPaths as $row) {
            $newValue = str_replace('nobel.dion.sy', 'noble.dion.sy', $row->value);
            DB::table($table)->where('id', $row->id)->update(['value' => $newValue]);
            echo "Updated $table ID {$row->id}: nobel -> noble\n";
            $count++;
        }
    }
}

echo "Total database records fixed: $count\n";
echo "DONE\n";
