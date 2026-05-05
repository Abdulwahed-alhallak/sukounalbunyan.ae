const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = { host: process.env.PRODUCTION_HOST, port: parseInt(process.env.PRODUCTION_PORT, 10), username: process.env.PRODUCTION_USERNAME, password: process.env.PRODUCTION_PASSWORD };
const appDir = process.env.PRODUCTION_APP_DIR;

const conn = new Client();
conn.on('ready', () => {
    const today = new Date().toISOString().slice(0, 10);
    const logFile = `${appDir}/storage/logs/noble-${today}.log`;
    // Search for ERROR or Exception
    const cmd = `grep -iE "ERROR|Exception" ${logFile} | tail -n 20`;
    conn.exec(cmd, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => { console.error('❌ SSH Error:', err.message); }).connect(config);
