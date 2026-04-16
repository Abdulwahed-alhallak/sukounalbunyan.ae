const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function seedProductionPermissions() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        console.log('🚀 Seeding permissions on production (FORCED)...');
        const command = `cd ${appDir} && ${phpPath} artisan db:seed --class=PermissionRoleSeeder --force`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('data', (data) => console.log(data.toString()));
            stream.on('close', () => {
                console.log('✅ Permissions seeded.');
                conn.end();
            });
        });
    }).connect(CONFIG.SSH);
}

seedProductionPermissions();
