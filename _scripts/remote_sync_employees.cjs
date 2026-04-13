const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 60000
};

// Project Root is C:\Users\DION-SERVER\Desktop\DionONE\main-file
const projectRoot = 'c:/Users/DION-SERVER/Desktop/DionONE/main-file';
const files = [
    { local: '../nobel Employee S Data.csv', remote: 'nobel_Employee_S_Data.csv' },
    { local: '_scripts/execute_import_v2.php', remote: 'execute_import_v2.php' }
];

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connected. Uploading import files...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        let i = 0;
        function next() {
            if (i >= files.length) {
                console.log('Upload complete.');
                executeRemoteImport();
                return;
            }
            const f = files[i];
            const localFullPath = path.resolve(projectRoot, f.local);
            const remotePath = '/home/u256167180/domains/noble.dion.sy/public_html/' + f.remote;
            
            console.log(`Uploading ${localFullPath} -> ${remotePath}...`);
            if (!fs.existsSync(localFullPath)) {
                console.error(`Local file not found: ${localFullPath}`);
                process.exit(1);
            }

            sftp.fastPut(localFullPath, remotePath, (err) => {
                if (err) {
                    console.error(`Error uploading ${f.local}:`, err);
                    process.exit(1);
                }
                i++;
                next();
            });
        }
        next();
    });
});

function executeRemoteImport() {
    console.log('Executing remote import...');
    // We already checked public_html context. bootstrap/app.php is in public_html/bootstrap/app.php? 
    // Wait, on local it is main-file/bootstrap/app.php. 
    // On Hostinger, usually the app root IS public_html or the parent of it.
    // Based on previous ls, domains/noble.dion.sy/public_html/bootstrap exists.
    const cmd = 'cd domains/noble.dion.sy/public_html && /opt/alt/php82/usr/bin/php execute_import_v2.php';
    
    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d));
        stream.stderr.on('data', (d) => process.stderr.write(d));
        stream.on('close', (code) => {
            console.log(`\nImport Process Finished. Exit: ${code}`);
            conn.end();
            process.exit(0);
        });
    });
}

conn.on('error', (e) => console.error('Conn Error', e)).connect(config);
