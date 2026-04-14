<?php
require __DIR__ . '/../vendor/autoload.php';
use phpseclib3\Net\SFTP;
$host = '62.72.25.117'; $port = 65002; $username = 'u256167180'; $password = '4_m_XMkgux@.AgC';
$envContent = 'APP_NAME="Noble Architecture"
APP_ENV=production
APP_KEY=base64:f/yDBCN6hqxxiCvao1JvCDtte/iLcgJ7E5pBe8W4iFc=
APP_DEBUG=false
APP_URL=https://noble.dion.sy

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u256167180_noble
DB_USERNAME=u256167180_noble
DB_PASSWORD="4_m_XMkgux@.AgC"

SESSION_DRIVER=database
CACHE_DRIVER=file
QUEUE_CONNECTION=database
';
echo "Uploading Production .env withNobleArchitecture branding...\n";
$sftp = new SFTP($host, $port);
if (!$sftp->login($username, $password)) die("Login Failed");
$sftp->put('/home/u256167180/domains/noble.dion.sy/public_html/.env', $envContent);
echo "DONE\n";


