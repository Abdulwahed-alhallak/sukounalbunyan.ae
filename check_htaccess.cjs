const { Client } = require('ssh2');
const config = { host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC' };
const conn = new Client();
conn.on('ready', () => {
    conn.exec('cat domains/sukounalbunyan.ae/public_html/backend/.htaccess', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => { conn.end(); }).on('data', (data) => { process.stdout.write(data); }).stderr.on('data', (data) => { process.stderr.write(data); });
    });
}).connect(config);
