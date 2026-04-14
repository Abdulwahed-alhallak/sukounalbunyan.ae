import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
echo "--- 1. CLEARING CACHES TO FIX 500 ERROR ---" &&
/opt/alt/php82/usr/bin/php artisan optimize:clear || php artisan optimize:clear || true &&
echo "--- 2. MIGRATING DATABASE ---" &&
/opt/alt/php82/usr/bin/php artisan migrate --force || php artisan migrate --force || true &&
echo "--- 3. VERIFYING DB CONNECTION ---" &&
php artisan db:show
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Resuming Deployment...');
    conn.exec(deployCommands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`Deployment Finished with Code: ${code}`);
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
