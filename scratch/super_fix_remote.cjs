const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function superFix() {
    conn.on('ready', () => {
        console.log('✅ SSH Connected.');
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        const newPassHash = 'Nn@!23456';
        
        const tinkerCmd = `
            \\$u = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
            if (\\$u) {
                \\$u->update([
                    'password' => \\Illuminate\\Support\\Facades\\Hash::make('${newPassHash}'),
                    'is_disable' => 0,
                    'is_enable_login' => 1
                ]);
                echo 'ADMIN_FIXED ';
            }
            \\$s = \\App\\Models\\User::where('email', 'superadmin@noblearchitecture.net')->first();
            if (\\$s) {
                \\$s->update([
                    'password' => \\Illuminate\\Support\\Facades\\Hash::make('${newPassHash}'),
                    'is_disable' => 0,
                    'is_enable_login' => 1
                ]);
                echo 'SUPERADMIN_FIXED';
            }
        `.replace(/\n/g, ' ').trim();

        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="${tinkerCmd}"`;

        console.log('🔄 Executing Super Fix on server...');
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('✅ Super Fix completed. Exit code: ' + code);
                conn.end();
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).connect(CONFIG.SSH);
}

superFix();
