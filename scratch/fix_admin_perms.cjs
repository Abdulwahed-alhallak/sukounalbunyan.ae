const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    const phpPath = CONFIG.PHP;
    const appDir = CONFIG.APP_DIR;
    
    const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="
        \\$admin = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
        \\$allPerms = \\Spatie\\Permission\\Models\\Permission::all();
        \\$admin->syncPermissions(\\$allPerms);
        \\App\\Models\\User::MakeRole(\\$admin->id);
        echo json_encode(['admin_perms' => \\$admin->getAllPermissions()->count(), 'roles' => \\Spatie\\Permission\\Models\\Role::where('created_by', \\$admin->id)->count()]);
    "`;

    conn.exec(command, (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('data', (data) => output += data.toString());
        stream.on('close', () => {
            console.log('ADMIN_PERMISSIONS: ' + output);
            conn.end();
        });
    });
})
.on('error', (err) => console.error('Error:', err.message))
.connect({ ...CONFIG.SSH, readyTimeout: 90000 });
