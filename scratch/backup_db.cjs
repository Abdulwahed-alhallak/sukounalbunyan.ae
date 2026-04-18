const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    console.log('📦 Creating database backup on production server...');
    const remoteBackupPath = `${CONFIG.APP_DIR}/database_gold_master_v1.1.sql`;
    
    // Explicitly using Hostinger's standard DB backup command structure
    const dumpCmd = `mysqldump -u ${CONFIG.DATABASE.username} -p"${CONFIG.DATABASE.password}" ${CONFIG.DATABASE.name} > ${remoteBackupPath}`;
    
    conn.exec(dumpCmd, (/** @type {any} */ err, /** @type {any} */ stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('✅ Backup created on production server!');
            console.log('⬇️ Downloading backup locally...');
            
            conn.sftp((/** @type {any} */ err, /** @type {any} */ sftp) => {
                if (err) throw err;
                const localBackupDir = path.join(__dirname, '../../docs/Archive/backups');
                if (!fs.existsSync(localBackupDir)) {
                    fs.mkdirSync(localBackupDir, { recursive: true });
                }
                const localBackupPath = path.join(localBackupDir, 'database_gold_master_v1.1.sql');
                
                sftp.fastGet(remoteBackupPath, localBackupPath, (/** @type {any} */ err) => {
                    if (err) {
                        console.error('❌ Failed to download:', err);
                    } else {
                        console.log(`🎉 Backup downloaded successfully to: docs/Archive/backups/database_gold_master_v1.1.sql`);
                        // Optional cleanup on server
                        conn.exec(`rm ${remoteBackupPath}`, () => conn.end());
                    }
                });
            });
        });
    });
}).connect(CONFIG.SSH);
