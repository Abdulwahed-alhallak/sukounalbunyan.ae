const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');
const SSH_CONFIG = CONFIG.SSH;
const APP = CONFIG.APP_DIR;
const LOCAL_BUILD = path.join(__dirname, '..', '..', 'public', 'build');
const PHP = CONFIG.PHP;

// Step 1: Create tar.gz locally using PowerShell-compatible method
// Step 2: Upload via SFTP
// Step 3: Extract on server
// Step 4: Clear caches

const conn = new Client();

function exec(conn, cmd) {
    return new Promise((resolve, reject) => {
        console.log(`  > ${cmd.substring(0, 100)}`);
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => { console.log(`    ${out.trim()}`); resolve(out); });
        });
    });
}

conn.on('ready', async () => {
    console.log('✅ SSH Connected\n');
    
    try {
        // Step 1: Remove old build on server
        console.log('▸ [1/5] Removing old build...');
        await exec(conn, `rm -rf ${APP}/public/build/assets/*`);
        
        // Step 2: Upload build files via SFTP
        console.log('\n▸ [2/5] Uploading build files via SFTP...');
        
        conn.sftp(async (err, sftp) => {
            if (err) throw err;
            
            // Collect all files  
            function walkDir(dir, prefix = '') {
                const files = [];
                for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                    const full = path.join(dir, entry.name);
                    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
                    if (entry.isDirectory()) {
                        files.push(...walkDir(full, rel));
                    } else {
                        files.push({ local: full, rel });
                    }
                }
                return files;
            }
            
            const files = walkDir(LOCAL_BUILD);
            console.log(`  Found ${files.length} files to upload`);
            
            // Ensure remote directories exist
            const dirs = new Set();
            for (const f of files) {
                const dir = path.dirname(f.rel);
                if (dir !== '.') dirs.add(dir);
            }
            
            for (const dir of dirs) {
                const parts = dir.split('/');
                let current = `${APP}/public/build`;
                for (const part of parts) {
                    current += '/' + part;
                    try { await new Promise((res, rej) => sftp.mkdir(current, (err) => res())); } catch(e) {}
                }
            }
            
            // Upload files in batches
            let uploaded = 0;
            const BATCH = 10;
            
            async function uploadFile(file) {
                const remotePath = `${APP}/public/build/${file.rel}`;
                return new Promise((resolve, reject) => {
                    sftp.fastPut(file.local, remotePath, (err) => {
                        if (err) {
                            console.error(`  ❌ ${file.rel}: ${err.message}`);
                            resolve(); // continue anyway
                        } else {
                            uploaded++;
                            if (uploaded % 50 === 0 || uploaded === files.length) {
                                console.log(`  📦 ${uploaded}/${files.length} (${Math.round(uploaded/files.length*100)}%)`);
                            }
                            resolve();
                        }
                    });
                });
            }
            
            // Upload in parallel batches
            for (let i = 0; i < files.length; i += BATCH) {
                const batch = files.slice(i, i + BATCH);
                await Promise.all(batch.map(f => uploadFile(f)));
            }
            
            console.log(`\n  ✅ Uploaded ${uploaded}/${files.length} files`);
            
            // Step 3: Clear caches
            console.log('\n▸ [3/5] Clearing caches...');
            await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear`);
            
            // Step 4: Rebuild caches
            console.log('\n▸ [4/5] Rebuilding caches...');
            await exec(conn, `cd ${APP} && ${PHP} artisan config:cache && ${PHP} artisan route:cache && ${PHP} artisan view:cache`);
            
            // Step 5: Verify
            console.log('\n▸ [5/5] Verification...');
            await exec(conn, `ls -la ${APP}/public/build/manifest.json`);
            await exec(conn, `ls ${APP}/public/build/assets/ | wc -l`);
            await exec(conn, `curl -sk -o /dev/null -w "HTTP: %{http_code}" https://noble.dion.sy/login`);
            
            console.log('\n═══════════════════════════════════════════════════');
            console.log('✅ FULL PRODUCTION SYNC COMPLETE');
            console.log('═══════════════════════════════════════════════════');
            
            conn.end();
        });
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        conn.end();
    }
}).on('error', err => {
    console.error('❌ SSH Error:', err.message);
    process.exit(1);
}).connect(SSH_CONFIG);

setTimeout(() => { console.log('⏱️ Timeout'); conn.end(); process.exit(1); }, 600000);
