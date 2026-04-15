const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: CONFIG.SSH.host,
    port: CONFIG.SSH.port,
    username: 'u256167180',
    password: '${CONFIG.DB.password}',
    readyTimeout: 60000
};

const localFile = path.resolve(__dirname, '../resources.tar.gz');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connected. Uploading via Base64 pipe...');
    const b64 = fs.readFileSync(localFile).toString('base64');
    
    conn.exec('cat > resources.tar.gz.b64', (err, stream) => {
        if (err) throw err;
        
        stream.write(b64);
        stream.end();
        
        stream.on('close', (code) => {
            console.log(`\nBase64 File written. Exit: ${code}. Decoding...`);
            conn.exec('base64 -d resources.tar.gz.b64 > resources.tar.gz && tar -xzf resources.tar.gz && rm resources.tar.gz resources.tar.gz.b64', (err, stream2) => {
                stream2.on('close', () => {
                    console.log('Extraction complete.');
                    conn.end();
                    process.exit(0);
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('Final Error:', err);
    process.exit(1);
}).connect(config);

