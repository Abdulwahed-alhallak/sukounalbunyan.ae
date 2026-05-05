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
        function fixMojibake($str) {
            if (empty($str)) return $str;
            // Strategy: Convert UTF-8 back to CP1252 bytes, then treat as UTF-8
            $bytes = @iconv("UTF-8", "Windows-1252//IGNORE", $str);
            if ($bytes === false) return $str;
            $fixed = @iconv("UTF-8", "UTF-8//IGNORE", $bytes); // Just to be safe
            return $bytes;
        }

        $id = 4;
        $corrupted = DB::table('projects')->where('id', $id)->value('name');
        echo "ORIGINAL: " . $corrupted . "\\n";
        
        $fixed = fixMojibake($corrupted);
        echo "FIXED: " . $fixed . "\\n";
        
        // Test with another one
        $id2 = 5;
        $corrupted2 = DB::table('projects')->where('id', $id2)->value('name');
        echo "ORIGINAL 2: " . $corrupted2 . "\\n";
        echo "FIXED 2: " . fixMojibake($corrupted2) . "\\n";
    `;
    
    conn.exec(`cd ${appDir} && ${php} artisan tinker --execute='${tinkerCmd.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
