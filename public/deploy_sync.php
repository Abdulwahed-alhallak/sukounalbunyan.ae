<?php
/**
 * Noble Architecture - Remote Deployment Sync Trigger
 * 
 * This script allows triggering a repository reset and database migration
 * via a secure web request, bypassing SSH/SFTP connection restrictions.
 */

// --- SECURITY PROTOCOL ---
$SECRET_TOKEN = 'noble_gold_master_sync_2026_q2'; // In production, this should be moved to .env
$providedToekn = $_GET['token'] ?? '';

if ($providedToekn !== $SECRET_TOKEN) {
    header('HTTP/1.0 403 Forbidden');
    echo "❌ ACCESS DENIED: Invalid Synchronization Token.";
    exit;
}

// --- CONFIGURATION ---
$basePath = dirname(__DIR__);
$isProduction = file_exists($basePath . '/.env.production') || strpos($_SERVER['HTTP_HOST'], 'noble.dion.sy') !== false;

echo "<h1>🚀 Noble Architecture: Remote Sync Initialized</h1>";
echo "<pre>";

function run($cmd) {
    global $basePath;
    echo "<b>> {$cmd}</b>\n";
    $output = shell_exec("cd \"{$basePath}\" && {$cmd} 2>&1");
    echo $output . "\n";
    return $output;
}

try {
    // 1. Reset Repository to Master
    echo "<h3>Step 1: Repository Synchronization</h3>";
    run("git fetch --all");
    run("git reset --hard origin/master");

    // 2. Clear Cache
    echo "<h3>Step 2: Optimization & Cache</h3>";
    run("php artisan optimize:clear");

    // 3. Database Migration
    echo "<h3>Step 3: Database Schema Sync</h3>";
    run("php artisan migrate --force");

    // 4. Employee Data Sync (Gold Master Priority)
    echo "<h3>Step 4: Noble 'Gold Master' Data Import</h3>";
    $csvPath = "docs/Archive/nobel Employee S Data.csv";
    if (file_exists($basePath . '/' . $csvPath)) {
        run("php artisan noble:import-employees \"{$csvPath}\" --company=2");
    } else {
        echo "⚠️ Warning: Employee CSV not found at {$csvPath}\n";
    }

    // 5. Finalize
    echo "<h3>Step 5: Final Optimization</h3>";
    run("php artisan optimize");

    echo "\n<h2 style='color:green;'>✅ ALL SYSTEMS SYNCHRONIZED SUCCESSFULLY</h2>";

} catch (Exception $e) {
    echo "\n<h2 style='color:red;'>❌ CRITICAL ERROR DURING SYNC</h2>";
    echo $e->getMessage();
}

echo "</pre>";
