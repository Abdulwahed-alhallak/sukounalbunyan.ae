<?php
require __DIR__ . '/../vendor/autoload.php';
use phpseclib3\Net\SFTP;
use phpseclib3\Net\SSH2;
$host = '62.72.25.117'; $port = 65002; $username = 'u256167180'; $password = '4_m_XMkgux@.AgC';
$localTar = __DIR__ . '/../noble_clean_deploy_v2.tar.gz';
$remoteTar = '/home/u256167180/domains/noble.dion.sy/public_html/noble_clean_deploy_v2.tar.gz';
echo "1. Connecting to SFTP...\n";
$sftp = new SFTP($host, $port);
if (!$sftp->login($username, $password)) die("SFTP Login Failed\n");
echo "2. Uploading 31MB tar archive...\n";
if ($sftp->put($remoteTar, $localTar, SFTP::SOURCE_LOCAL_FILE)) { 
    echo "   [SUCCESS] Upload complete.\n"; 
} else { die("   [ERROR] Upload failed.\n"); }
echo "3. Connecting via SSH for extraction...\n";
$ssh = new SSH2($host, $port);
if (!$ssh->login($username, $password)) die("SSH Login Failed\n");
$remoteDir = '/home/u256167180/domains/noble.dion.sy/public_html';
$cmd = "cd $remoteDir && tar -xzf noble_clean_deploy.tar.gz && rm noble_clean_deploy.tar.gz && /opt/alt/php82/usr/bin/php artisan optimize:clear";
echo "4. Extracting clean build...\n";
echo $ssh->exec($cmd . " 2>&1");
$ssh->disconnect();
echo "--- CLEAN DEPLOYMENT COMPLETE ---\n";
