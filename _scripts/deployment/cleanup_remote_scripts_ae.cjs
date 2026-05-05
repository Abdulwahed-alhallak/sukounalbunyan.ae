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

const conn = new Client();
conn.on('ready', () => {
    const cmd = `rm ${appDir}/fix_encoding_*.php ${appDir}/test_encoding*.php ${appDir}/check_legacy_links.php ${appDir}/replace_legacy_links.php ${appDir}/radical_encoding_fix.php ${appDir}/safe_encoding_recovery.php ${appDir}/fix_encoding_map.php`;
    conn.exec(cmd, (err, stream) => {
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
