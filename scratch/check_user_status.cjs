const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function checkUserStatus() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="\\$u = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first(); echo json_encode([ 'exists' => !!\\$u, 'is_disable' => \\$u->is_disable ?? null, 'type' => \\$u->type ?? null, 'is_enable_login' => \\$u->is_enable_login ?? null ]);"`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                conn.end();
            }).on('data', (data) => {
                console.log('USER_STATUS: ' + data);
            });
        });
    }).connect(CONFIG.SSH);
}

checkUserStatus();
