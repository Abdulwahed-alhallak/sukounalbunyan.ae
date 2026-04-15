import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
echo "--- FIXING VITE HOSTINGER BUG ---" &&
rm -f public/hot &&
/opt/alt/php82/usr/bin/php artisan view:clear &&
/opt/alt/php82/usr/bin/php artisan optimize:clear &&
echo "--- VITE CACHE FLUSHED SUCCESSFULLY ---"
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Flushing Vite HOT tracker...');
    conn.exec(deployCommands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`Vite Hot Swap Removed with Code: ${code}`);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect(CONFIG.SSH);

