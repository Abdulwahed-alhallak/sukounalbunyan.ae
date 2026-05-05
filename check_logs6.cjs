const { Client } = require('ssh2');
const config = { host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC' };
const conn = new Client();
conn.on('ready', () => {
    conn.exec('cd domains/sukounalbunyan.ae/public_html/backend && tail -n 500 storage/logs/noble-2026-05-05.log | grep -i -B 2 -A 5 "ERROR"', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => { conn.end(); }).on('data', (data) => { process.stdout.write(data); }).stderr.on('data', (data) => { process.stderr.write(data); });
    });
}).connect(config);
