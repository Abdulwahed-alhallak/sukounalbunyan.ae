<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS noble CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "Database 'noble' created or already exists.\n";
} catch (PDOException $e) {
    die("Error connecting to MySQL: " . $e->getMessage() . "\n");
}
