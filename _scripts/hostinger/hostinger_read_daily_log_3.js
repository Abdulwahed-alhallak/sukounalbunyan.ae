import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('grep -A 2 "local.ERROR" domains/noble.dion.sy/public_html/storage/logs/laravel-2026-04-13.log | tail -n 6', (err, stream) => {
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

