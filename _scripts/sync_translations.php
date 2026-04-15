<?php
$hrm = json_decode(file_get_contents(__DIR__ . '/../packages/noble/Hrm/src/Resources/lang/ar.json'), true);
$main = json_decode(file_get_contents(__DIR__ . '/../resources/lang/ar.json'), true);

$added = 0;
foreach ($hrm as $k => $v) {
    if (!isset($main[$k])) {
        $main[$k] = $v;
        $added++;
    }
}

ksort($main, SORT_STRING | SORT_FLAG_CASE);
file_put_contents(__DIR__ . '/../resources/lang/ar.json', json_encode($main, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
echo "Added $added translations to main ar.json\n";
echo "Total translations in main: " . count($main) . "\n";
