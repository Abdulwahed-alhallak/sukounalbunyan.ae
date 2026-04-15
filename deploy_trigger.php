<?php
/**
 * NOBLE ARCHITECTURE - REMOTE DEPLOYMENT TRIGGER
 * This script pulls the latest code from GitHub and runs migrations.
 */

// Basic security check (Secret Token)
$token = $_GET['token'] ?? '';
if ($token !== 'noble_secret_2026') {
    die('Unauthorized');
}

echo "<h1>Noble Architecture - Remote Deploy</h1>";

function run($cmd) {
    echo "<b>$ $cmd</b><br>";
    $output = shell_exec($cmd . ' 2>&1');
    echo "<pre>$output</pre><hr>";
}

// 1. Git Pull
run("git pull origin master");

// 2. Clear Caches
run("/opt/alt/php82/usr/bin/php artisan optimize:clear");

// 3. Migrate
run("/opt/alt/php82/usr/bin/php artisan migrate --force");

// 4. Custom Restructure (If needed)
run("/opt/alt/php82/usr/bin/php artisan noble:restructure-users");

echo "<h2>Deployment Complete!</h2>";
