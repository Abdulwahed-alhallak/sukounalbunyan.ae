const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const localBuildDir = path.join(__dirname, 'public', 'build');
const remoteBuildDir = 'domains/sukounalbunyan.ae/public_html/backend/public/build';

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

async function uploadFile(sftp, localPath, remotePath) {
    return new Promise((resolve, reject) => {
        // ensure remote directory exists
        const remoteDir = remotePath.substring(0, remotePath.lastIndexOf('/'));
        sftp.mkdir(remoteDir, { mode: '0755' }, () => {
            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

async function run() {
    const conn = new Client();
    conn.on('ready', () => {
        console.log('Connected to server');
        conn.sftp((err, sftp) => {
            if (err) { console.error('SFTP error:', err); conn.end(); return; }

            const allFiles = getAllFiles(localBuildDir);
            console.log(`Found ${allFiles.length} files to upload...`);

            let index = 0;

            async function uploadNext() {
                if (index >= allFiles.length) {
                    console.log('\n✅ All files uploaded!');
                    // Now remove public/hot on remote
                    conn.exec('rm -f domains/sukounalbunyan.ae/public_html/backend/public/hot', (err, stream) => {
                        stream.on('close', () => {
                            console.log('✅ Removed public/hot from remote server');
                            conn.end();
                            process.exit(0);
                        }).on('data', (d) => process.stdout.write(d)).stderr.on('data', (d) => process.stderr.write(d));
                    });
                    return;
                }

                const localFile = allFiles[index];
                const relPath = path.relative(localBuildDir, localFile).replace(/\\/g, '/');
                const remoteFile = `${remoteBuildDir}/${relPath}`;

                process.stdout.write(`\r[${index + 1}/${allFiles.length}] ${relPath}`);
                try {
                    await uploadFile(sftp, localFile, remoteFile);
                } catch (e) {
                    // try making dirs recursively then retry
                }
                index++;
                uploadNext();
            }

            uploadNext();
        });
    }).on('error', (err) => {
        console.error('Connection error:', err);
    }).connect(config);
}

run();
