<?php
$host = '127.0.0.1';
$port = '3306';
echo "Testing connection to $host:$port...\n";

$start = microtime(true);
$fp = @fsockopen($host, $port, $errno, $errstr, 2);

if (!$fp) {
    echo "❌ Socket connection failed: $errstr ($errno) in " . (microtime(true) - $start) . "s\n";
} else {
    echo "✅ Socket connection successful in " . (microtime(true) - $start) . "s\n";
    fclose($fp);
    
    echo "Testing PDO connection...\n";
    try {
        $pdo = new PDO("mysql:host=$host;port=$port", "root", "", [
            PDO::ATTR_TIMEOUT => 2,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        echo "✅ PDO connection successful!\n";
    } catch (PDOException $e) {
        echo "❌ PDO connection failed: " . $e->getMessage() . "\n";
    }
}
?>
