<?php
/**
 * Deploy Script — sukounalbunyan.ae
 * Access: https://sukounalbunyan.ae/deploy-rental-v2.php?token=DEPLOY_TOKEN_2026
 * 
 * One-time deployment script for Rental Module v2.
 * Run once from the browser, then delete for security.
 */

// Security token
define('DEPLOY_TOKEN', 'DEPLOY_TOKEN_2026_RENTAL_V2');

if (!isset($_GET['token']) || $_GET['token'] !== DEPLOY_TOKEN) {
    http_response_code(403);
    die('Forbidden');
}

header('Content-Type: text/plain; charset=utf-8');
set_time_limit(300);

$projectRoot = dirname(__DIR__); // /home/u256167180/domains/sukounalbunyan.ae/public_html
$log = [];

function run(string $cmd, string $cwd = null): string {
    $fullCmd = $cwd ? "cd " . escapeshellarg($cwd) . " && " . $cmd : $cmd;
    $output = shell_exec($fullCmd . " 2>&1");
    return trim($output ?? '(no output)');
}

echo "=== Rental Module v2 Deployment ===" . PHP_EOL;
echo "Time: " . date('Y-m-d H:i:s') . PHP_EOL;
echo "Root: {$projectRoot}" . PHP_EOL;
echo PHP_EOL;

// Step 1: Git pull
echo "--- Step 1: git pull ---" . PHP_EOL;
$out = run("git pull origin master", $projectRoot);
echo $out . PHP_EOL . PHP_EOL;

// Step 2: Migrations
echo "--- Step 2: Migrations ---" . PHP_EOL;
$out = run("php artisan migrate --force", $projectRoot);
echo $out . PHP_EOL . PHP_EOL;

// Step 3: Clear caches
echo "--- Step 3: Clear caches ---" . PHP_EOL;
$out = run("php artisan config:clear && php artisan route:clear && php artisan view:clear && php artisan cache:clear", $projectRoot);
echo $out . PHP_EOL . PHP_EOL;

// Step 4: Re-cache for production
echo "--- Step 4: Optimize ---" . PHP_EOL;
$out = run("php artisan config:cache && php artisan route:cache", $projectRoot);
echo $out . PHP_EOL . PHP_EOL;

// Step 5: Check routes
echo "--- Step 5: Rental Routes ---" . PHP_EOL;
$out = run("php artisan route:list --name=rental 2>&1 | grep 'rental-projects'", $projectRoot);
echo $out . PHP_EOL . PHP_EOL;

echo "=== DONE ===" . PHP_EOL;
