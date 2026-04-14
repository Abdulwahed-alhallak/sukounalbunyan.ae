import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
rm -f bootstrap/cache/*.php &&
echo "--- FIXING COMPOSER INSTALL ---" &&
/opt/alt/php82/usr/bin/php /usr/local/bin/composer install -o &&
echo "--- MIGRATING DATABASE ---" &&
/opt/alt/php82/usr/bin/php artisan migrate --force &&
echo "--- CLEARING CACHES ---" &&
/opt/alt/php82/usr/bin/php artisan optimize:clear &&
echo "--- VERIFYING DB CONNECTION ---" &&
/opt/alt/php82/usr/bin/php artisan db:show
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Fixing Debugbar...');
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
