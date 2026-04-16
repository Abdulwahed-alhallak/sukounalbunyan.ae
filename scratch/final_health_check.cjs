const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function checkProductionStatus() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="echo json_encode([ 'employee_count' => \\App\\Models\\User::where('type', 'employee')->count(), 'company_admin_exists' => \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->exists(), 'latest_logs' => shell_exec('tail -n 5 storage/logs/laravel.log') ]);"`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                conn.end();
            }).on('data', (data) => {
                console.log('STATUS: ' + data);
            });
        });
    }).connect(CONFIG.SSH);
}

checkProductionStatus();
