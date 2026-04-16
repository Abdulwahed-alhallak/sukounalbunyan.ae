const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

function uploadAndRun() {
    const conn = new Client();
    console.log('🔗 Connecting to production...');

    conn.on('ready', () => {
        console.log('📤 Uploading fixed reconstruct_metadata.php via SFTP...');
        conn.sftp((err, sftp) => {
            if (err) throw err;

            const localPath = path.join(__dirname, 'reconstruct_metadata.php');
            const remotePath = CONFIG.APP_DIR + '/scratch/reconstruct_metadata.php';

            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) throw err;
                console.log('✅ Upload complete.');

                // Now run it
                console.log('🚀 Running normalization...');
                const phpPath = CONFIG.PHP;
                const appDir = CONFIG.APP_DIR;
                const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="include 'scratch/reconstruct_metadata.php';"`;

                conn.exec(command, (err, stream) => {
                    if (err) throw err;
                    stream.on('data', (data) => console.log(data.toString()));
                    stream.on('stderr', (data) => console.error('STDERR: ' + data.toString()));
                    stream.on('close', () => {
                        console.log('✅ Done.');
                        conn.end();
                    });
                });
            });
        });
    })
    .on('error', (err) => console.error('❌ SSH Error:', err.message))
    .connect({ ...CONFIG.SSH, readyTimeout: 90000 });
}

uploadAndRun();
