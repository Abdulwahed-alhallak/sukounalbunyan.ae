<?php

/**
 * Noble Architecture - Ultimate Database Scrub
 * Target: Every single string in EVERY table.
 */

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
     echo "Starting GLOBAL Noble Architecture Scrub...\n";

     $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

     foreach ($tables as $table) {
         echo "Processing Table: $table\n";
         
         // Get all text/char columns
         $columns = $pdo->query("DESCRIBE `$table`")->fetchAll();
         $textColumns = [];
         foreach ($columns as $column) {
             if (preg_match('/(char|text|json|varchar)/i', $column['Type'])) {
                 $textColumns[] = $column['Field'];
             }
         }

         if (empty($textColumns)) continue;

         foreach ($textColumns as $column) {
             // Aggressive search and replace for all variants
             $replacements = [
                 'DionONE' => 'Noble Architecture',
                 'DionFlow' => 'NobleFlow',
                 'dionone' => 'noble',
                 'dionflow' => 'nobleflow',
                 'Dion' => 'Noble',
                 'Nobel' => 'Noble',
                 'nobel' => 'noble'
             ];

             foreach ($replacements as $old => $new) {
                 $sql = "UPDATE `$table` SET `$column` = REPLACE(`$column`, :old, :new) WHERE `$column` LIKE :search";
                 $stmt = $pdo->prepare($sql);
                 $stmt->execute([
                     ':old' => $old,
                     ':new' => $new,
                     ':search' => "%$old%"
                 ]);
             }
         }
     }

     echo "SUCCESS: Global database is now 100% Noble Architecture.\n";

} catch (\PDOException $e) {
     echo "DB Error: " . $e->getMessage() . "\n";
}
