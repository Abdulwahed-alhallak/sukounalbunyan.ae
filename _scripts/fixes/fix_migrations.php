<?php
/**
 * Emergency Migration Fix Script
 * Marks the failing migration as "already ran" and runs remaining ones.
 * Access: https://noble.dion.sy/fix_migrations.php?key=dion2026fix
 * 
 * After running, DELETE this file from the server!
 */

$secret = 'dion2026fix';
if (($_GET['key'] ?? '') !== $secret) {
    http_response_code(403);
    die('Forbidden');
}

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: text/plain; charset=utf-8');
echo "=== Emergency Migration Fix ===\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n\n";

try {
    // Step 1: Check if the problematic migration has been recorded
    $problematic = '2026_04_06_110141_add_polymorphic_fields_to_task_attachments_table';
    $exists = DB::table('migrations')->where('migration', $problematic)->exists();
    
    if ($exists) {
        echo "[SKIP] Migration '{$problematic}' already recorded.\n";
    } else {
        // The columns already exist in the DB but the migration wasn't recorded.
        // So we just record it as "ran" without actually running it.
        $hasAttachableType = Schema::hasColumn('task_attachments', 'attachable_type');
        $hasAttachableId = Schema::hasColumn('task_attachments', 'attachable_id');
        
        echo "[CHECK] task_attachments.attachable_type exists: " . ($hasAttachableType ? 'YES' : 'NO') . "\n";
        echo "[CHECK] task_attachments.attachable_id exists: " . ($hasAttachableId ? 'YES' : 'NO') . "\n";
        
        if ($hasAttachableType && $hasAttachableId) {
            // Columns already exist, just record the migration
            $batch = DB::table('migrations')->max('batch') ?? 0;
            DB::table('migrations')->insert([
                'migration' => $problematic,
                'batch' => $batch + 1,
            ]);
            echo "[FIXED] Recorded '{$problematic}' as completed (batch " . ($batch + 1) . ")\n";
        } else {
            // Columns don't exist, need to add them
            Schema::table('task_attachments', function ($table) use ($hasAttachableType, $hasAttachableId) {
                if (!$hasAttachableType) {
                    $table->string('attachable_type')->nullable();
                }
                if (!$hasAttachableId) {
                    $table->unsignedBigInteger('attachable_id')->nullable();
                    $table->index(['attachable_type', 'attachable_id']);
                }
            });
            $batch = DB::table('migrations')->max('batch') ?? 0;
            DB::table('migrations')->insert([
                'migration' => $problematic,
                'batch' => $batch + 1,
            ]);
            echo "[FIXED] Added missing columns and recorded migration.\n";
        }
    }
    
    // Step 2: Now run all remaining pending migrations
    echo "\n--- Running Remaining Migrations ---\n";
    Artisan::call('migrate', ['--force' => true]);
    echo Artisan::output();
    
    // Step 3: Clear caches
    echo "\n--- Clearing Caches ---\n";
    Artisan::call('config:clear');
    echo Artisan::output();
    Artisan::call('cache:clear');
    echo Artisan::output();
    Artisan::call('view:clear');
    echo Artisan::output();
    
    echo "\n=== All Done! System should be working now. ===\n";
    echo "\n⚠️  IMPORTANT: Delete this file (fix_migrations.php) from the server!\n";
    
} catch (\Exception $e) {
    echo "\n[ERROR] " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}
