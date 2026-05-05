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
    console.log('Running maintenance commands on server...');
    const commands = [
        `cd ${appDir} && /opt/alt/php82/usr/bin/php artisan optimize:clear`,
        `cd ${appDir} && ls -la storage/logs`,
        `cd ${appDir} && tail -n 50 error_log`
    ];
    
    const runCommand = (idx) => {
        if (idx >= commands.length) {
            conn.end();
            return;
        }
        console.log(`\nExecuting: ${commands[idx]}`);
        conn.exec(commands[idx], (err, stream) => {
            if (err) throw err;
            stream.on('data', d => process.stdout.write(d));
            stream.stderr.on('data', d => process.stderr.write(d));
            stream.on('close', () => runCommand(idx + 1));
        });
    };
    
    runCommand(0);
}).on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
}).connect(config);
