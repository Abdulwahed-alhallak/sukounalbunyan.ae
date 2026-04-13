const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 60000
};

const filesToUpload = [
    'resources.tar.gz',
    'build.tar.gz',
    'packages.tar.gz'
];

conn.on('ready', () => {
    console.log('SSH Connected. Starting phased upload...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;

        let index = 0;

        function uploadNext() {
            if (index >= filesToUpload.length) {
                console.log('\nAll phases uploaded. Extracting on server...');
                extractAll();
                return;
            }

            const file = filesToUpload[index];
            const localPath = path.resolve(__dirname, '../', file);
            const remotePath = `domains/noble.dion.sy/public_html/${file}`;

            console.log(`Uploading ${file} (${(fs.statSync(localPath).size / 1024 / 1024).toFixed(2)} MB)...`);
            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) {
                    console.error(`Error uploading ${file}:`, err);
                    // We don't exit, we try next? No, better exit.
                    process.exit(1);
                }
                index++;
                uploadNext();
            });
        }

        uploadNext();
    });
});

function extractAll() {
    const remoteDir = 'domains/noble.dion.sy/public_html';
    
    const cmds = filesToUpload.map(f => `tar -xzf ${f} && rm ${f}`);
    const postCmds = [
        '/opt/alt/php82/usr/bin/php artisan config:cache',
        '/opt/alt/php82/usr/bin/php artisan route:cache',
        '/opt/alt/php82/usr/bin/php artisan view:clear',
        '/opt/alt/php82/usr/bin/php artisan cache:clear'
    ];
    
    const fullCmd = `cd ${remoteDir} && ${cmds.join(' && ')} && ${postCmds.join(' && ')} && echo "PHASED_DEPLOYMENT_SUCCESS"`;

    console.log('Running remote extraction...');
    conn.exec(fullCmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`\nDeployment Finished. Exit: ${code}`);
            conn.end();
            process.exit(0);
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}

conn.connect(config);
