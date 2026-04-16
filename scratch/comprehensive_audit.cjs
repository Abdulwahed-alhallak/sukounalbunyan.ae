const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function comprehensiveAudit() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="
            \\$user = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
            if(!\\$user) { echo 'ADMIN_NOT_FOUND'; return; }
            
            echo json_encode([
                'user_email' => \\$user->email,
                'permission_count' => \\$user->getAllPermissions()->count(),
                'user_total' => \\App\\Models\\User::count(),
                'employee_total' => \\App\\Models\\User::where('type', 'staff')->count(),
                'department_total' => \\Noble\\Hrm\\Models\\Department::count(),
                'designation_total' => \\Noble\\Hrm\\Models\\Designation::count(),
                'branch_total' => \\Noble\\Hrm\\Models\\Branch::count(),
                'cache_status' => Cache::has('admin_settings') ? 'Cached' : 'Not Cached'
            ]);
        "`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            let output = '';
            stream.on('data', (data) => output += data.toString());
            stream.on('close', () => {
                console.log('FINAL_AUDIT_RESULT: ' + output);
                conn.end();
            });
        });
    }).connect(CONFIG.SSH);
}

comprehensiveAudit();
