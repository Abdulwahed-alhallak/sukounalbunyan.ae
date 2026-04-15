<?php
// remote_extract.php
$archive = __DIR__ . '/noble_v3_rebranded_clean.tar.gz';
$targetDir = __DIR__;

echo "<pre>";
if (file_exists($archive)) {
    echo "1. Extracting archive...\n";
    $command = "tar -xzf " . escapeshellarg($archive) . " -C " . escapeshellarg($targetDir);
    exec($command . " 2>&1", $output, $returnVar);
    echo implode("\n", $output) . "\n";
    if ($returnVar === 0) {
        echo "[SUCCESS] Extraction complete.\n";
        unlink($archive);
    } else {
        echo "[ERROR] Extraction failed.\n";
    }
} else {
    echo "[ERROR] Archive not found: $archive\n";
}

// Run DB fix if script exists
$dbFix = __DIR__ . '/_scripts/fix_db_branding.php';
if (file_exists($dbFix)) {
    echo "2. Running DB fix...\n";
    exec("/opt/alt/php82/usr/bin/php $dbFix 2>&1", $fixOutput, $fixReturn);
    echo implode("\n", $fixOutput) . "\n";
}

echo "3. Clearing cache...\n";
exec("/opt/alt/php82/usr/bin/php artisan optimize:clear 2>&1", $optOutput);
echo implode("\n", $optOutput) . "\n";

echo "--- PROCESS COMPLETE ---\n";
echo "</pre>";
// Self-destruct
// unlink(__FILE__);
