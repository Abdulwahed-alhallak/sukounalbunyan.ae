const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function disableRemoteVerification() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        // Command to set enableEmailVerification to off for all super admins on production
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="foreach(\\App\\Models\\User::where('type', 'superadmin')->get() as \\$u) { setSetting('enableEmailVerification', 'off', \\$u->id); } echo 'SETTINGS_UPDATED_REMOTE';"`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('data', (data) => console.log(data.toString()));
            stream.on('close', () => {
                console.log('✅ Remote settings updated.');
                conn.end();
            });
        });
    }).connect(CONFIG.SSH);
}

disableRemoteVerification();
