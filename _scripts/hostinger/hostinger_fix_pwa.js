import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Fixing PWA files...');
    
    const cmd = [
        'cd domains/noble.dion.sy/public_html',
        'cp public/manifest.json ./manifest.json',
        'cp public/sw.js ./sw.js',
        'echo "=== Manifest Test ==="',
        'curl -sk -o /dev/null -w "HTTP:%{http_code}" https://noble.dion.sy/manifest.json',
        'echo ""',
        'echo "=== SW Test ==="',
        'curl -sk -o /dev/null -w "HTTP:%{http_code}" https://noble.dion.sy/sw.js',
        'echo ""',
        'echo "=== Login Test ==="',
        'curl -sk -o /dev/null -w "HTTP:%{http_code}" https://noble.dion.sy/login',
    ].join(' && ');
    
    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`\nDone: ${code}`);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect(CONFIG.SSH);

