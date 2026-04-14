<?php
$host = 'localhost';
$db   = 'u256167180_noble';
$user = 'u256167180_noble';
$pass = '4_m_XMkgux@.AgC';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "Connection success\n";
     
     $sqlFile = __DIR__ . '/noble_final_sync.sql';
     if (!file_exists($sqlFile)) {
         die("File not found: $sqlFile\n");
     }
     
     $sql = file_get_contents($sqlFile);
     
     // Exploit the fact that it's a small file and just execute
     // Or split by ; if it's too big, but for 1.2MB it should be fine.
     $pdo->exec($sql);
     echo "Database import successful!\n";
     
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
