const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function verifyPermissions() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="\\$u = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first(); echo json_encode([ 'email' => \\$u->email, 'roles' => \\$u->getRoleNames(), 'permissions_count' => \\$u->getAllPermissions()->count() ]);"`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                conn.end();
            }).on('data', (data) => {
                console.log('PERMISSIONS_CHECK: ' + data);
            });
        });
    }).connect(CONFIG.SSH);
}

verifyPermissions();
