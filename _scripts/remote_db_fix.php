<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config([
    'database.connections.mysql_remote.driver' => 'mysql',
    'database.connections.mysql_remote.host' => '193.203.166.17',
    'database.connections.mysql_remote.database' => 'u256167180_noble',
    'database.connections.mysql_remote.username' => 'u256167180_noble',
    'database.connections.mysql_remote.password' => 'm:&!u>Do!P3',
    'database.connections.mysql_remote.charset' => 'utf8mb4',
    'database.connections.mysql_remote.collation' => 'utf8mb4_unicode_ci',
]);

try {
    $db = \DB::connection('mysql_remote');
    
    $migrationName = '2026_04_06_110141_add_polymorphic_fields_to_task_attachments_table';
    
    echo "Checking migration state on remote DB...\n";
    $exists = $db->table('migrations')->where('migration', $migrationName)->first();
    
    if ($exists) {
        echo "Migration is already marked as finished (Batch: {$exists->batch}).\n";
    } else {
        echo "Migration is NOT marked as finished. Marking it now...\n";
        
        $maxBatch = $db->table('migrations')->max('batch') ?? 0;
        $db->table('migrations')->insert([
            'migration' => $migrationName,
            'batch' => $maxBatch + 1
        ]);
        
        echo "Success! Migration marked as finished in batch " . ($maxBatch + 1) . ".\n";
    }
    
    echo "\nVerifying columns in task_attachments table...\n";
    $columns = $db->getSchemaBuilder()->getColumnListing('task_attachments');
    echo "Columns: " . implode(', ', $columns) . "\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

