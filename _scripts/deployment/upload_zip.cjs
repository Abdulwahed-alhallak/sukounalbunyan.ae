const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const localZip = path.join(__dirname, 'public_build.zip');
const remoteZip = 'domains/sukounalbunyan.ae/public_html/backend/public/public_build.zip';
const remotePublic = 'domains/sukounalbunyan.ae/public_html/backend/public';

const conn = new Client();
conn.on('ready', () => {
    console.log('Connected. Starting upload of public_build.zip...');
    conn.sftp((err, sftp) => {
        if (err) { console.error('SFTP error:', err); conn.end(); return; }

        const fileSize = fs.statSync(localZip).size;
        let uploaded = 0;
        const startTime = Date.now();

        const readStream = fs.createReadStream(localZip);
        const writeStream = sftp.createWriteStream(remoteZip);

        writeStream.on('close', () => {
            console.log('\n✅ ZIP uploaded! Now extracting...');
            conn.exec(`cd ${remotePublic} && unzip -o public_build.zip && rm -f public_build.zip && rm -f hot && echo "Done"`, (err, stream) => {
                stream.on('close', (code) => {
                    console.log(code === 0 ? '✅ Extraction complete! Site is live.' : '❌ Extraction failed');
                    conn.end();
                    process.exit(code);
                }).on('data', (d) => process.stdout.write(d)).stderr.on('data', (d) => process.stderr.write(d));
            });
        });

        writeStream.on('error', (err) => { console.error('Write error:', err); });

        readStream.on('data', (chunk) => {
            uploaded += chunk.length;
            const pct = ((uploaded / fileSize) * 100).toFixed(1);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
            process.stdout.write(`\r  Progress: ${pct}% (${(uploaded / 1024 / 1024).toFixed(1)} MB / ${(fileSize / 1024 / 1024).toFixed(1)} MB) [${elapsed}s]`);
        });

        readStream.pipe(writeStream);
    });
}).on('error', (err) => {
    console.error('Connection error:', err.message);
}).connect(config);
