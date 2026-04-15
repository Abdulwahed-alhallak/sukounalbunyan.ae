import { Client } from 'ssh2';
import fs from 'fs';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Initializing native SFTP pipeline...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const localFile = './noble_production_build.tar.gz';
        const remoteFile = 'domains/noble.dion.sy/public_html/noble_production_build.tar.gz';
        
        console.log(`Starting massive upload: ${localFile} -> ${remoteFile}`);
        
        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) throw err;
            console.log('Upload complete. Triggering fast extraction...');
            
            conn.exec('cd domains/noble.dion.sy/public_html && tar -xzf noble_production_build.tar.gz && rm noble_production_build.tar.gz', (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log(`React VITE UI Updated Successfully with code ${code}.`);
                    conn.end();
                }).on('data', (data) => {
                    process.stdout.write(data);
                }).stderr.on('data', (data) => {
                    process.stderr.write(data);
                });
            });
        });
    });
}).connect(CONFIG.SSH);

