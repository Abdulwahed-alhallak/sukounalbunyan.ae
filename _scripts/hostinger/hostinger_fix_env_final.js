import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();

// Load database credentials from environment (NOT hardcoded)
const DB_PASSWORD = process.env.DB_PASSWORD || CONFIG.DB.password;
const DB_HOST = process.env.DB_HOST || CONFIG.DB.host;
const DB_PORT = process.env.DB_PORT || CONFIG.DB.port;
const DB_USER = process.env.DB_USERNAME || CONFIG.DB.username;
const DB_NAME = process.env.DB_DATABASE || CONFIG.DB.database;

const CORRECT_ENV = `APP_NAME="Noble Architecture"
APP_ENV=production
APP_KEY=base64:l/0a7fA6FBBACDOShPl7G1CjfZOQli7qF1g0B2mPcIc=
APP_DEBUG=false
APP_TIMEZONE=Asia/Riyadh
APP_URL=https://noble.dion.sy

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_NAME}

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
                'curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/',
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
}).connect(CONFIG.SSH);

