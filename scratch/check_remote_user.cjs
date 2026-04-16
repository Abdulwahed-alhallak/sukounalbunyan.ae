const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function checkUser() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="echo \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->exists() ? 'EXISTS' : 'NOT_FOUND';"`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                conn.end();
            }).on('data', (data) => {
                console.log('RESULT: ' + data);
            });
        });
    }).connect(SSH_CONFIG = CONFIG.SSH);
}

checkUser();
