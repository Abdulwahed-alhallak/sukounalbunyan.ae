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
        $str = DB::table('projects')->where('id', 4)->value('name');
        echo "RAW: " . $str . "\\n";
        
        // Brute force recovery
        $latin1 = mb_convert_encoding($str, "ISO-8859-1", "UTF-8");
        echo "LATIN1_BYTES: " . bin2hex($latin1) . "\\n";
        
        $fixed = mb_convert_encoding($latin1, "UTF-8", "UTF-8");
        echo "FIXED: " . $fixed . "\\n";
        
        // Another attempt: treat as Windows-1252
        $cp1252 = mb_convert_encoding($str, "Windows-1252", "UTF-8");
        echo "CP1252_BYTES: " . bin2hex($cp1252) . "\\n";
        $fixed2 = mb_convert_encoding($cp1252, "UTF-8", "UTF-8");
        echo "FIXED2: " . $fixed2 . "\\n";
    `;
    
    conn.exec(`cd ${appDir} && ${php} artisan tinker --execute='${tinkerCmd.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
