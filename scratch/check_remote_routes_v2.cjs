const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    conn.exec('cd domains/sukounalbunyan.ae/public_html/backend && /opt/alt/php82/usr/bin/php artisan route:list', (err, stream) => {
        let output = '';
        stream.on('data', d => {
            output += d.toString();
        }).on('close', () => {
            const lines = output.split('\n');
            // Match lines where the URI is exactly "/" or starts with "/" followed by spaces
            const rootRoutes = lines.filter(line => {
                // The route list format is usually: Method | URI | Name | Action
                // We look for the URI column being exactly "/"
                const parts = line.trim().split(/\s+/);
                return parts.some(p => p === '/');
            });
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
