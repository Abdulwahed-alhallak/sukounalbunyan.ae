<?php
try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 2, // 2 seconds timeout
    ];
    $db = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '', $options);
    echo "Connection to MySQL host successful.\n";
    $db->exec('CREATE DATABASE IF NOT EXISTS noble CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    echo "Database 'noble' verified/created.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
