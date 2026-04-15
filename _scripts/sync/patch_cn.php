<?php
$dir = 'resources/js';
$importLine = 'import { cn } from "@/lib/utils";';

function patchFiles($directory, $importLine) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));
    $patchedCount = 0;

    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'tsx') {
            $content = file_get_contents($file->getPathname());
            
            // Check if cn is used but not imported
            if (preg_match('/\bcn\(/', $content) && !preg_match('/import\s+\{\s*cn\s*\}\s+from\s+[\'"]@\/lib\/utils[\'"]/', $content)) {
                echo "Patching: " . $file->getPathname() . "\n";
                
                // Add import at the top after any existing imports or at the very top
                $lines = explode("\n", $content);
                $inserted = false;
                
                for ($i = 0; $i < count($lines); $i++) {
                    if (trim($lines[$i]) === '' || strpos($lines[$i], 'import ') === 0) {
                        continue;
                    } else {
                        // Insert before the first non-import line
                        array_splice($lines, $i, 0, $importLine);
                        $inserted = true;
                        break;
                    }
                }
                
                if (!$inserted) {
                    array_unshift($lines, $importLine);
                }
                
                file_put_contents($file->getPathname(), implode("\n", $lines));
                $patchedCount++;
            }
        }
    }
    return $patchedCount;
}

$count = patchFiles($dir, $importLine);
echo "\nTotal files patched: $count\n";
