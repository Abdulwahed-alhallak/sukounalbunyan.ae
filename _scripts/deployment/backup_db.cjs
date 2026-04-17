const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('./secureConfig.cjs');

console.log('🚀 Connecting to Hostinger to execute production DB backup...');

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connected. Running mysqldump...');
    
    // Exact schema dump
    const dumpCmd = `mysqldump -u \${CONFIG.DB.USER} -p'\${CONFIG.DB.PASS}' \${CONFIG.DB.NAME} | gzip > ~/database_backup.sql.gz`;

    conn.exec(dumpCmd, (err, stream) => {
        if (err) throw err;
        
        stream.on('close', (code, signal) => {
            console.log('✅ Database dump created. Initiating SFTP download...');
            
            conn.sftp((err, sftp) => {
                if (err) throw err;
                
                const remoteFile = `./database_backup.sql.gz`;
                const localFile = path.resolve(__dirname, '../../../noble.dion.sy_PlatinumMaster_DB.sql.gz');
                
                sftp.fastGet(remoteFile, localFile, (err) => {
                    if (err) throw err;
                    
                    console.log(`✅ Download complete! Saved to: ${localFile}`);
                    
                    console.log('🧹 Cleaning up remote server...');
                    sftp.unlink(remoteFile, (err) => {
                        conn.end();
                    });
                });
            });
            
        }).on('data', (data) => {
            console.log(data.toString());
        }).stderr.on('data', (data) => {
            // standard mysqldump warnings
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Connection Error:', err);
}).connect(CONFIG.SSH);
