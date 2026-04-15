const { Client } = require('ssh2');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');
const conn = new Client();
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

conn.on('ready', () => {
    // Check first employee name from HRM module
    const cmd = `cd ${APP} && ${PHP} artisan tinker --execute="echo \\Noble\\Hrm\\Models\\Employee::first()->name;"`;
    conn.exec(cmd, (err, stream) => {
        stream.on('data', d => console.log('Name from Prod:', d.toString()));
        stream.stderr.on('data', d => console.error(d.toString()));
        stream.on('close', () => conn.end());
    });
}).connect(CONFIG.SSH);
