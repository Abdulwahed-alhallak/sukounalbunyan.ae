const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    remotePath: 'domains/sukounalbunyan.ae/public_html/backend'
};

const filesToSync = [
    { local: 'database/seeders/DemoRentalDataSeeder.php', remote: 'database/seeders/DemoRentalDataSeeder.php' },
    { local: 'composer.json', remote: 'composer.json' },
];

// Function to recursively find files
function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const rentalDir = 'packages/noble/Rental';
if (fs.existsSync(rentalDir)) {
    const rentalFiles = getFiles(rentalDir);
    rentalFiles.forEach(file => {
        filesToSync.push({
            local: file,
            remote: file.replace(/\\/g, '/')
        });
    });
}

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Opening SFTP...');
    conn.sftp((err, sftp) => {
        if (err) throw err;

        let completed = 0;

        function uploadNext() {
            if (completed >= filesToSync.length) {
                console.log('All files uploaded. Running remote commands...');
                runRemoteCommands();
                return;
            }

            const file = filesToSync[completed];
            const remoteFilePath = `${config.remotePath}/${file.remote}`;
            const remoteDir = path.dirname(remoteFilePath).replace(/\\/g, '/');

            // Ensure directory exists
            conn.exec(`mkdir -p ${remoteDir}`, (err, stream) => {
                sftp.fastPut(file.local, remoteFilePath, (err) => {
                    if (err) {
                        console.error(`Error uploading ${file.local}:`, err);
                    } else {
                        console.log(`Uploaded: ${file.local}`);
                    }
                    completed++;
                    uploadNext();
                });
            });
        }

        uploadNext();
    });
}).connect(config);

function runRemoteCommands() {
    const commands = [
        `cd ${config.remotePath} && /opt/alt/php82/usr/bin/php /usr/local/bin/composer dump-autoload`,
        `cd ${config.remotePath} && /opt/alt/php82/usr/bin/php artisan migrate --force`,
        `cd ${config.remotePath} && /opt/alt/php82/usr/bin/php artisan db:seed --class=DemoRentalDataSeeder --force`,
        `cd ${config.remotePath} && /opt/alt/php82/usr/bin/php artisan cache:clear`,
        `cd ${config.remotePath} && /opt/alt/php82/usr/bin/php artisan route:clear`
    ];

    function execute(idx) {
        if (idx >= commands.length) {
            console.log('All remote commands finished.');
            conn.end();
            return;
        }

        console.log(`Executing: ${commands[idx]}`);
        conn.exec(commands[idx], (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log(`Finished with code: ${code}`);
                execute(idx + 1);
            }).on('data', (data) => {
                process.stdout.write(data);
            }).stderr.on('data', (data) => {
                process.stderr.write(data);
            });
        });
    }

    execute(0);
}
