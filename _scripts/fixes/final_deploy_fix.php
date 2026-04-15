<?php
require __DIR__ . '/../vendor/autoload.php';
use phpseclib3\Net\SFTP;
use phpseclib3\Net\SSH2;
$host = '62.72.25.117'; $port = 65002; $username = 'u256167180'; $password = '4_m_XMkgux@.AgC';
$localProviders = __DIR__ . '/../bootstrap/providers.php';
$remoteProviders = '/home/u256167180/domains/noble.dion.sy/public_html/bootstrap/providers.php';
echo "1. Uploading corrected providers.php...\n";
$sftp = new SFTP($host, $port);
if (!$sftp->login($username, $password)) die("SFTP Login Failed\n");
if ($sftp->put($remoteProviders, $localProviders, SFTP::SOURCE_LOCAL_FILE)) { 
    echo "   [SUCCESS] Upload complete.\n"; 
} else { die("   [ERROR] Upload failed.\n"); }
echo "2. Clearing remote caches...\n";
$ssh = new SSH2($host, $port);
if (!$ssh->login($username, $password)) die("SSH Login Failed\n");
$cmd = "rm /home/u256167180/domains/noble.dion.sy/public_html/bootstrap/cache/*.php && /opt/alt/php82/usr/bin/php /home/u256167180/domains/noble.dion.sy/public_html/artisan optimize:clear";
echo $ssh->exec($cmd . " 2>&1");
$ssh->disconnect();
echo "--- FINAL FIX COMPLETE ---\n";
