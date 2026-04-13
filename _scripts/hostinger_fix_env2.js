import { Client } from 'ssh2';

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Repairing Production Environment...');
    
    const commands = [
        'cd domains/noble.dion.sy/public_html',
        "sed -i 's|DB_HOST=srv1142.hstgr.io|DB_HOST=127.0.0.1|g' .env",
        "sed -i 's|APP_DEBUG=true|APP_DEBUG=false|g' .env",
        '/opt/alt/php82/usr/bin/php artisan config:cache',
        '/opt/alt/php82/usr/bin/php artisan cache:clear'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`\nEnvironment Repair Completed with Code: ${code}`);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
