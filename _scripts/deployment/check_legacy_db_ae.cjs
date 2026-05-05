const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = {
    host: process.env.PRODUCTION_HOST,
    port: parseInt(process.env.PRODUCTION_PORT, 10),
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD
};

const appDir = process.env.PRODUCTION_APP_DIR;
const php = '/opt/alt/php82/usr/bin/php';

const conn = new Client();
conn.on('ready', () => {
    const phpCode = `<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$tables = \\DB::select('SHOW TABLES');
$dbName = \\DB::getDatabaseName();
$prop = "Tables_in_" . $dbName;

foreach ($tables as $t) {
    $table = $t->$prop;
    $columns = \\Schema::getColumnListing($table);
    foreach ($columns as $col) {
        $count = \\DB::table($table)->where($col, 'LIKE', '%dion.sy%')->orWhere($col, 'LIKE', '%alhallak%')->count();
        if ($count > 0) {
            echo "Found $count matches in table $table, column $col\\n";
        }
    }
}
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/check_legacy_links.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            conn.exec(`cd ${appDir} && ${php} check_legacy_links.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
