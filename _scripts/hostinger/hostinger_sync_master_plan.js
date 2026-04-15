import { Client } from 'ssh2';
import fs from 'fs';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();

// Load database credentials from CONFIG (loaded from .env.production)
const DB_HOST = CONFIG.DB.host;
const DB_USER = CONFIG.DB.username;
const DB_PASS = CONFIG.DB.password;
const DB_NAME = CONFIG.DB.database;

conn.on('ready', () => {
    console.log('SSH Connected. Initializing native SFTP pipeline...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const localFile = './app/Console/Commands/NobleMasterSync.php';
        const remoteFile = 'domains/noble.dion.sy/public_html/app/Console/Commands/NobleMasterSync.php';
        
        console.log(`Uploading Master Sync Controller: ${localFile} -> ${remoteFile}`);
        
        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) throw err;
            console.log('Restoring Production Env and triggering global database sync from CONFIG...');
            
            // Use CONFIG database credentials instead of hardcoded values
            const cmd = `cd domains/noble.dion.sy/public_html && sed -i 's/DB_DATABASE=.*/DB_DATABASE=${DB_NAME}/g' .env && sed -i 's/DB_USERNAME=.*/DB_USERNAME=${DB_USER}/g' .env && sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASS}/g' .env && /opt/alt/php82/usr/bin/php artisan cache:clear && /opt/alt/php82/usr/bin/php artisan config:cache && /opt/alt/php82/usr/bin/php artisan noble:master-sync`;

            conn.exec(cmd, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log(`Noble Master Plan Synchronization Completed with Code: ${code}.`);
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

