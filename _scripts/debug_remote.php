<?php

/**
 * debug_remote.php
 * Use this to read the remote laravel.log file on Hostinger.
 */

$logFile = __DIR__.'/storage/logs/laravel.log';

header('Content-Type: text/plain');

if (file_exists($logFile)) {
    echo "--- Last 100 Lines of Laravel Log ---\n\n";
    $lines = file($logFile);
    $lastLines = array_slice($lines, -100);
    echo implode("", $lastLines);
} else {
    echo "❌ Log file not found at: $logFile\n";
    echo "Searching in other locations...\n";
    
    $altLog = __DIR__.'/../storage/logs/laravel.log';
    if (file_exists($altLog)) {
        echo "Found at: $altLog\n";
        $lines = file($altLog);
        echo implode("", array_slice($lines, -100));
    }
}
