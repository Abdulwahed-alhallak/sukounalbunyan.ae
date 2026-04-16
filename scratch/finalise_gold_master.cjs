const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function finaliseGoldMaster() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="
            \\$u1 = \\App\\Models\\User::where('email', 'admin@noble.dion.sy')->first();
            if(\\$u1) \\$u1->update(['email' => 'admin@noblearchitecture.net', 'password' => \\Hash::make('Nn@!23456'), 'status' => 'active', 'is_active' => 1]);
            
            \\$u2 = \\App\\Models\\User::where('email', 'superadmin@noble.dion.sy')->first();
            if(\\$u2) \\$u2->update(['email' => 'superadmin@noblearchitecture.net', 'password' => \\Hash::make('Nn@!23456'), 'status' => 'active', 'is_active' => 1]);

            echo json_encode([
                'user_count' => \\App\\Models\\User::count(),
                'employee_count' => \\App\\Models\\User::where('type', 'staff')->count(),
                'admin_fixed' => \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->exists()
            ]);
        "`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            let output = '';
            stream.on('data', (data) => output += data.toString());
            stream.on('close', () => {
                console.log('FINAL_STATUS: ' + output);
                conn.end();
            });
        });
    }).connect(CONFIG.SSH);
}

finaliseGoldMaster();
