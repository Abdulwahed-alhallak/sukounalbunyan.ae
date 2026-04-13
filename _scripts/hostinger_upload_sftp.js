import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Initializing native SFTP pipeline...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const localFile = 'public_build.tar.gz';
        const remoteFile = 'domains/noble.dion.sy/public_html/public_build.tar.gz';
        
        console.log(`Starting massive upload: ${localFile} -> ${remoteFile}`);
        
        sftp.fastPut(localFile, remoteFile, (err) => {
            if (err) throw err;
            console.log('Upload complete. Triggering fast extraction...');
            
            conn.exec('cd domains/noble.dion.sy/public_html && tar -xzf public_build.tar.gz && rm public_build.tar.gz', (err, stream) => {
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
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
