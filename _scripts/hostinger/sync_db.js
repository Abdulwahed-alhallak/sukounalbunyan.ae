import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();

const config = {
    host: CONFIG.SSH.host,
    port: CONFIG.SSH.port,
    username: CONFIG.SSH.username,
    password: CONFIG.SSH.password
};

const REMOTE_FILE = 'domains/noble.dion.sy/noble_final_sync.sql';
const LOCAL_FILE = './noble_final_sync.sql';

// Database credentials from CONFIG (loaded from .env.production)
const DB_HOST = CONFIG.DB.host;
const DB_USER = CONFIG.DB.username;
const DB_PASS = CONFIG.DB.password;
const DB_NAME = CONFIG.DB.database;

conn.on('ready', () => {
    console.log('SSH Connected for Database Sync...');

    conn.sftp((err, sftp) => {
        if (err) throw err;

        console.log(`Uploading ${LOCAL_FILE} to ${REMOTE_FILE}...`);
        
        sftp.fastPut(LOCAL_FILE, REMOTE_FILE, (err) => {
            if (err) throw err;
            console.log('Upload complete. Starting database import...');

            // Use CONFIG database credentials instead of hardcoded values
            const importCommand = `mysql -h ${DB_HOST} -u ${DB_USER} -p'${DB_PASS}' ${DB_NAME} < ${REMOTE_FILE} && rm ${REMOTE_FILE}`;
            
            conn.exec(importCommand, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log(`Import finished with code ${code}`);
                    if (code === 0) {
                        console.log('Database synced successfully!');
                    } else {
                        console.error('Database sync failed.');
                    }
                    conn.end();
                }).on('data', (data) => {
                    process.stdout.write(data);
                }).stderr.on('data', (data) => {
                    process.stderr.write(data);
                });
            });
        });
    });
}).connect(config);

