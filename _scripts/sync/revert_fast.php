<?php
$baseDir = __DIR__;
$targets = ['app', 'config', 'database', 'packages', 'routes'];

foreach ($targets as $t) {
    $dir = $baseDir . '/' . $t;
    if (!is_dir($dir)) continue;
    
    echo "Scanning $dir...\n";
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($files as $file) {
        if ($file->isFile()) {
            $path = $file->getPathname();
            $ext = pathinfo($path, PATHINFO_EXTENSION);
            if (!in_array($ext, ['php', 'json', 'ts', 'tsx'])) continue;
            
            $content = file_get_contents($path);
            $count = 0;
            
            // Standard namespace: Noble Architecture\
            $content = str_replace('Noble Architecture\\', 'ERPGO\\', $content, $c1);
            
            // JSON/escaped: Noble Architecture\\
            $content = str_replace('Noble Architecture\\\\', 'ERPGO\\\\', $content, $c2);
            
            if ($c1 > 0 || $c2 > 0) {
                file_put_contents($path, $content);
                echo "Fixed ($c1, $c2): $path\n";
            }
        }
    }
}
echo "DONE\n";

