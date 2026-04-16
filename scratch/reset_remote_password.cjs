const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    const command = `cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="\\$u = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first(); \\$u->password = \\Hash::make('Nn@!23456'); \\$u->save(); echo 'PASSWORD_RESET_SUCCESS';"`;
    conn.exec(command, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', (d) => out += d.toString());
        stream.on('close', () => { console.log(out); conn.end(); });
    });
}).connect(CONFIG.SSH);
