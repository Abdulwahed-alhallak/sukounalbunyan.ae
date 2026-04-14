<?php

// Re-using the DB connection logic from the main app
$host = '127.0.0.1';
$db   = 'nobel';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     
     echo "Starting PERFECT Surgical Branding Scrub...\n";

     // 1. Purge Meta Keywords (Targeting ALL occurrences)
     $stmt = $pdo->prepare("UPDATE settings SET value = REPLACE(value, 'dionone', 'noble') WHERE `key` IN ('metaKeywords', 'meta_keyword')");
     $stmt->execute();
     $stmt = $pdo->prepare("UPDATE settings SET value = REPLACE(value, 'DionONE', 'Noble Architecture') WHERE `key` IN ('metaKeywords', 'meta_keyword')");
     $stmt->execute();
     
     // 2. Purge Banking Instructions & General Instructions
     $stmt = $pdo->prepare("UPDATE settings SET value = REPLACE(value, 'DION', 'Noble') WHERE `key` IN ('instructions', 'company_payment_instructions')");
     $stmt->execute();
     $stmt = $pdo->prepare("UPDATE settings SET value = REPLACE(value, 'dion', 'noble') WHERE `key` IN ('instructions', 'company_payment_instructions')");
     $stmt->execute();
     
     // 3. Purge Site Name
     $stmt = $pdo->prepare("UPDATE settings SET value = 'Noble Architecture' WHERE `key` IN ('titleText', 'title_text') AND value LIKE '%Dion%'");
     $stmt->execute();

     // 4. Global fallback for any string in the settings table
     $stmt = $pdo->prepare("UPDATE settings SET value = REPLACE(value, 'DionONE', 'Noble Architecture') WHERE value LIKE '%DionONE%'");
     $stmt->execute();
     $stmt = $pdo->prepare("UPDATE settings SET value = REPLACE(value, 'dionone', 'noble') WHERE value LIKE '%dionone%'");
     $stmt->execute();

     echo "SUCCESS: Perfect surgical scrub complete.\n";

} catch (\PDOException $e) {
     echo "DB Error: " . $e->getMessage() . "\n";
}
