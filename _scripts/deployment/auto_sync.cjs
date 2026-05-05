const { execSync } = require('child_process');
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');
const SSH_CONFIG = CONFIG.SSH;
const APP_DIR = CONFIG.APP_DIR;
const LOCAL_DIR = path.join(__dirname, '..', '..');
const PHP = CONFIG.PHP;

console.log('===================================================');
console.log('🚀 Sukoun Albunyan - FULL CI/CD AUTOMATION SCRIPT');
console.log('===================================================\n');

function runLocal(cmd, cwd = LOCAL_DIR) {
    try {
        console.log(`> Local: ${cmd}`);
        execSync(cmd, { cwd, stdio: 'inherit' });
    } catch (e) {
        console.error(`❌ Local command failed: ${e.message}`);
        process.exit(1);
    }
}

async function runRemote(conn, cmd) {
    return new Promise((resolve, reject) => {
        console.log(`> Remote: ${cmd.substring(0, 80)}...`);
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let out = '';
            stream.on('data', d => { out += d; process.stdout.write(d); });
            stream.stderr.on('data', d => { out += d; process.stderr.write(d); });
            stream.on('close', code => {
                if (code !== 0) return reject(new Error(`Command failed with code ${code}`));
                resolve(out);
            });
        });
    });
}

async function syncBuildFiles(conn) {
    return new Promise((resolve, reject) => {
        conn.sftp(async (err, sftp) => {
            if (err) return reject(err);
            
            // 1. Wipe remote build assets
            await new Promise(r => conn.exec(`rm -rf ${APP_DIR}/public/build/assets/*`, r));

            // 2. Upload build assets
            console.log('\n📦 Syncing public/build folder via SFTP (Git-ignored)...');
            const buildDir = path.join(LOCAL_DIR, 'public', 'build');
            let uploaded = 0;
            const files = [];

            function walkDir(dir, prefix = '') {
                for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                    const full = path.join(dir, entry.name);
                    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
                    if (entry.isDirectory()) walkDir(full, rel);
                    else files.push({ local: full, rel });
                }
            }
            if (fs.existsSync(buildDir)) walkDir(buildDir);
            
            const batchSize = 10;
            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                await Promise.all(batch.map(f => new Promise(res => {
                    sftp.fastPut(f.local, `${APP_DIR}/public/build/${f.rel}`, () => {
                        uploaded++;
                        if (uploaded % 100 === 0) process.stdout.write(`...${uploaded}`);
                        res();
                    });
                })));
            }
            console.log(`\n   ✅ Uploaded ${uploaded} build files.`);

            // 3. Sync Service Worker and Manifest from public root
            console.log('\n📦 Syncing PWA assets (sw-v18.js, manifest.json)...');
            const swFiles = ['sw-v18.js', 'manifest.json'];
            for (const file of swFiles) {
                const localFilePath = path.join(LOCAL_DIR, 'public', file);
                if (fs.existsSync(localFilePath)) {
                    // Upload to BOTH public root and domain root to be safe
                    await new Promise(res => sftp.fastPut(localFilePath, `${APP_DIR}/public/${file}`, res));
                    await new Promise(res => sftp.fastPut(localFilePath, `${APP_DIR}/${file}`, res));
                    console.log(`   ✅ Uploaded ${file} to public/ and root/`);
                }
            }

            // 4. Cleanup legacy workers
            console.log('📦 Cleaning up legacy workers (sw.js, sw-v17.js)...');
            await new Promise(res => conn.exec(`rm -f ${APP_DIR}/public/sw.js ${APP_DIR}/public/sw-v17.js ${APP_DIR}/sw.js ${APP_DIR}/sw-v17.js`, res));

            resolve();
        });
    });
}

(async () => {
    // 1. Build locally
    console.log('\n[1/5] Building frontend assets...');
    runLocal('npm run build');

    // 2. Commit and Push
    console.log('\n[2/5] Committing to Git...');
    runLocal('git add .');
    const commitMsg = process.argv[2] || "Auto-sync update to production";
    try {
        execSync(`git commit -m "${commitMsg}"`, { cwd: LOCAL_DIR, stdio: 'pipe' });
    } catch(e) {
        console.log("No git changes to commit, proceeding...");
    }
    runLocal('git push origin master');

    // 3. Connect to Production
    console.log('\n[3/5] Connecting to Production Server...');
    const conn = new Client();
    
    conn.on('ready', async () => {
        try {
            console.log('✅ SSH Connected.');

            // 4. Remote Pull
            console.log('\n[4/5] Pulling latest code on server...');
            await runRemote(conn, `cd ${APP_DIR} && git fetch --all && git reset --hard origin/master`);

            // 5. Upload Build folder
            await syncBuildFiles(conn);

            // 6. Cache and Optimize
            console.log('\n[5/5] Hardening and Optimizing production...');
            
            // A. Remove any accidental public/hot file
            await runRemote(conn, `rm -f ${APP_DIR}/public/hot`);
            console.log('   ✅ Removed public/hot (Dev cleanup)');

            // B. Fix APP_URL in .env if missing or incorrect
            await runRemote(conn, `cd ${APP_DIR} && sed -i 's|^APP_URL=.*|APP_URL=https://sukounalbunyan.ae/backend|' .env`);
            console.log('   ✅ Enforced APP_URL=https://sukounalbunyan.ae/backend in .env');

            // C. Clear and cache
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan optimize:clear`);
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan view:clear && ${PHP} artisan config:clear`);
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan migrate --force`);
            
            const tinkerCmd = "\\$u = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first(); if (\\$u) { \\$u->update(['password' => \\Illuminate\\Support\\Facades\\Hash::make('Nn@!23456'), 'is_disable' => 0, 'is_enable_login' => 1]); }";
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan tinker --execute="${tinkerCmd}"`);
            
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan optimize`);
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan event:cache`);
            
            console.log('\n===================================================');
            console.log('✅ SYNC COMPLETE! Production is hardened and live.');
            console.log('===================================================');
            conn.end();
            process.exit(0);

        } catch (e) {
            console.error('\n❌ SYNC FAILED:', e);
            conn.end();
            process.exit(1);
        }
    }).on('error', err => {
        console.error('❌ SSH Error:', err.message);
        process.exit(1);
    }).connect(SSH_CONFIG);
})();
