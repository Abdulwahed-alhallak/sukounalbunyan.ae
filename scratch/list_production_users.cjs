const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

function checkUsers() {
    conn.on('ready', () => {
        const phpPath = CONFIG.PHP;
        const appDir = CONFIG.APP_DIR;
        
        const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="echo json_encode(\\App\\Models\\User::select('id','name','email','type')->limit(20)->get());"`;

        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('data', (data) => {
                console.log('USERS: ' + data);
            }).on('close', () => conn.end());
        });
    }).connect(CONFIG.SSH);
}

checkUsers();
