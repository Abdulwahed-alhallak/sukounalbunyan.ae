const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    conn.exec('cd domains/sukounalbunyan.ae/public_html/backend && /opt/alt/php82/usr/bin/php artisan route:list', (err, stream) => {
        let output = '';
        stream.on('data', d => {
            output += d.toString();
        }).on('close', () => {
            const lines = output.split('\n');
            const rootRoutes = lines.filter(line => line.includes(' / '));
            console.log(rootRoutes.join('\n'));
            conn.end();
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
