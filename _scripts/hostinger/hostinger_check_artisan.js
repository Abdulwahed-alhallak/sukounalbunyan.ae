import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('cd domains/noble.dion.sy/public_html && /opt/alt/php82/usr/bin/php artisan help', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect(CONFIG.SSH);

