import { Client } from 'ssh2';

const conn = new Client();
// Often on Hostinger, php8.2 or /opt/alt/php82/usr/bin/php is needed
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
echo "--- 1. INSTALLING DEPENDENCIES (PHP 8.2) ---" &&
/opt/alt/php82/usr/bin/php /usr/local/bin/composer install --no-dev -o &&
echo "--- 2. MIGRATING DATABASE ---" &&
/opt/alt/php82/usr/bin/php artisan migrate --force &&
echo "--- 3. CLEARING CACHES ---" &&
/opt/alt/php82/usr/bin/php artisan optimize:clear &&
echo "--- 4. VERIFYING DB CONNECTION ---" &&
/opt/alt/php82/usr/bin/php artisan db:show
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Connecting DB...');
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
