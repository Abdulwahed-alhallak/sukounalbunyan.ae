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
    console.log('Force clearing bootstrap cache on server...');
    const cmd = `rm -f ${appDir}/bootstrap/cache/config.php ${appDir}/bootstrap/cache/services.php ${appDir}/bootstrap/cache/packages.php ${appDir}/bootstrap/cache/routes-v7.php`;
    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('Bootstrap cache files deleted.');
            conn.end();
        }).on('data', d => process.stdout.write(d));
    });
}).on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
}).connect(config);
