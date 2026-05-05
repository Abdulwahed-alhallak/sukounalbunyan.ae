<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

// Get the PDO connection
$pdo = DB::connection()->getPdo();

// Read SQL file
$sql = file_get_contents(__DIR__ . '/nobel_dump.sql');

// Remove DEFINER clauses which can cause permission errors on shared hosting
$sql = preg_replace('/DEFINER=`[^`]+`@`[^`]+`/i', '', $sql);

try {
    // Drop all tables
    $tables = DB::select('SHOW TABLES');
    $dbName = Config::get('database.connections.mysql.database');
    $key = 'Tables_in_' . $dbName;
    
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    foreach ($tables as $table) {
        if (isset($table->$key)) {
            DB::statement('DROP TABLE IF EXISTS `' . $table->$key . '`');
        } else {
            // fallback if key varies
            $array = (array)$table;
            $tableName = reset($array);
            DB::statement('DROP TABLE IF EXISTS `' . $tableName . '`');
        }
    }
    
    // Execute SQL commands
    $pdo->exec($sql);
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    
    echo "Database imported successfully.\n";
} catch (\Exception $e) {
    echo "Error importing DB: " . $e->getMessage() . "\n";
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
}
