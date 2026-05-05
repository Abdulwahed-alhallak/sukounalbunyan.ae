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

$str = \\DB::table('projects')->where('id', 4)->value('name');
echo "ORIGINAL: $str\\n";

$encodings = ['Windows-1252', 'Windows-1256', 'ISO-8859-1', 'ISO-8859-6', 'CP1252', 'CP1256', 'Latin1'];

foreach ($encodings as $enc) {
    try {
        $converted = mb_convert_encoding($str, $enc, "UTF-8");
        echo "FROM UTF-8 TO $enc: " . bin2hex($converted) . " -> " . $converted . "\\n";
        
        // Now try to treat THOSE bytes as UTF-8
        $fixed = @mb_convert_encoding($converted, "UTF-8", "UTF-8");
        echo "  AS UTF-8: $fixed\\n";
        
        // Try treating as Windows-1256
        $fixed_ar = @mb_convert_encoding($converted, "UTF-8", "Windows-1256");
        echo "  AS Win1256: $fixed_ar\\n";
        
    } catch (\\Exception $e) {
        echo "ERROR $enc: " . $e->getMessage() . "\\n";
    }
}
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/test_encodings_final.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            conn.exec(`cd ${appDir} && ${php} test_encodings_final.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
