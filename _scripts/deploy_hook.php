<?php
/**
 * Noble Architecture — Intelligent Deployment Hook
 * This script allows for a full production sync via HTTP POST.
 * SECURE: Deletes itself after execution.
 */

// Simple security token
$token = "noble_sec_2026_df89";

if (!isset($_GET['token']) || $_GET['token'] !== $token) {
    header('HTTP/1.1 403 Forbidden');
    exit('Access Denied');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $targetFile = 'noble_bundle.tar.gz';
    
    echo "Starting upload...\n";
    $input = fopen('php://input', 'r');
    $file = fopen($targetFile, 'w');
    $size = 0;
    while ($data = fread($input, 8192)) {
        fwrite($file, $data);
        $size += strlen($data);
    }
    fclose($file);
    fclose($input);
    echo "Upload complete: " . ($size / 1024 / 1024) . " MB\n";
    
    echo "Extracting...\n";
    if (file_exists($targetFile)) {
        $output = [];
        $res = 0;
        exec("tar -xzf $targetFile 2>&1", $output, $res);
        echo implode("\n", $output) . "\n";
        unlink($targetFile);
        
        echo "Clearing caches...\n";
        exec("/opt/alt/php82/usr/bin/php artisan config:cache");
        exec("/opt/alt/php82/usr/bin/php artisan route:cache");
        exec("/opt/alt/php82/usr/bin/php artisan cache:clear");
        
        echo "Deployment SUCCESS. Self-destructing...\n";
        unlink(__FILE__);
    } else {
        echo "Error: Archive not found.\n";
    }
    exit;
}
?>
<form method="POST">
    <input type="file" name="bundle">
    <button type="submit">Upload</button>
</form>
