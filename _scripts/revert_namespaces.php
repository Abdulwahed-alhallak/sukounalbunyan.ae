<?php
/**
 * REVERT NAMESPACES
 * This script reverts the namespace changes fromNobleArchitecture back to ERPGO
 * to fix the 500 errors caused by broken autoloader.
 */

$baseDir = __DIR__;
$targets = [
    $baseDir . '/app',
    $baseDir . '/config',
    $baseDir . '/database',
    $baseDir . '/packages',
    $baseDir . '/routes',
];

function processDirectory($dir) {
    echo "Processing $dir...\n";
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $path = $file->getPathname();
            $ext = pathinfo($path, PATHINFO_EXTENSION);
            if (in_array($ext, ['php', 'json', 'ts', 'tsx'])) {
                $content = file_get_contents($path);
                $original = $content;

                // Pattern 1: namespace/useNobleArchitecture\
                $content = str_replace('Noble Architecture\\', 'ERPGO\\', $content);
                
                // Pattern 2: "Noble Architecture\\" (JSON/Strings)
                $content = str_replace('Noble Architecture\\\\', 'ERPGO\\\\', $content);

                if ($content !== $original) {
                    file_put_contents($path, $content);
                    echo "Updated: $path\n";
                }
            }
        }
    }
}

foreach ($targets as $target) {
    if (is_dir($target)) {
        processDirectory($target);
    }
}

echo "Namespace reversal complete. Branding text (Noble Architecture) should remain intact where backslashes were not used.\n";


