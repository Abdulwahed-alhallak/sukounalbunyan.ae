<?php
/**
 * Quick deployment script - Pull latest from Git and run migrations
 * Access: https://nobel.dion.sy/deploy_quick.php?key=dion2026deploy
 */

$secret = 'dion2026deploy';
if (($_GET['key'] ?? '') !== $secret) {
    http_response_code(403);
    die('Forbidden');
}

header('Content-Type: text/plain; charset=utf-8');

echo "=== DionONE Quick Deploy ===\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n\n";

// Step 1: Git Pull
echo "--- Step 1: Git Pull ---\n";
$output = [];
$returnCode = 0;
exec('cd ' . __DIR__ . ' && git pull origin master 2>&1', $output, $returnCode);
echo implode("\n", $output) . "\n";
echo "Exit code: $returnCode\n\n";

// Step 2: Run migrations
echo "--- Step 2: Run Migrations ---\n";
$output2 = [];
$returnCode2 = 0;
exec('cd ' . __DIR__ . ' && php artisan migrate --force 2>&1', $output2, $returnCode2);
echo implode("\n", $output2) . "\n";
echo "Exit code: $returnCode2\n\n";

// Step 3: Clear caches
echo "--- Step 3: Clear Caches ---\n";
$output3 = [];
exec('cd ' . __DIR__ . ' && php artisan config:clear && php artisan cache:clear && php artisan view:clear 2>&1', $output3);
echo implode("\n", $output3) . "\n";

echo "\n=== Deploy Complete ===\n";
