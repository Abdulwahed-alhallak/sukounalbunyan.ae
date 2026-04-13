<?php
$source = realpath(__DIR__ . '/..');
$zipFile = __DIR__ . '/../noble_clean_deploy.zip';
if (file_exists($zipFile)) unlink($zipFile);
$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE) !== TRUE) die("Could not open zip file\n");
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
$exclude = ['.git', 'node_modules', 'vendor', 'storage/framework', 'storage/logs', '_scripts', 'noble_clean_deploy.zip', '.env', 'tools', 'tmp'];
echo "Zipping cleaned files forNobleArchitecture...\n";
foreach ($iterator as $file) {
    if (!($file instanceof SplFileInfo)) continue;
    $filePath = $file->getRealPath();
    $relativePath = substr($filePath, strlen($source) + 1);
    $relativePath = str_replace('\\', '/', $relativePath);
    $shouldExclude = false;
    foreach ($exclude as $ex) {
        if ($relativePath === $ex || strpos($relativePath, "$ex/") === 0) { $shouldExclude = true; break; }
    }
    if ($shouldExclude) continue;
    if ($file->isDir()) { $zip->addEmptyDir($relativePath); } else { $zip->addFile($filePath, $relativePath); }
}
$zip->close();
echo "Zip created: noble_clean_deploy.zip (" . round(filesize($zipFile) / 1024 / 1024, 2) . " MB)\n";

