const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
const localFile = path.resolve('docs/Archive/nobel_db_backup_v1.0.sql');
const remoteFile = CONFIG.APP_DIR + '/nobel_gold_master.sql';

async function importGoldMaster() {
    conn.on('ready', () => {
        console.log('✅ SSH Connected.');

        conn.sftp((err, sftp) => {
            if (err) throw err;

            console.log('📦 Uploading Gold Master SQL...');
            const readStream = fs.createReadStream(localFile);
            const writeStream = sftp.createWriteStream(remoteFile);

            writeStream.on('close', () => {
                console.log('✅ Uploaded.');
                
                // Get DB credentials from remote .env (or we can try to guess based on shared patterns)
                // Better: Run a PHP script to get them or just run mysql < file
                const command = `cd ${CONFIG.APP_DIR} && grep -E "DB_HOST|DB_DATABASE|DB_USERNAME|DB_PASSWORD" .env`;
                
                conn.exec(command, (err, stream) => {
                    if (err) throw err;
                    let envData = '';
                    stream.on('data', (data) => envData += data.toString());
                    stream.on('close', () => {
                        const envVars = {};
                        envData.split('\n').forEach(line => {
                            const [k, v] = line.split('=');
                            if (k && v) envVars[k.trim()] = v.trim();
                        });

                        console.log('🔥 Importing into MySQL...');
                        // Note: Using --force to bypass errors if they occur
                        const importCmd = `mysql -h ${envVars.DB_HOST} -u ${envVars.DB_USERNAME} -p"${envVars.DB_PASSWORD}" ${envVars.DB_DATABASE} < ${remoteFile}`;
                        
                        conn.exec(importCmd, (err, stream) => {
                            if (err) throw err;
                            stream.on('close', (code) => {
                                console.log(`🏁 Import finished with code ${code}.`);
                                
                                // Re-apply access recovery
                                console.log('🛡️ Re-applying Access Recovery...');
                                const fixCmd = `cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="\\$u = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first(); if(\\$u) { \\$u->update(['password' => \\Hash::make('Nn@!23456'), 'status' => 'active', 'is_active' => 1]); echo 'ADMIN_FIXED'; } else { echo 'ADMIN_NOT_FOUND'; }"`;
                                
                                conn.exec(fixCmd, (err, stream) => {
                                    if (err) throw err;
                                    stream.on('data', (d) => console.log(d.toString()));
                                    stream.on('close', () => {
                                        console.log('🧹 Cleaning up...');
                                        sftp.unlink(remoteFile, () => {
                                            conn.end();
                                            console.log('✨ All Done.');
                                        });
                                    });
                                });
                            }).on('data', (d) => console.log(d.toString()))
                              .stderr.on('data', (d) => console.error(d.toString()));
                        });
                    });
                });
            });

            readStream.pipe(writeStream);
        });
    }).connect(CONFIG.SSH);
}

importGoldMaster();
