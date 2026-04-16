const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

function uploadAndRun() {
    const conn = new Client();
    console.log('🔗 Connecting to production...');

    conn.on('ready', () => {
        console.log('📤 Uploading activate_all_modules.php...');
        conn.sftp((err, sftp) => {
            if (err) throw err;

            const localPath = path.join(__dirname, 'activate_all_modules.php');
            const remotePath = CONFIG.APP_DIR + '/scratch/activate_all_modules.php';

            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) throw err;
                console.log('✅ Upload complete.');

                console.log('🚀 Running full activation...');
                const command = `cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="include 'scratch/activate_all_modules.php';"`;

                conn.exec(command, (err, stream) => {
                    if (err) throw err;
                    let output = '';
                    stream.on('data', (data) => {
                        const str = data.toString();
                        output += str;
                        process.stdout.write(str);
                    });
                    stream.on('stderr', (data) => process.stderr.write(data.toString()));
                    stream.on('close', () => {
                        console.log('\n✅ Activation script finished.');
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
