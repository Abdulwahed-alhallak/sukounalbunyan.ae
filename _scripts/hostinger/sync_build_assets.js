#!/usr/bin/env node
/**
 * Sync Build Assets to Hostinger via SFTP (Chunked)
 * Handles timeouts by syncing in batches
 */

const { Client: SSHClient } = require('ssh2');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;

const CONFIG = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    appDir: '/home/u256167180/domains/noble.dion.sy/public_html'
};

const LOCAL_BUILD_DIR = path.join(__dirname, '../../public/build/assets');
const REMOTE_BUILD_DIR = `${CONFIG.appDir}/public/build/assets`;

console.log('🚀 Syncing build assets to Hostinger...\n');

async function getLocalFiles() {
    return fs.readdirSync(LOCAL_BUILD_DIR).filter(f => !f.startsWith('.'));
}

/**
 * Upload files in batches to avoid timeouts
 * @param {any} conn SSH connection
 * @param {any} sftp SFTP client
 * @param {string[]} files Array of file names
 * @param {number} batchSize Number of files per batch
 */
async function uploadBatch(conn, sftp, files, batchSize = 50) {
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        console.log(`📦 Uploading batch ${Math.floor(i / batchSize) + 1} (${batch.length} files)...`);

        for (const file of batch) {
            const localPath = path.join(LOCAL_BUILD_DIR, file);
            const remotePath = `${REMOTE_BUILD_DIR}/${file}`;

            await new Promise(/** @param {(value?: any) => void} resolve */ (resolve, reject) => {
                sftp.fastPut(localPath, remotePath, { step: 1024 }, (/** @type {any} */ err) => {
                    if (err) {
                        console.error(`❌ Failed to upload ${file}: ${err.message}`);
                        reject(err);
                    } else {
                        console.log(`✅ ${file}`);
                        resolve();
                    }
                });
            }).catch(e => {
                // Continue even if one file fails
                console.warn(`⚠️  Skipping ${file}`);
            });
        }

        // Small delay between batches
        await new Promise(/** @param {(value?: any) => void} r */ r => setTimeout(r, 500));
    }
}

async function syncAssets() {
    return new Promise(/** @param {(value?: any) => void} resolve */ (resolve, reject) => {
        const conn = new SSHClient();
        
        conn.on('ready', async () => {
            console.log('✅ SSH Connected\n');
            
            try {
                // Ensure remote directory exists
                await new Promise(/** @param {(value?: any) => void} r */ (r) => {
                    conn.exec(`mkdir -p ${REMOTE_BUILD_DIR}`, (err, stream) => {
                        if (err) console.error('Create dir error:', err);
                        stream.on('close', r);
                    });
                });

                conn.sftp(async (err, sftp) => {
                    if (err) return reject(err);

                    const files = await getLocalFiles();
                    console.log(`📂 Found ${files.length} local build files\n`);

                    try {
                        await uploadBatch(conn, sftp, files, 30);
                        console.log('\n✅ Build assets synced successfully!');
                        resolve();
                    } catch (e) {
                        reject(e);
                    } finally {
                        conn.end();
                    }
                });
            } catch (e) {
                conn.end();
                reject(e);
            }
        });

        conn.on('error', reject);
        conn.connect(CONFIG);
    });
}

syncAssets()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
