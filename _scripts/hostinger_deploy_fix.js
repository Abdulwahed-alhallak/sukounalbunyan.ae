import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
echo "--- 3. INSTALLING DEPENDENCIES FIX ---" &&
composer install --no-dev -o &&
echo "--- 4. MIGRATING DATABASE ---" &&
php artisan migrate --force &&
echo "--- 5. CLEARING CACHES ---" &&
php artisan optimize:clear &&
echo "--- 6. VERIFYING DB CONNECTION ---" &&
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
