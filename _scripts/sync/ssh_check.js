import { Client } from 'ssh2';
const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Ready');
    conn.exec('ls -F domains/noble.dion.sy/public_html', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect(CONFIG.SSH);

