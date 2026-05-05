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

function fixMojibake($str) {
    if (empty($str)) return $str;
    // Strategy: Convert UTF-8 back to CP1252 bytes, then treat as UTF-8
    $bytes = @iconv("UTF-8", "Windows-1252//IGNORE", $str);
    if ($bytes === false) return $str;
    return $bytes;
}

$projects = \\DB::table('projects')->get();
foreach ($projects as $project) {
    $original = $project->name;
    $fixed = fixMojibake($original);
    if ($original !== $fixed) {
        echo "ID: {$project->id}\\n";
        echo "  ORIGINAL: $original\\n";
        echo "  FIXED:    $fixed\\n";
    }
}
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/fix_encoding_test.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            console.log('✅ Uploaded fix_encoding_test.php');
            conn.exec(`cd ${appDir} && ${php} fix_encoding_test.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => {
                    // conn.exec(`rm ${remoteFile}`, () => conn.end());
                    conn.end();
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
