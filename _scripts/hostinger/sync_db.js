import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const REMOTE_FILE = 'domains/noble.dion.sy/noble_final_sync.sql';
const LOCAL_FILE = './noble_final_sync.sql';

conn.on('ready', () => {
    console.log('SSH Connected for Database Sync...');

    conn.sftp((err, sftp) => {
        if (err) throw err;

        console.log(`Uploading ${LOCAL_FILE} to ${REMOTE_FILE}...`);
        
        sftp.fastPut(LOCAL_FILE, REMOTE_FILE, (err) => {
            if (err) throw err;
            console.log('Upload complete. Starting database import...');

            const importCommand = `mysql -h srv1142.hstgr.io -u u256167180_noble -p'4_m_XMkgux@.AgC' u256167180_noble < ${REMOTE_FILE} && rm ${REMOTE_FILE}`;
            
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
