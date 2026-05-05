const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = { host: process.env.PRODUCTION_HOST, port: parseInt(process.env.PRODUCTION_PORT, 10), username: process.env.PRODUCTION_USERNAME, password: process.env.PRODUCTION_PASSWORD };
const appDir = process.env.PRODUCTION_APP_DIR;
const php82 = '/opt/alt/php82/usr/bin/php';

const conn = new Client();
conn.on('ready', () => {
    const cmd = `cd ${appDir} && ${php82} artisan tinker --execute="echo json_encode(Schema::getColumnListing('rental_contracts'));"`;
    conn.exec(cmd, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('stderr', d => process.stderr.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => { console.error('❌ SSH Error:', err.message); }).connect(config);
