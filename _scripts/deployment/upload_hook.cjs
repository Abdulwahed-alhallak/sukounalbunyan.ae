const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');
const conn = new Client();
const config = {
    ...CONFIG.SSH,
    readyTimeout: 60000
};

conn.on('ready', () => {
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const local = path.resolve(__dirname, 'deploy_hook.php');
        const remote = 'domains/noble.dion.sy/public_html/deploy_hook.php';
        
        sftp.fastPut(local, remote, (err) => {
            if (err) throw err;
            console.log('Hook uploaded successfully.');
            conn.end();
            process.exit(0);
        });
    });
}).connect(config);
