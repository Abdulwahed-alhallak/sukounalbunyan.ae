const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function checkProductionCounts() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="
            echo json_encode([
                'permissions' => \\DB::table('permissions')->count(),
                'roles' => \\DB::table('roles')->count(),
                'departments' => \\DB::table('departments')->count(),
                'designations' => \\DB::table('designations')->count(),
                'branches' => \\DB::table('branches')->count(),
                'employees' => \\DB::table('employees')->count(),
                'employees_with_dept' => \\DB::table('employees')->whereNotNull('department_id')->count()
            ]);
        "`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            let output = '';
            stream.on('data', (data) => output += data.toString());
            stream.on('close', () => {
                console.log('PRODUCTION_STATUS: ' + output);
                conn.end();
            });
        });
    }).connect(CONFIG.SSH);
}

checkProductionCounts();
