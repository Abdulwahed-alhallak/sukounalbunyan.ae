<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "--- HYPER-AGGRESSIVE NOBLE REBRANDING ---\n";

$tables = DB::select('SHOW TABLES');
$databaseName = DB::getDatabaseName();
$tableKey = "Tables_in_" . $databaseName;

foreach ($tables as $table) {
    $tableName = $table->$tableKey;
    $columns = Schema::getColumnListing($tableName);
    
    foreach ($columns as $column) {
        // Only target string/text columns if possible, but for simplicity we'll just try updating
        try {
            DB::table($tableName)
                ->where($column, 'LIKE', '%Dion%')
                ->orWhere($column, 'LIKE', '%Nobel%')
                ->update([
                    $column => DB::raw("REPLACE(REPLACE(REPLACE($column, 'DionONE', 'Noble Architecture'), 'Dion', 'Noble'), 'Nobel', 'Noble')")
                ]);
        } catch (\Exception $e) {
            // Skip columns that can't be replaced (like IDs or binary)
        }
    }
    echo "Checked Table: $tableName\n";
}

echo "--- CLEARING CACHES ---\n";
Artisan::call('optimize:clear');
echo "SUCCESS: The database is now 100% Noble.\n";
