const fs = require('fs');
const { Client } = require('ssh2');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connected!');
    conn.exec('cd domains/sukounalbunyan.ae/public_html/backend/public && mkdir -p build && mv manifest.json build/ && mv assets build/', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Fixed! Code: ' + code);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect(config);
