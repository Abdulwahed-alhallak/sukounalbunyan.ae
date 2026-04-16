const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function checkLogs() {
    conn.on('ready', () => {
        const appDir = CONFIG.APP_DIR;
        const command = `tail -n 50 ${appDir}/storage/logs/laravel.log`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                conn.end();
            }).on('data', (data) => {
                console.log('LOGS:\n' + data);
            });
        });
    }).connect(CONFIG.SSH);
}

checkLogs();
