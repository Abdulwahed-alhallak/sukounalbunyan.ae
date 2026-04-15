<?php
require __DIR__ . '/../vendor/autoload.php';
use phpseclib3\Net\SFTP;

// Load sensitive credentials from .env.production.php (NOT from hardcoded values)
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../', '.env.production');
try {
    $dotenv->load();
} catch (Exception $e) {
    die("❌ ERROR: .env.production file not found. See .env.production.example\n");
}

$host = $_ENV['PRODUCTION_HOST'] ?? exit("Missing PRODUCTION_HOST");
$port = $_ENV['PRODUCTION_PORT'] ?? 65002;
$username = $_ENV['PRODUCTION_USERNAME'] ?? exit("Missing PRODUCTION_USERNAME");
$password = $_ENV['PRODUCTION_PASSWORD'] ?? exit("Missing PRODUCTION_PASSWORD");
$envContent = 'APP_NAME="Noble Architecture"
APP_ENV=production
APP_KEY=base64:f/yDBCN6hqxxiCvao1JvCDtte/iLcgJ7E5pBe8W4iFc=
APP_DEBUG=false
APP_URL=https://noble.dion.sy

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=' . ($_ENV['PRODUCTION_DB_NAME'] ?? 'u256167180_noble') . '
DB_USERNAME=' . ($_ENV['PRODUCTION_DB_USERNAME'] ?? 'u256167180_noble') . '
DB_PASSWORD=' . $_ENV['PRODUCTION_DB_PASSWORD'] . '

SESSION_DRIVER=database
CACHE_DRIVER=file
QUEUE_CONNECTION=database
';
echo "Uploading Production .env with NobleArchitecture branding...\n";
$sftp = new SFTP($host, $port);
if (!$sftp->login($username, $password)) die("Login Failed");
$sftp->put('/home/u256167180/domains/noble.dion.sy/public_html/.env', $envContent);
echo "DONE\n";


