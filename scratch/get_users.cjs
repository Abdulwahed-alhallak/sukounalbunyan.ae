const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    const cmd = "cd /home/u256167180/domains/noble.dion.sy/public_html && /opt/alt/php82/usr/bin/php artisan tinker --execute=\"echo 'USER_COUNT: ' . User::count()\"";
    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
            console.log(out);
            conn.end();
        });
    });
}).connect({
    host: '62.72.25.117', port: 65002,
    username: 'u256167180', password: '4_m_XMkgux@.AgC',
    readyTimeout: 30000,
    keepaliveInterval: 5000,
    keepaliveCountMax: 10
});
