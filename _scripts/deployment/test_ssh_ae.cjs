const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = {
    host: process.env.PRODUCTION_HOST,
    port: parseInt(process.env.PRODUCTION_PORT, 10),
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD
};

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Ready');
    conn.end();
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
