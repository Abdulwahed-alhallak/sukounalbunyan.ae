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
        
        $strategies = [
            'original' => $corrupted,
            'utf8_decode' => utf8_decode($corrupted),
            'mb_convert_latin1_to_utf8' => mb_convert_encoding($corrupted, "UTF-8", "ISO-8859-1"),
            'mb_convert_windows1256_to_utf8' => mb_convert_encoding($corrupted, "UTF-8", "Windows-1256"),
            'double_utf8_fix' => mb_convert_encoding(mb_convert_encoding($corrupted, "latin1", "UTF-8"), "UTF-8", "UTF-8"),
        ];
        
        foreach ($strategies as $name => $val) {
            echo "$name: $val\\n";
        }
    `;
    
    conn.exec(`cd ${appDir} && ${php} artisan tinker --execute='${tinkerCmd.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
