<?php
$arFile = 'resources/lang/ar.json';
if (!file_exists($arFile)) {
    echo "No ar.json found.\n";
    exit;
}
$arData = json_decode(file_get_contents($arFile), true);
$untranslated = [];
$translated = [];
foreach ($arData as $k => $v) {
    if ($k === $v && !preg_match('/[أ-ي]/', $v)) {
        $untranslated[$k] = $v;
    } else {
        $translated[$k] = $v;
    }
}
echo "Total keys: " . count($arData) . "\n";
echo "Untranslated English keys: " . count($untranslated) . "\n";
echo "Translated Arabic keys: " . count($translated) . "\n";

// Show first 20 untranslated keys
echo "\nFirst 20 untranslated:\n";
$i = 0;
foreach ($untranslated as $k => $v) {
    echo "- $k\n";
    if (++$i >= 20) break;
}
