const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    conn.exec(`cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="echo 'COUNT: ' . \\Noble\\Hrm\\Models\\Employee::whereNotNull('iqama_expiry_date')->count();"`, (err, stream) => {
        if (err) throw err;
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).connect(CONFIG.SSH);
