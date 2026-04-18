<?php
try {
    $dsn = "mysql:host=127.0.0.1;port=3306";
    $user = "root";
    $password = "";
    $pdo = new PDO($dsn, $user, $password);
    
    echo "Databases:\n";
    foreach ($pdo->query('SHOW DATABASES') as $row) {
        echo "- " . $row['Database'] . "\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
