import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    const updateEnvCmd = `
cd domains/noble.dion.sy/public_html &&
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env &&
sed -i 's/^DB_HOST=.*/DB_HOST=127.0.0.1/' .env &&
sed -i 's/^DB_PORT=.*/DB_PORT=3306/' .env &&
sed -i 's/^DB_DATABASE=.*/DB_DATABASE=u256167180_noble/' .env &&
sed -i 's/^DB_USERNAME=.*/DB_USERNAME=u256167180_noble/' .env &&
sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=m:\\&\\!u>Do\\!P3/' .env &&
/opt/alt/php82/usr/bin/php artisan config:clear &&
/opt/alt/php82/usr/bin/php artisan cache:clear
    `;
    conn.exec(updateEnvCmd, (err, stream) => {
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
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
