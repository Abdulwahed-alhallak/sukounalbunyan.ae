const { Client } = require('ssh2');
const CONFIG = require('./_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connection Successful!');
    conn.exec('ls -la', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            conn.end();
            process.exit(0);
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
    process.exit(1);
}).connect(CONFIG.SSH);
