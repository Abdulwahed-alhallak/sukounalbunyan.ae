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

function fixDoubleUTF8($str) {
    if (empty($str)) return $str;
    // If it contains "ظ" followed by common mojibake chars, it's likely double encoded
    if (strpos($str, "ظ") !== false || strpos($str, "ط") !== false) {
        // Try to reverse Windows-1252 to UTF-8
        $fixed = @mb_convert_encoding($str, "Windows-1252", "UTF-8");
        // Check if the result looks like valid Arabic
        if (preg_match('/[\\x{0600}-\\x{06FF}]/u', $fixed)) {
            return $fixed;
        }
    }
    return $str;
}

$projects = \\DB::table('projects')->get();
foreach ($projects as $project) {
    $original = $project->name;
    $fixed = fixDoubleUTF8($original);
    if ($original !== $fixed) {
        echo "ID: {$project->id}\\n";
        echo "  ORIGINAL: $original\\n";
        echo "  FIXED:    $fixed\\n";
    }
}
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/fix_encoding_test_v2.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            console.log('✅ Uploaded fix_encoding_test_v2.php');
            conn.exec(`cd ${appDir} && ${php} fix_encoding_test_v2.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => {
                    conn.end();
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
