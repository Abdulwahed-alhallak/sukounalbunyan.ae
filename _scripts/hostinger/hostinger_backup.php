<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

echo "🛡️  Sukoun Albunyan Automated Backup Protocol Initiated...\n";

$dbName = env('DB_DATABASE');
$dbUser = env('DB_USERNAME');
$dbPass = env('DB_PASSWORD');
$dbHost = env('DB_HOST', '127.0.0.1');

$date = date('Y-m-d_H-i-s');
$backupPath = storage_path('app/backups');
if (!file_exists($backupPath)) {
    mkdir($backupPath, 0755, true);
}

$sqlFile = "{$backupPath}/database_backup_{$date}.sql";

// Execute mysqldump
$command = "mysqldump --user={$dbUser} --password={$dbPass} --host={$dbHost} {$dbName} > {$sqlFile}";

exec($command, $output, $returnVar);

if ($returnVar === 0) {
    echo "✅ Database successfully backed up to: {$sqlFile}\n";
    
    // Auto-clean old backups (keep last 7)
    $files = glob("{$backupPath}/*.sql");
    if (count($files) > 7) {
        usort($files, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        $filesToDelete = array_slice($files, 0, count($files) - 7);
        foreach ($filesToDelete as $file) {
            unlink($file);
            echo "🗑️  Cleaned up old backup: " . basename($file) . "\n";
        }
    }
} else {
    echo "❌ Database backup failed. Ensure mysqldump is available.\n";
}
