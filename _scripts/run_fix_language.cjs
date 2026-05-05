const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const SSH_CONFIG = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};
const REMOTE_BASE = 'domains/sukounalbunyan.ae/public_html/backend';

async function run() {
    const conn = new Client();
    
    await new Promise((resolve, reject) => {
        conn.on('ready', resolve).on('error', reject)
            .connect(SSH_CONFIG);
    });

    console.log('SSH Connected.');

    // 1. Upload the fix script
    const sftp = await new Promise((resolve, reject) => {
        conn.sftp((err, sftp) => err ? reject(err) : resolve(sftp));
    });

    const localScript = path.join(__dirname, '..', '_scripts', 'fix_language.php');
    const remoteScript = `${REMOTE_BASE}/fix_language.php`;

    await new Promise((resolve, reject) => {
        sftp.fastPut(localScript, remoteScript, err => err ? reject(err) : resolve());
    });
    console.log('Uploaded fix_language.php');

    // 2. Execute it
    const commands = [
        `cd ${REMOTE_BASE} && /opt/alt/php82/usr/bin/php fix_language.php`,
        `cd ${REMOTE_BASE} && rm -f fix_language.php`,
        `cd ${REMOTE_BASE} && /opt/alt/php82/usr/bin/php artisan cache:clear`,
        `cd ${REMOTE_BASE} && /opt/alt/php82/usr/bin/php artisan config:clear`,
    ];

    for (const cmd of commands) {
        console.log(`\nExecuting: ${cmd}`);
        const output = await new Promise((resolve, reject) => {
            conn.exec(cmd, (err, stream) => {
                if (err) return reject(err);
                let out = '';
                stream.on('close', () => resolve(out))
                    .on('data', d => { out += d; process.stdout.write(d); })
                    .stderr.on('data', d => { out += d; process.stderr.write(d); });
            });
        });
    }

    conn.end();
    console.log('\nAll done!');
}

run().catch(console.error);
