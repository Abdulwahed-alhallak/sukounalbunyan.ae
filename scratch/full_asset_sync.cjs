const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

function fullAssetSync() {
    const conn = new Client();
    conn.on('ready', () => {
        console.log('🔗 Connected.');
        conn.sftp(async (err, sftp) => {
            if (err) throw err;

            const remoteBuildDir = CONFIG.APP_DIR + '/public/build';
            const localBuildDir = path.resolve(__dirname, '../public/build');

            const files = getAllFiles(localBuildDir);
            console.log(`📦 Files to upload: ${files.length}`);
            
            let count = 0;
            for (const file of files) {
                const relative = path.relative(localBuildDir, file);
                const remotePath = path.posix.join(remoteBuildDir, relative.replace(/\\/g, '/'));
                
                const remoteDir = path.posix.dirname(remotePath);
                await ensureDir(sftp, remoteDir);

                await new Promise((resolve, reject) => {
                    sftp.fastPut(file, remotePath, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                count++;
                if (count % 50 === 0) console.log(`Uploaded ${count}/${files.length}...`);
            }

            console.log('✅ Done.');
            conn.end();
        });
    }).connect(CONFIG.SSH);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });
    return arrayOfFiles;
}

const dirCache = new Set();
async function ensureDir(sftp, dir) {
    if (dirCache.has(dir) || dir === '.' || dir === '/' || dir.includes('public_html') && dir.endsWith('public_html')) return;
    const parent = path.posix.dirname(dir);
    if (parent !== dir) await ensureDir(sftp, parent);
    
    return new Promise((resolve) => {
        sftp.mkdir(dir, () => {
            dirCache.add(dir);
            resolve();
        });
    });
}

fullAssetSync();
