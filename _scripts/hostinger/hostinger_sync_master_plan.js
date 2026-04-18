import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Initializing native SFTP pipeline...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const localFile = './app/Console/Commands/NobleMasterSync.php';
        const remoteFile = 'domains/noble.dion.sy/public_html/app/Console/Commands/NobleMasterSync.php';
        
        console.log(`Uploading Master Sync Controller: ${localFile} -> ${remoteFile}`);
        
        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) throw err;
            console.log('Upload complete. Restoring Production Env and triggering global database sync...');
            
            const cmd = `cd domains/noble.dion.sy/public_html && sed -i 's/DB_DATABASE=.*/DB_DATABASE=u256167180_noble/g' .env && sed -i 's/DB_USERNAME=.*/DB_USERNAME=u256167180_noble/g' .env && sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=4_m_XMkgux@.AgC/g' .env && /opt/alt/php82/usr/bin/php artisan cache:clear && /opt/alt/php82/usr/bin/php artisan config:cache && /opt/alt/php82/usr/bin/php artisan noble:master-sync`;

            conn.exec(cmd, (err, stream) => {
                if (err) throw err;
                stream.on('close', (/** @type {any} */ code, /** @type {any} */ signal) => {
                    console.log(`Noble Master Plan Synchronization Completed with Code: ${code}.`);
                    conn.end();
                }).on('data', (/** @type {any} */ data) => {
                    process.stdout.write(data);
                }).stderr.on('data', (/** @type {any} */ data) => {
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
