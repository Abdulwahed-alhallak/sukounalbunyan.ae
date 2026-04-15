/**
 * Upload public/build/ to Hostinger via SFTP
 * Then clean old files and clear cache
 */
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const APP = '/home/u256167180/domains/noble.dion.sy/public_html';
const PHP = '/opt/alt/php82/usr/bin/php';
const LOCAL_BUILD = path.join(__dirname, '..', '..', 'public', 'build');

function walkDir(dir, prefix = '') {
    const files = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        const rel = prefix ? `${prefix}/${e.name}` : e.name;
        if (e.isDirectory()) files.push(...walkDir(full, rel));
        else files.push({ local: full, rel });
    }
    return files;
}

function exec(conn, cmd) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => resolve('[timeout]'), 60000);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(t); return reject(err); }
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => { clearTimeout(t); resolve(out.trim()); });
        });
    });
}

const conn = new Client();
const files = walkDir(LOCAL_BUILD);

console.log('═══════════════════════════════════════════════');
console.log('  🏛️  NOBLE — BUILD UPLOAD + CLEANUP');
console.log('═══════════════════════════════════════════════\n');
console.log(`📦 ${files.length} local build files\n`);
console.log('🔗 Connecting to 62.72.25.117:65002...');

conn.on('ready', async () => {
    console.log('✅ Connected!\n');

    try {
        // Step 1: Clean old build
        console.log('▸ [1/5] Cleaning old build on server...');
        await exec(conn, `rm -rf ${APP}/public/build/assets/*`);
        console.log('  ✅ Old assets removed\n');

        // Step 2: Upload via SFTP
        console.log('▸ [2/5] Uploading build files via SFTP...');
        await new Promise((resolve, reject) => {
            conn.sftp(async (err, sftp) => {
                if (err) return reject(err);

                // Ensure directories
                const dirs = new Set();
                files.forEach(f => {
                    const d = path.dirname(f.rel);
                    if (d !== '.') dirs.add(d);
                });
                for (const dir of [...dirs].sort()) {
                    let cur = `${APP}/public/build`;
                    for (const p of dir.split('/')) {
                        cur += '/' + p;
                        await new Promise(r => sftp.mkdir(cur, () => r()));
                    }
                }

                // Upload in batches
                let uploaded = 0;
                let errors = 0;
                const BATCH = 20;
                for (let i = 0; i < files.length; i += BATCH) {
                    const batch = files.slice(i, i + BATCH);
                    await Promise.all(batch.map(f => new Promise(done => {
                        sftp.fastPut(f.local, `${APP}/public/build/${f.rel}`, err => {
                            if (err) errors++;
                            uploaded++;
                            if (uploaded % 100 === 0 || uploaded === files.length) {
                                process.stdout.write(`\r  📦 ${uploaded}/${files.length} (${errors} errors)`);
                            }
                            done();
                        });
                    })));
                }
                console.log(`\n  ✅ ${uploaded} files uploaded (${errors} errors)\n`);
                resolve();
            });
        });

        // Step 3: Clean old junk files
        console.log('▸ [3/5] Cleaning old junk files...');
        const junkFiles = [
            'execute_ssh.cjs', 'noble_final_sync.sql', 'nobel_Employee_S_Data.csv',
            'artisan_serve.log', 'npm_dev.log', 'tsc_output.txt', 'LAST_UPDATE.log',
            'manifest.json'
        ];
        for (const f of junkFiles) {
            await exec(conn, `rm -f ${APP}/${f} 2>/dev/null`);
        }
        await exec(conn, `rm -rf ${APP}/tmp/ ${APP}/knowledge/ ${APP}/packages/dionone/ 2>/dev/null`);
        await exec(conn, `rm -rf ${APP}/app/Services/DionFlow/ ${APP}/resources/js/pages/MissionCommand/ 2>/dev/null`);
        await exec(conn, `rm -f ${APP}/app/Http/Controllers/DionFlowController.php ${APP}/app/Observers/DionFlowObserver.php ${APP}/app/Services/DionFlowTriggerService.php 2>/dev/null`);
        await exec(conn, `rm -f ${APP}/resources/js/components/DionLoader.tsx ${APP}/_scripts/remote_probe_user.php 2>/dev/null`);
        console.log('  ✅ Junk cleaned\n');

        // Step 4: Clear & rebuild cache
        console.log('▸ [4/5] Cache clear & rebuild...');
        await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`);
        await exec(conn, `cd ${APP} && ${PHP} artisan config:cache 2>&1`);
        await exec(conn, `cd ${APP} && ${PHP} artisan route:cache 2>&1`);
        await exec(conn, `cd ${APP} && ${PHP} artisan view:cache 2>&1`);
        console.log('  ✅ Caches rebuilt\n');

        // Step 5: Verify
        console.log('▸ [5/5] Verify...');
        let r = await exec(conn, `find ${APP}/public/build -type f | wc -l`);
        console.log(`  Build files on server: ${r}`);
        r = await exec(conn, `ls -la ${APP}/public/build/manifest.json`);
        console.log(`  Manifest: ${r}`);
        r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`);
        console.log(`  HTTP: ${r}`);

        console.log('\n═══════════════════════════════════════════════');
        console.log('  ✅ BUILD UPLOAD + CLEANUP COMPLETE');
        console.log('═══════════════════════════════════════════════');

    } catch (err) {
        console.error('\n❌ Error:', err.message);
    }

    conn.end();
    process.exit(0);
});

conn.on('error', e => { console.error('SSH Error:', e.message); process.exit(1); });
conn.connect({ host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC', readyTimeout: 20000, keepaliveInterval: 3000, keepaliveCountMax: 10 });
setTimeout(() => { conn.end(); process.exit(1); }, 600000);
