<?php
$file = __DIR__ . '/../packages/noble/Hrm/src/Routes/web.php';
$content = file_get_contents($file);

// Extract all the fully qualified controllers being used inline
preg_match_all("/\[\\\\Noble\\\\Hrm\\\\Http\\\\Controllers\\\\([a-zA-Z0-9_]+)::class/", $content, $matches);

$controllersToUse = array_unique($matches[1]);

if (!empty($controllersToUse)) {
    $useStatements = "";
    foreach ($controllersToUse as $c) {
        $stmt = "use Noble\Hrm\Http\Controllers\\$c;";
        if (strpos($content, $stmt) === false) {
            $useStatements .= $stmt . "\n";
        }
    }
    
    // Inject use statements after namespace or other imports
    $content = preg_replace('/(use Illuminate\\\\Support\\\\Facades\\\\Route;)/', "$1\n" . $useStatements, $content);
    
    // Replace inline fully qualified names
    $content = preg_replace("/\\\\Noble\\\\Hrm\\\\Http\\\\Controllers\\\\([a-zA-Z0-9_]+)::class/", "$1::class", $content);
    
    file_put_contents($file, $content);
    echo "Web routes cleaned and simplified.\n";
} else {
    echo "No FQCN found to clean.\n";
}
