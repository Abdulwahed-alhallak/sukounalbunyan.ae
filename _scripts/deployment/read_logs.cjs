const { Client } = require('ssh2');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const remotePath = 'domains/sukounalbunyan.ae/public_html/backend';

const conn = new Client();
conn.on('ready', () => {
    console.log('Connected to server via SSH');
    conn.exec(`cd ${remotePath} && tail -n 50 storage/logs/laravel.log`, { pty: false }, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (err) => {
    console.error(`Connection error: ${err.message}`);
}).connect(config);
