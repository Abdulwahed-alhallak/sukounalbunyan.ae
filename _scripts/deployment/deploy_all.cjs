/**
 * Noble Architecture — FULL DEPLOYMENT SCRIPT
 * Deploys everything to noble.dion.sy:
 *   1. Git push to GitHub
 *   2. Git pull on server
 *   3. Upload public/build/ via SFTP
 *   4. Database migrations
 *   5. Cache clear & rebuild
 *   6. Verify
 */

const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load config
const CONFIG = require('./secureConfig.cjs');
const SSH_CONFIG = CONFIG.SSH;
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;
const LOCAL_BUILD = path.join(__dirname, '..', '..', 'public', 'build');

function exec(conn, cmd, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve('[timeout]'), timeout);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(timer); return reject(err); }
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => {
                clearTimeout(timer);
                resolve(out.trim());
            });
        });
    });
}

async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🏛️  NOBLE ARCHITECTURE — FULL PRODUCTION DEPLOYMENT');
    console.log('═══════════════════════════════════════════════════════\n');

    // Step 0: Verify local build
    if (!fs.existsSync(path.join(LOCAL_BUILD, 'manifest.json'))) {
        console.error('❌ public/build/manifest.json not found! Run: npm run build');
        process.exit(1);
    }
    const buildFiles = walkDir(LOCAL_BUILD);
    console.log(`✅ Local build verified: ${buildFiles.length} files\n`);

    // Connect SSH
    console.log(`🔗 Connecting to ${SSH_CONFIG.host}:${SSH_CONFIG.port}...`);
    const conn = new Client();

    conn.on('error', err => {
        console.error('❌ SSH Error:', err.message);
        process.exit(1);
    });

    conn.on('ready', async () => {
        console.log('✅ SSH Connected!\n');

        try {
            // Step 1: Git pull
            console.log('▸ [1/7] Git fetch & reset to origin/master...');
            let out = await exec(conn, `cd ${APP} && git fetch origin master 2>&1 && git reset --hard origin/master 2>&1`, 120000);
            console.log(`  ${out.split('\n').slice(-3).join('\n  ')}\n`);

            // Step 2: Upload build via SFTP
            console.log('▸ [2/7] Uploading public/build/ via SFTP...');
            await uploadBuild(conn, buildFiles);

            // Step 3: Composer install
            console.log('\n▸ [3/7] Composer install (production)...');
            out = await exec(conn, `cd ${APP} && ${PHP} /home/u256167180/bin/composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader 2>&1 | tail -5`, 180000);
            console.log(`  ${out}\n`);

            // Step 4: Migrations
            console.log('▸ [4/7] Database migrations...');
            out = await exec(conn, `cd ${APP} && ${PHP} artisan migrate --force 2>&1`, 60000);
            console.log(`  ${out}\n`);

            // Step 5: Storage link
            console.log('▸ [5/7] Storage link...');
            out = await exec(conn, `cd ${APP} && ${PHP} artisan storage:link 2>&1`);
            console.log(`  ${out}\n`);

            // Step 6: Clear & rebuild caches
            console.log('▸ [6/7] Cache clear & rebuild...');
            await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`);
            await exec(conn, `cd ${APP} && ${PHP} artisan config:cache 2>&1`);
            await exec(conn, `cd ${APP} && ${PHP} artisan route:cache 2>&1`);
            await exec(conn, `cd ${APP} && ${PHP} artisan view:cache 2>&1`);
            console.log('  ✅ Caches rebuilt\n');

            // Step 7: Verify
            console.log('▸ [7/7] Verification...');
            out = await exec(conn, `ls -la ${APP}/public/build/manifest.json 2>&1`);
            console.log(`  Manifest: ${out}`);
            out = await exec(conn, `ls ${APP}/public/build/assets/ 2>&1 | wc -l`);
            console.log(`  Assets count: ${out}`);
            out = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`);
            console.log(`  Login HTTP: ${out}`);

            console.log('\n═══════════════════════════════════════════════════════');
            console.log('  ✅ FULL PRODUCTION DEPLOYMENT COMPLETE');
            console.log('  🌐 https://noble.dion.sy');
            console.log('═══════════════════════════════════════════════════════');

        } catch (err) {
            console.error('\n❌ Deployment Error:', err.message);
        }

        conn.end();
        process.exit(0);
    });

    conn.connect(SSH_CONFIG);
}

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

function uploadBuild(conn, files) {
    return new Promise((resolve, reject) => {
        conn.sftp(async (err, sftp) => {
            if (err) return reject(err);

            // Ensure dirs exist
            const dirs = new Set();
            for (const f of files) {
                const d = path.dirname(f.rel);
                if (d !== '.') dirs.add(d);
            }

            for (const dir of [...dirs].sort()) {
                const parts = dir.split('/');
                let current = `${APP}/public/build`;
                for (const part of parts) {
                    current += '/' + part;
                    await new Promise(r => sftp.mkdir(current, () => r()));
                }
            }

            // Upload in parallel batches
            let uploaded = 0;
            const BATCH = 15;

            for (let i = 0; i < files.length; i += BATCH) {
                const batch = files.slice(i, i + BATCH);
                await Promise.all(batch.map(file => new Promise(resolve => {
                    const remote = `${APP}/public/build/${file.rel}`;
                    sftp.fastPut(file.local, remote, err => {
                        uploaded++;
                        if (err) console.error(`  ❌ ${file.rel}`);
                        if (uploaded % 100 === 0 || uploaded === files.length) {
                            process.stdout.write(`\r  📦 ${uploaded}/${files.length} (${Math.round(uploaded/files.length*100)}%)`);
                        }
                        resolve();
                    });
                })));
            }

            console.log(`\n  ✅ Uploaded ${uploaded}/${files.length} build files`);
            resolve();
        });
    });
}

// Global timeout: 10 minutes
setTimeout(() => { console.log('\n⏱️ Global timeout (10m)'); process.exit(1); }, 600000);

main().catch(err => { console.error(err); process.exit(1); });
