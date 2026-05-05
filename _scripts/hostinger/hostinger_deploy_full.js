import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Starting full production deployment...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        // Step 1: Upload the build archive
        const localFile = './noble_production_ecosystem.tar.gz';
        const remoteFile = 'domains/noble.dion.sy/public_html/noble_production_ecosystem.tar.gz';
        
        const fileSize = fs.statSync(localFile).size;
        console.log(`Uploading ${(fileSize / 1024 / 1024).toFixed(2)} MB...`);
        
        sftp.fastPut(localFile, remoteFile, { concurrency: 1, chunkSize: 32768 }, (err) => {
            if (err) throw err;
            console.log('Upload complete. Extracting and configuring...');
            
            const deployCmd = [
                'cd domains/noble.dion.sy/public_html',
                // Extract new build assets and translations
                'tar -xzf noble_production_ecosystem.tar.gz',
                'rm noble_production_ecosystem.tar.gz',
                // Clear all caches
                '/opt/alt/php82/usr/bin/php artisan config:cache',
                '/opt/alt/php82/usr/bin/php artisan route:cache',
                '/opt/alt/php82/usr/bin/php artisan view:clear',
                '/opt/alt/php82/usr/bin/php artisan cache:clear',
                // Verify
                'echo "=== Build Manifest ==="',
                'ls -la public/build/manifest.json',
                'echo "=== Arabic Translations ==="',
                'head -c 200 resources/lang/ar.json',
                'echo ""',
                'echo "=== Site HTTP Status ==="',
                'curl -sk -o /dev/null -w "%{http_code}" https://sukounalbunyan.ae/backend/login',
            ].join(' && ');
            
            conn.exec(deployCmd, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code) => {
                    console.log(`\n\nFull Deployment Complete. Exit: ${code}`);
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
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 60000
});
