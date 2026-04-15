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
console.log('🚀 NOBLE ARCHITECTURE - FULL CI/CD AUTOMATION SCRIPT');
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
    console.log('\n📦 Syncing public/build folder via SFTP (Git-ignored)...');
    return new Promise((resolve, reject) => {
        conn.sftp(async (err, sftp) => {
            if (err) return reject(err);
            
            // Wipe remote build assets
            await new Promise(r => conn.exec(`rm -rf ${APP_DIR}/public/build/assets/*`, r));

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
            walkDir(buildDir);
            
            // Create directories recursively isn't strictly needed for default vite structure
            // since vite puts everything in build/assets, but we will use fastPut directly
            
            const batchSize = 10;
            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                await Promise.all(batch.map(f => new Promise(res => {
                    sftp.fastPut(f.local, `${APP_DIR}/public/build/${f.rel}`, () => {
                        uploaded++;
                        if (uploaded % 50 === 0) process.stdout.write(`...${uploaded}`);
                        res();
                    });
                })));
            }
            console.log(`\n✅ Uploaded ${uploaded} build files.`);
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
            console.log('\n[5/5] Optimizing production (clearing cache + migrations)...');
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan optimize:clear`);
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan migrate --force`);
            await runRemote(conn, `cd ${APP_DIR} && ${PHP} artisan optimize`);
            
            console.log('\n===================================================');
            console.log('✅ SYNC COMPLETE! Production is fully updated.');
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
    }).connect({
        ...SSH_CONFIG,
        readyTimeout: 120000,
        keepaliveInterval: 10000,
        keepaliveCountMax: 10
    });
})();
