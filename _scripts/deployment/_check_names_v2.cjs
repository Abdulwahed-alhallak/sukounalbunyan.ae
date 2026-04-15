const { Client } = require('ssh2');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');
const conn = new Client();
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

conn.on('ready', () => {
    // Check first employee name_ar and first user name
    const cmd = `cd ${APP} && ${PHP} artisan tinker --execute="echo 'Emp Ar: ' . Noble\\Hrm\\Models\\Employee::first()?->name_ar . PHP_EOL; echo 'User Name: ' . App\\Models\\User::where('type', 'super admin')->first()?->name . PHP_EOL;"`;
    conn.exec(cmd, (err, stream) => {
        let out = '';
        stream.on('data', d => out += d.toString());
        stream.stderr.on('data', d => out += d.toString());
        stream.on('close', () => {
            console.log(out);
            conn.end();
        });
    });
}).connect(CONFIG.SSH);
