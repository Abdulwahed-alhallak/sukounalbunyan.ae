const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');

const config = {
    ...CONFIG.SSH,
    readyTimeout: 300000,
    keepaliveInterval: 5000,
    keepaliveCountMax: 50
};

const root = path.resolve(__dirname, '../');
const files = [
    { local: 'resources/js/components/nav-main.tsx', remote: 'resources/js/components/nav-main.tsx' }
];

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connected. Syncing critical files...');
    
    const f = files[0];
    const localPath = path.join(root, f.local);
    const content = fs.readFileSync(localPath, 'utf8');
    const b64 = Buffer.from(content).toString('base64');
    const remotePath = '/home/u256167180/domains/noble.dion.sy/public_html/' + f.remote;
    
    console.log(`Deploying ${f.local} via Base64 payload...`);
    
    const cmd = `echo "${b64}" | base64 -d > "${remotePath}"`;
    
    conn.exec(cmd, (err, stream) => {
        if (err) {
            console.error('Exec Error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${f.local} successfully deployed!`);
            } else {
                console.error(`❌ Failed to deploy ${f.local} (Exit Code: ${code})`);
            }
            conn.end();
            process.exit(0);
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (e) => {
    console.error('Conn Error', e);
}).connect(config);
