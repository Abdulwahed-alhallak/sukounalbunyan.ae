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
        $tableStatus = DB::select("SHOW TABLE STATUS LIKE 'projects'");
        $columnStatus = DB::select("SHOW FULL COLUMNS FROM projects");
        $samples = DB::table('projects')->select('id', 'name')->limit(10)->get();
        
        echo "TABLE_STATUS=" . json_encode($tableStatus) . "\\n";
        echo "COLUMN_STATUS=" . json_encode($columnStatus) . "\\n";
        echo "SAMPLES=" . json_encode($samples) . "\\n";
    `;
    
    conn.exec(`cd ${appDir} && ${php} artisan tinker --execute='${tinkerCmd.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
