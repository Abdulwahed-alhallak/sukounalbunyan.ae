const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function resetPassword() {
    conn.on('ready', () => {
        console.log('✅ SSH Connected.');
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        const newPassHash = 'Nn@!23456';
        
        // We will use tinker to update passwords
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="\\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->update(['password' => \\Illuminate\\Support\\Facades\\Hash::make('${newPassHash}')]); \\App\\Models\\User::where('email', 'superadmin@noblearchitecture.net')->update(['password' => \\Illuminate\\Support\\Facades\\Hash::make('${newPassHash}')]);"`;

        console.log('🔄 Resetting passwords on server...');
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('✅ Passwords reset successfully on server. Exit code: ' + code);
                conn.end();
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).connect(CONFIG.SSH);
}

resetPassword();
