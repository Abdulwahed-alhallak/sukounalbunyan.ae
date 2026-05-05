const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = {
    host: process.env.PRODUCTION_HOST,
    port: parseInt(process.env.PRODUCTION_PORT, 10),
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD
};

const appDir = process.env.PRODUCTION_APP_DIR;
const localDir = path.join(__dirname, '..', '..');

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connected. Starting SFTP sync...');
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const filesToSync = [
            { local: 'public/sw-v18.js', remote: 'public/sw-v18.js' },
            { local: 'public/manifest.json', remote: 'public/manifest.json' },
            { local: 'public/sw-v18.js', remote: 'sw-v18.js' }, // Also root as fallback
            { local: 'public/manifest.json', remote: 'manifest.json' }
        ];

        let completed = 0;
        filesToSync.forEach(file => {
            const localPath = path.join(localDir, file.local);
            const remotePath = `${appDir}/${file.remote}`;
            
            console.log(`Uploading ${file.local} to ${remotePath}...`);
            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) console.error(`❌ Error uploading ${file.local}:`, err.message);
                else console.log(`   ✅ Uploaded ${file.local}`);
                
                completed++;
                if (completed === filesToSync.length) {
                    console.log('🚀 SFTP Sync Complete.');
                    conn.exec(`cd ${appDir} && /opt/alt/php82/usr/bin/php artisan optimize:clear`, (err, stream) => {
                        stream.on('close', () => {
                            console.log('   ✅ Caches cleared.');
                            conn.end();
                        });
                    });
                }
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
