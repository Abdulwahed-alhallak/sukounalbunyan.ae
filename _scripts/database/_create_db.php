<?php
try {
    $db = new PDO('mysql:host=localhost;port=3306', 'root', '');
    $db->setAttribute(PDO::ATTR_TIMEOUT, 3);
    $db->exec('CREATE DATABASE IF NOT EXISTS noble CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    echo "Database created successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
