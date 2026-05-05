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
    const tinkerCmd = `
        $corrupted = DB::table('projects')->where('id', 4)->value('name');
        
        echo "ORIGINAL: " . $corrupted . "\\n";
        
        // Strategy 1: UTF-8 to Latin1 (reverses the accidental encoding)
        try {
            $s1 = mb_convert_encoding($corrupted, "ISO-8859-1", "UTF-8");
            echo "STRATEGY_1 (ISO-8859-1): " . $s1 . "\\n";
        } catch (\\Exception $e) {}

        try {
            $s2 = iconv("UTF-8", "ISO-8859-1//IGNORE", $corrupted);
            echo "STRATEGY_2 (ICONV ISO): " . $s2 . "\\n";
        } catch (\\Exception $e) {}

        try {
            // If it was double-encoded
            $s3 = mb_convert_encoding($corrupted, "UTF-8", "UTF-8");
            echo "STRATEGY_3 (UTF8-UTF8): " . $s3 . "\\n";
        } catch (\\Exception $e) {}
        
        // Most common for Arabic mojibake
        try {
            $s4 = mb_convert_encoding($corrupted, "UTF-8", "Windows-1252");
            echo "STRATEGY_4 (CP1252): " . $s4 . "\\n";
        } catch (\\Exception $e) {}
    `;
    
    conn.exec(`cd ${appDir} && ${php} artisan tinker --execute='${tinkerCmd.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
