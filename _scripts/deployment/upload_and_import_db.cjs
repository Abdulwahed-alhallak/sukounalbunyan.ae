const { Client } = require('ssh2');
const fs = require('fs');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');
const SSH_CONFIG = CONFIG.SSH;

const LOCAL_DUMP = 'C:\\\\Users\\\\DION-SERVER\\\\Desktop\\\\noble.dion.sy\\\\docs\\\\Archive\\\\nobel_db_backup_v1.0.sql';
const REMOTE_DUMP = '/home/u256167180/nobel_db_backup_v1.0.sql';
const DB_USER = CONFIG.DATABASE.username;
const DB_PASS = CONFIG.DATABASE.password;
const DB_NAME = CONFIG.DATABASE.name;

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ SSH Connected');
    
    // Upload SQL dump
    console.log('⬆️ Uploading database dump...');
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        sftp.fastPut(LOCAL_DUMP, REMOTE_DUMP, (err) => {
            if (err) {
                console.error('❌ Upload failed:', err);
                conn.end();
                return;
            }
            console.log('✅ Upload complete');
            
            // Drop existing tables and import the dump
            console.log('🔄 Importing database replacing old data...');
            const importCmd = `mysql -u ${DB_USER} -p'${DB_PASS}' -h 127.0.0.1 ${DB_NAME} < ${REMOTE_DUMP}`;
            const dropCmd = `mysql -u ${DB_USER} -p'${DB_PASS}' -h 127.0.0.1 -e "DROP DATABASE ${DB_NAME}; CREATE DATABASE ${DB_NAME};"`;
            
            conn.exec(`${dropCmd} && ${importCmd}`, (err, stream) => {
                if (err) throw err;
                stream.on('data', (data) => console.log(data.toString()));
                stream.stderr.on('data', (data) => console.error(data.toString()));
                stream.on('close', (code) => {
                    console.log(`✅ Database import finished with code ${code}`);
                    
                    // Verify the import
                    const verifyCmd = `mysql -u ${DB_USER} -p'${DB_PASS}' -h 127.0.0.1 ${DB_NAME} -e "SELECT count(*) FROM users;"`;
                    conn.exec(verifyCmd, (err, stream2) => {
                        stream2.on('data', (data) => console.log('Users count in prod DB:\\n' + data.toString()));
                        stream2.on('close', () => conn.end());
                    });
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(SSH_CONFIG);
