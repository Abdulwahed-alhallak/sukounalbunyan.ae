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
    console.log('SSH Connected!');
    conn.sftp((err, sftp) => {
        if (err) throw err;
        console.log('SFTP Started!');
        sftp.fastPut('build.zip', 'domains/sukounalbunyan.ae/public_html/backend/build.zip', (err) => {
            if (err) throw err;
            console.log('build.zip uploaded!');
            conn.exec('cd domains/sukounalbunyan.ae/public_html/backend/public && rm -rf build && unzip -q ../build.zip -d . && rm ../build.zip', (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log('Unzipped successfully! Code: ' + code);
                    conn.end();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });
        });
    });
}).connect(config);
