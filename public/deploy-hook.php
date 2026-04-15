<?php
/**
 * Noble Architecture — Remote Deploy Hook
 * Place at: public_html/deploy-hook-[secret].php
 * Call via: https://noble.dion.sy/deploy-hook-[secret].php
 */

// Security: token check
if (($_GET['t'] ?? '') !== 'n0ble2026') {
    http_response_code(403);
    die('Forbidden');
}

header('Content-Type: text/plain');
set_time_limit(300);

$dir = dirname(__FILE__);
// Go up to project root if we're in public/
if (basename($dir) === 'public') {
    $dir = dirname($dir);
}

echo "=== NOBLE ARCHITECTURE DEPLOY ===\n\n";
echo "Dir: $dir\n\n";

function run($cmd, $dir) {
    echo "$ $cmd\n";
    $output = [];
    $code = 0;
    exec("cd $dir && $cmd 2>&1", $output, $code);
    echo implode("\n", $output) . "\n";
    echo "Exit: $code\n\n";
    return $code;
}

// Find PHP binary
$php = '/usr/local/bin/php';
if (!file_exists($php)) $php = '/opt/alt/php82/usr/bin/php';
if (!file_exists($php)) $php = 'php';

echo "PHP: $php\n\n";

// 1. Git pull
run("git fetch origin master", $dir);
run("git reset --hard origin/master", $dir);

// 2. Clear caches
run("$php artisan optimize:clear", $dir);

// 3. Migrate
run("$php artisan migrate --force", $dir);

// 4. Rebuild caches
run("$php artisan config:cache", $dir);
run("$php artisan route:cache", $dir);
run("$php artisan view:cache", $dir);

// 5. Storage link
run("$php artisan storage:link", $dir);

// 6. Verify
run("ls -la public/build/manifest.json", $dir);

echo "\n=== DEPLOY COMPLETE ===\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n";
