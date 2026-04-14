<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$sourceConn = 'mysql'; // local
$targetConn = 'hostinger'; // remote

echo "Starting Full Database Data Sync...\n";
echo "Source: Local XAMPP\n";
echo "Target: Hostinger Production\n\n";

// 1. Get all tables from source
$tables = DB::connection($sourceConn)->select('SHOW TABLES');
$tableKey = "Tables_in_" . config("database.connections.$sourceConn.database");

foreach ($tables as $table) {
    $tableName = $table->$tableKey;
    
    // Skip migrations to avoid sync conflicts if schema differs slightly
    if ($tableName === 'migrations') continue;

    echo "Syncing table: $tableName ... ";

    try {
        // Clear remote table
        DB::connection($targetConn)->table($tableName)->truncate();

        // Get data from local and insert into remote in chunks
        DB::connection($sourceConn)->table($tableName)->orderBy(DB::raw('1'))->chunk(500, function ($rows) use ($targetConn, $tableName) {
            $data = json_decode(json_encode($rows), true);
            if (!empty($data)) {
                DB::connection($targetConn)->table($tableName)->insert($data);
            }
        });

        echo "DONE\n";
    } catch (\Exception $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
    }
}

echo "\nDatabase Data Sync Completed Successfully!\n";
