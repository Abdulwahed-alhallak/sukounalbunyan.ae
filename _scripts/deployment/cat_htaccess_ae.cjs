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
    const paths = [
        `${appDir}/.htaccess`,
        `${appDir}/public/.htaccess`
    ];
    
    const runCat = (idx) => {
        if (idx >= paths.length) {
            conn.end();
            return;
        }
        console.log(`\n--- CONTENT OF ${paths[idx]} ---`);
        conn.exec(`cat ${paths[idx]}`, (err, stream) => {
            stream.on('data', d => process.stdout.write(d));
            stream.on('close', () => runCat(idx + 1));
        });
    };
    
    runCat(0);
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
