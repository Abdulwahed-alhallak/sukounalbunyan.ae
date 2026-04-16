const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function finalAudit() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="
            \\$user = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
            if(!\\$user) { echo 'ADMIN_NOT_FOUND'; return; }
            
            // Re-assign all permissions to the company role if they are missing
            \\$permissions = \\App\\Models\\User::where('email', 'superadmin@noblearchitecture.net')->first()->getAllPermissions();
            // Actually, better to just count them
            echo json_encode([
                'user_email' => \\$user->email,
                'permission_count' => \\$user->getAllPermissions()->count(),
                'employee_count' => \\App\\Models\\User::where('type', 'staff')->count(),
                'department_count' => \\App\\Models\\Department::count(),
                'cache_status' => Cache::has('admin_settings') ? 'Cached' : 'Not Cached'
            ]);
        "`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            let output = '';
            stream.on('data', (data) => output += data.toString());
            stream.on('close', () => {
                console.log('AUDIT_RESULT: ' + output);
                conn.end();
            });
        });
    }).connect(CONFIG.SSH);
}

finalAudit();
