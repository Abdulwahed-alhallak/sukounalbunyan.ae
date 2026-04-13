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

const root = path.resolve(__dirname, '../');
const files = [
    { local: 'resources/css/rtl.css', remote: 'resources/css/rtl.css' },
    { local: 'resources/js/app.tsx', remote: 'resources/js/app.tsx' },
    { local: 'resources/js/Layouts/authenticated-layout.tsx', remote: 'resources/js/layouts/authenticated-layout.tsx' },
    { local: 'resources/lang/ar.json', remote: 'resources/lang/ar.json' }
];

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connected. Syncing critical files...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        let i = 0;
        function next() {
            if (i >= files.length) {
                console.log('Sync complete.');
                conn.end();
                process.exit(0);
                return;
            }
            const f = files[i];
            console.log(`Syncing ${f.local}...`);
            const remotePath = '/home/u256167180/domains/noble.dion.sy/public_html/' + f.remote;
            sftp.fastPut(path.join(root, f.local), remotePath, (err) => {
                if (err) console.error(`Error: ${f.local}`, err);
                i++;
                next();
            });
        }
        next();
    });
}).on('error', (e) => {
    console.error('Conn Error', e);
}).connect(config);
