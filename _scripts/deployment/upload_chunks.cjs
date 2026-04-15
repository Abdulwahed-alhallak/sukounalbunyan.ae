const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');
const config = {
    ...CONFIG.SSH,
    readyTimeout: 60000,
    keepaliveInterval: 10000,
    keepaliveCountMax: 10
};

const chunkFiles = fs.readdirSync(path.resolve(__dirname, '../'))
    .filter(f => f.startsWith('p_') && f.endsWith('.chunk'))
    .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

async function startUpload() {
    console.log(`🚀 Starting Robust PIPE Upload (${chunkFiles.length} parts)...`);

    for (const file of chunkFiles) {
        const success = await uploadWithRetry(file);
        if (!success) {
            console.error(`\n❌ Failed to upload ${file} after retries.`);
            process.exit(1);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ All chunks uploaded. Reassembling on server...');
    const reassembled = await reassembleOnServer();
    if (reassembled) {
        console.log('\n✨ Deployment Complete!');
        process.exit(0);
    } else {
        console.error('\n❌ Reassembly Failed.');
        process.exit(1);
    }
}

function uploadWithRetry(file, retries = 5) {
    return new Promise((resolve) => {
        const attempt = (remaining) => {
            const conn = new Client();
            conn.on('ready', () => {
                const localPath = path.resolve(__dirname, '../', file);
                const remotePath = `domains/noble.dion.sy/public_html/${file}`;
                const remoteCmd = `cat > "${remotePath}"`;

                conn.exec(remoteCmd, (err, stream) => {
                    if (err) {
                        conn.end();
                        if (remaining > 0) setTimeout(() => attempt(remaining - 1), 2000);
                        else resolve(false);
                        return;
                    }

                    const localStream = fs.createReadStream(localPath);
                    localStream.pipe(stream);

                    stream.on('close', (code) => {
                        conn.end();
                        if (code === 0) {
                            process.stdout.write(`\r📦 Uploaded ${file} successfully.`);
                            resolve(true);
                        } else {
                            if (remaining > 0) setTimeout(() => attempt(remaining - 1), 2000);
                            else resolve(false);
                        }
                    }).on('error', (err) => {
                        conn.end();
                        if (remaining > 0) setTimeout(() => attempt(remaining - 1), 2000);
                        else resolve(false);
                    });
                });
            }).on('error', (err) => {
                if (remaining > 0) setTimeout(() => attempt(remaining - 1), 3000);
                else resolve(false);
            }).connect(config);
        };
        attempt(retries);
    });
}

function reassembleOnServer() {
    return new Promise((resolve) => {
        const conn = new Client();
        conn.on('ready', () => {
            const remoteDir = 'domains/noble.dion.sy/public_html';
            const finalFile = 'noble_production_ecosystem.tar.gz';
            
            const catCmd = `cd ${remoteDir} && cat p_*.chunk > ${finalFile} && rm p_*.chunk`;
            const deployCmd = [
                `cd ${remoteDir}`,
                `tar -xzf ${finalFile}`,
                `rm ${finalFile}`,
                '/opt/alt/php82/usr/bin/php artisan config:cache',
                '/opt/alt/php82/usr/bin/php artisan route:cache',
                '/opt/alt/php82/usr/bin/php artisan view:clear',
                '/opt/alt/php82/usr/bin/php artisan cache:clear',
                'echo "DEPLOYMENT_SUCCESS_FINAL"'
            ].join(' && ');

            conn.exec(`${catCmd} && ${deployCmd}`, (err, stream) => {
                if (err) {
                    conn.end();
                    resolve(false);
                    return;
                }
                stream.on('close', () => {
                    conn.end();
                    resolve(true);
                }).on('data', (data) => process.stdout.write(data))
                  .stderr.on('data', (data) => process.stderr.write(data));
            });
        }).on('error', (err) => {
            console.error('Reassembly Connection Error:', err.message);
            resolve(false);
        }).connect(config);
    });
}

startUpload();
