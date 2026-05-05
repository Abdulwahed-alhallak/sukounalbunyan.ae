const fs = require('fs');
const { Client } = require('ssh2');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const conn = new Client();
conn.on('ready', () => {
    console.log('Connected. Starting SFTP...');
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        console.log('Uploading public_build.zip...');
        sftp.fastPut('_scripts/deployment/public_build.zip', 'domains/sukounalbunyan.ae/public_html/backend/public_build.zip', (err) => {
            if (err) throw err;
            console.log('Upload complete. Unzipping...');
            conn.exec('cd domains/sukounalbunyan.ae/public_html/backend && unzip -o public_build.zip -d public && rm public_build.zip', (err, stream) => {
                if (err) throw err;
                stream.on('close', (code) => {
                    console.log('Unzip complete. Exit code:', code);
                    conn.end();
                }).on('data', (d) => process.stdout.write(d));
            });
        });
    });
}).connect(config);
