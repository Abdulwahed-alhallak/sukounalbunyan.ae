const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const SYNC_ROOT = 'domains/noble.dion.sy/public_html';

const tasks = [
    { local: './noble_final_sync.sql', remote: `${SYNC_ROOT}/noble_final_sync.sql`, type: 'file' },
    { local: './build.tar.gz', remote: `${SYNC_ROOT}/build.tar.gz`, type: 'file' },
    { local: './resources.tar.gz', remote: `${SYNC_ROOT}/resources.tar.gz`, type: 'file' },
    { local: './packages.tar.gz', remote: `${SYNC_ROOT}/packages.tar.gz`, type: 'file' },
    { local: './package.json', remote: `${SYNC_ROOT}/package.json`, type: 'file' },
    { local: './composer.json', remote: `${SYNC_ROOT}/composer.json`, type: 'file' },
    { local: './vite.config.js', remote: `${SYNC_ROOT}/vite.config.js`, type: 'file' },
    { local: './tailwind.config.js', remote: `${SYNC_ROOT}/tailwind.config.js`, type: 'file' }
];

async function uploadFile(sftp, localPath, remotePath) {
    return new Promise((resolve, reject) => {
        console.log(`Uploading ${localPath} -> ${remotePath}`);
        sftp.fastPut(localPath, remotePath, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

conn.on('ready', () => {
    console.log('SSH Connected. Starting Full Sync...');

    conn.sftp(async (err, sftp) => {
        if (err) throw err;

        try {
            for (const task of tasks) {
                await uploadFile(sftp, task.local, task.remote);
            }

            console.log('Files uploaded. Starting Extraction and Database Import...');
            const finalCommands = `
                cd ${SYNC_ROOT} &&
                tar -xzf build.tar.gz && rm build.tar.gz &&
                tar -xzf resources.tar.gz && rm resources.tar.gz &&
                tar -xzf packages.tar.gz && rm packages.tar.gz &&
                /opt/alt/php82/usr/bin/php _scripts/hostinger/import_db.php &&
                /opt/alt/php82/usr/bin/php artisan migrate --force &&
                /opt/alt/php82/usr/bin/php artisan optimize:clear &&
                /opt/alt/php82/usr/bin/php artisan storage:link
            `;
            
            conn.exec(finalCommands, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code) => {
                    console.log(`Processes finished with code ${code}`);
                    if (code === 0) {
                        console.log('Full System Sync Completed successfully!');
                    } else {
                        console.error('Sync process failed at some step.');
                    }
                    conn.end();
                }).on('data', data => process.stdout.write(data))
                  .stderr.on('data', data => process.stderr.write(data));
            });
        } catch (error) {
            console.error('Error during sync:', error);
            conn.end();
        }
    });
}).connect(config);
