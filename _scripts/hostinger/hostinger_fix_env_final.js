import { Client } from 'ssh2';

const conn = new Client();

const CORRECT_ENV = `APP_NAME="Sukoun Albunyan"
APP_ENV=production
APP_KEY=base64:l/0a7fA6FBBACDOShPl7G1CjfZOQli7qF1g0B2mPcIc=
APP_DEBUG=false
APP_TIMEZONE=Asia/Riyadh
APP_URL=https://sukounalbunyan.ae/backend

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=u256167180_noble
DB_PASSWORD=4_m_XMkgux@.AgC
DB_DATABASE=u256167180_noble

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync

MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@noble.dion.sy"
MAIL_FROM_NAME="\${APP_NAME}"

VITE_APP_NAME="\${APP_NAME}"
`;

conn.on('ready', () => {
    console.log('SSH Connected. Writing correct .env and rebuilding caches...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const remotePath = 'domains/noble.dion.sy/public_html/.env';
        
        const writeStream = sftp.createWriteStream(remotePath);
        writeStream.write(CORRECT_ENV);
        writeStream.end();
        
        writeStream.on('close', () => {
            console.log('.env written successfully. Rebuilding caches...');
            
            const artisanCmds = [
                'cd domains/noble.dion.sy/public_html',
                '/opt/alt/php82/usr/bin/php artisan config:cache',
                '/opt/alt/php82/usr/bin/php artisan route:cache',
                '/opt/alt/php82/usr/bin/php artisan view:clear',
                '/opt/alt/php82/usr/bin/php artisan cache:clear',
                'echo "=== DB Test ==="',
                '/opt/alt/php82/usr/bin/php artisan db:show 2>&1 | head -15',
                'echo "=== Site Test ==="',
                'curl -sk -o /dev/null -w "%{http_code}" https://sukounalbunyan.ae/backend/',
            ].join(' && ');
            
            conn.exec(artisanCmds, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code) => {
                    console.log(`\n\nDeployment Repair Complete. Exit: ${code}`);
                    conn.end();
                }).on('data', (data) => {
                    process.stdout.write(data);
                }).stderr.on('data', (data) => {
                    process.stderr.write(data);
                });
            });
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
