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
    console.log('Reading Laravel logs from server...');
    conn.exec(`cd ${appDir} && tail -n 100 storage/logs/laravel.log`, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => conn.end());
        stream.on('data', d => process.stdout.write(d));
        stream.stderr.on('data', d => process.stderr.write(d));
    });
}).on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
}).connect(config);
