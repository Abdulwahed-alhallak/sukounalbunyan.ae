const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const config = {
    host: CONFIG.SSH.host,
    port: CONFIG.SSH.port,
    username: 'u256167180',
    password: '${CONFIG.DB.password}',
    readyTimeout: 60000
};

const localFile = path.resolve(__dirname, '../noble_production_ecosystem.tar.gz');
const remoteFile = 'domains/noble.dion.sy/public_html/noble_production_ecosystem.tar.gz';

conn.on('ready', () => {
    console.log('SSH Connected. Entering raw pipe upload mode...');
    
    const remoteCmd = `cat > "${remoteFile}"`;
    const localStream = fs.createReadStream(localFile);
    
    conn.exec(remoteCmd, (err, stream) => {
        if (err) {
            console.error('Exec Error:', err);
            process.exit(1);
        }

        localStream.pipe(stream);

        let uploaded = 0;
        const stats = fs.statSync(localFile);
        const total = stats.size;

        localStream.on('data', (chunk) => {
            uploaded += chunk.length;
            const percent = ((uploaded / total) * 100).toFixed(2);
            process.stdout.write(`\rPipe Progress: ${percent}% (${(uploaded / 1024 / 1024).toFixed(2)} MB / ${(total / 1024 / 1024).toFixed(2)} MB)`);
        });

        stream.on('close', (code) => {
            console.log(`\nPipe closed. Exit: ${code}`);
            if (code === 0) {
                executePostDeploy();
            } else {
                console.error('Upload failed via pipe.');
                process.exit(1);
            }
        });

        stream.on('error', (err) => {
            console.error('Stream Error:', err);
        });
    });
});

function executePostDeploy() {
    console.log('Starting remote extraction and configuration...');
    const deployCmd = [
        'cd domains/noble.dion.sy/public_html',
        'tar -xzf noble_production_ecosystem.tar.gz',
        'rm noble_production_ecosystem.tar.gz',
        '/opt/alt/php82/usr/bin/php artisan config:cache',
        '/opt/alt/php82/usr/bin/php artisan route:cache',
        '/opt/alt/php82/usr/bin/php artisan view:clear',
        '/opt/alt/php82/usr/bin/php artisan cache:clear',
        'echo "Deployment Finalized."'
    ].join(' && ');

    conn.exec(deployCmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`\n\nRemote commands finished. Exit: ${code}`);
            conn.end();
            process.exit(0);
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}

conn.on('error', (err) => {
    console.error('Connection Error:', err);
    process.exit(1);
});

conn.connect(config);

