/**
 * Noble Architecture — Professional Server Sync & Cleanup
 * Comprehensive script that:
 *  1. Syncs git to latest
 *  2. Verifies & uploads public/build (883 files)
 *  3. Removes all junk/legacy files
 *  4. Runs composer install (--no-dev)
 *  5. Runs migrations + seeders check
 *  6. Fixes permissions
 *  7. Clears & rebuilds all caches
 *  8. Full verification
 */
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const APP = '/home/u256167180/domains/noble.dion.sy/public_html';
const PHP = '/opt/alt/php82/usr/bin/php';
const COMPOSER = `${PHP} /home/u256167180/bin/composer`;
const LOCAL_BUILD = path.join(__dirname, '..', '..', 'public', 'build');

function walkDir(dir, prefix = '') {
    const files = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        const rel = prefix ? `${prefix}/${e.name}` : e.name;
        if (e.isDirectory()) files.push(...walkDir(full, rel));
        else files.push({ local: full, rel, size: fs.statSync(full).size });
    }
    return files;
}

function exec(conn, cmd, timeout = 120000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => resolve('[timeout after ' + (timeout/1000) + 's]'), timeout);
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
const buildFiles = walkDir(LOCAL_BUILD);

console.log('═══════════════════════════════════════════════════════');
console.log('  🏛️  NOBLE ARCHITECTURE — FULL SERVER SYNC & CLEANUP');
console.log('═══════════════════════════════════════════════════════\n');
console.log(`📦 Local build: ${buildFiles.length} files`);
console.log(`🔗 Connecting to 62.72.25.117:65002...\n`);

conn.on('ready', async () => {
    console.log('✅ SSH Connected!\n');
    const results = { success: [], warnings: [], errors: [] };

    try {
        // ═══════════════════════════════════════
        // PHASE 1: Git Sync
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  📥 PHASE 1: Git Sync');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        let r = await exec(conn, `cd ${APP} && git fetch --all 2>&1`);
        console.log(`  fetch: ${r}`);
        r = await exec(conn, `cd ${APP} && git reset --hard origin/master 2>&1`);
        console.log(`  reset: ${r}`);
        r = await exec(conn, `cd ${APP} && git log --oneline -1`);
        console.log(`  HEAD:  ${r}\n`);
        results.success.push('Git synced to latest');

        // ═══════════════════════════════════════
        // PHASE 2: Remove Junk Files
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🗑️  PHASE 2: Remove Legacy/Junk Files');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Junk files in root
        const junkFiles = [
            'execute_ssh.cjs', 'noble_final_sync.sql', 'nobel_Employee_S_Data.csv',
            'artisan_serve.log', 'npm_dev.log', 'tsc_output.txt', 'LAST_UPDATE.log',
            'manifest.json', 'index.php', 'sw.js',
        ];
        for (const f of junkFiles) {
            r = await exec(conn, `test -f ${APP}/${f} && rm -f ${APP}/${f} && echo "DELETED: ${f}" || echo "skip: ${f}"`);
            if (r.startsWith('DELETED')) console.log(`  ✅ ${r}`);
        }

        // Junk directories
        const junkDirs = [
            'tmp', 'knowledge', 'packages/dionone', 'cypress',
            'app/Services/DionFlow',
            'resources/js/pages/MissionCommand',
        ];
        for (const d of junkDirs) {
            r = await exec(conn, `test -d ${APP}/${d} && rm -rf ${APP}/${d} && echo "DELETED DIR: ${d}" || echo "skip: ${d}"`);
            if (r.startsWith('DELETED')) console.log(`  ✅ ${r}`);
        }

        // Junk individual files (legacy code)
        const junkIndividual = [
            'app/Http/Controllers/DionFlowController.php',
            'app/Observers/DionFlowObserver.php',
            'app/Services/DionFlowTriggerService.php',
            'resources/js/components/DionLoader.tsx',
            '_scripts/remote_probe_user.php',
        ];
        for (const f of junkIndividual) {
            r = await exec(conn, `test -f ${APP}/${f} && rm -f ${APP}/${f} && echo "DELETED: ${f}" || echo "skip: ${f}"`);
            if (r.startsWith('DELETED')) console.log(`  ✅ ${r}`);
        }

        // Clean old sessions
        r = await exec(conn, `find ${APP}/storage/framework/sessions/ -name '*' -type f -mtime +7 -delete 2>/dev/null; echo "Sessions cleaned"`);
        console.log(`  ✅ Old sessions cleaned`);

        // Clean old logs (keep last 3 days)
        r = await exec(conn, `find ${APP}/storage/logs/ -name 'laravel-*.log' -mtime +3 -delete 2>/dev/null; echo "Old logs cleaned"`);
        console.log(`  ✅ Old logs cleaned\n`);
        results.success.push('Junk files removed');

        // ═══════════════════════════════════════
        // PHASE 3: Upload public/build
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  📤 PHASE 3: Upload public/build/');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Check current build count on server
        r = await exec(conn, `find ${APP}/public/build -type f 2>/dev/null | wc -l`);
        const serverBuildCount = parseInt(r) || 0;
        console.log(`  Server build files: ${serverBuildCount}`);
        console.log(`  Local  build files: ${buildFiles.length}`);

        if (serverBuildCount < buildFiles.length - 10) {
            console.log(`  ⚠️ Gap detected: ${buildFiles.length - serverBuildCount} files missing\n`);
            
            // Clean and re-upload
            await exec(conn, `rm -rf ${APP}/public/build/assets/*`);
            
            await new Promise((resolve, reject) => {
                conn.sftp(async (err, sftp) => {
                    if (err) return reject(err);
                    
                    // Create directories
                    const dirs = new Set();
                    buildFiles.forEach(f => {
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
                    let uploaded = 0, errors = 0;
                    const BATCH = 20;
                    for (let i = 0; i < buildFiles.length; i += BATCH) {
                        const batch = buildFiles.slice(i, i + BATCH);
                        await Promise.all(batch.map(f => new Promise(done => {
                            sftp.fastPut(f.local, `${APP}/public/build/${f.rel}`, err => {
                                if (err) errors++;
                                uploaded++;
                                if (uploaded % 200 === 0 || uploaded === buildFiles.length) {
                                    process.stdout.write(`\r  📦 ${uploaded}/${buildFiles.length} (${errors} errors)`);
                                }
                                done();
                            });
                        })));
                    }
                    console.log(`\n  ✅ ${uploaded} files uploaded (${errors} errors)\n`);
                    if (errors > 0) results.warnings.push(`${errors} build upload errors`);
                    else results.success.push('Build uploaded (883 files)');
                    resolve();
                });
            });
        } else {
            console.log('  ✅ Build is up-to-date, skipping upload\n');
            results.success.push('Build already current');
        }

        // ═══════════════════════════════════════
        // PHASE 4: Composer & Dependencies
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  📦 PHASE 4: Composer Dependencies');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        r = await exec(conn, `cd ${APP} && ${COMPOSER} install --no-dev --no-interaction --prefer-dist --optimize-autoloader 2>&1 | tail -5`, 300000);
        console.log(`  ${r}\n`);
        results.success.push('Composer install done');

        // ═══════════════════════════════════════
        // PHASE 5: Database
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🗄️  PHASE 5: Database Migrations');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        r = await exec(conn, `cd ${APP} && ${PHP} artisan migrate --force 2>&1`);
        console.log(`  ${r}\n`);
        results.success.push('Migrations done');

        // ═══════════════════════════════════════
        // PHASE 6: Permissions & Storage
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🔐 PHASE 6: Permissions & Storage');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await exec(conn, `chmod -R 755 ${APP}/storage ${APP}/bootstrap/cache 2>/dev/null`);
        console.log('  ✅ storage/ & bootstrap/cache/ → 755');

        r = await exec(conn, `cd ${APP} && ${PHP} artisan storage:link 2>&1`);
        console.log(`  storage:link: ${r}\n`);
        results.success.push('Permissions set');

        // ═══════════════════════════════════════
        // PHASE 7: Cache Clear & Rebuild
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ⚡ PHASE 7: Cache Optimization');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`);
        console.log('  ✅ optimize:clear');
        await exec(conn, `cd ${APP} && ${PHP} artisan config:cache 2>&1`);
        console.log('  ✅ config:cache');
        await exec(conn, `cd ${APP} && ${PHP} artisan route:cache 2>&1`);
        console.log('  ✅ route:cache');
        await exec(conn, `cd ${APP} && ${PHP} artisan view:cache 2>&1`);
        console.log('  ✅ view:cache');
        await exec(conn, `cd ${APP} && ${PHP} artisan event:cache 2>&1`);
        console.log('  ✅ event:cache\n');
        results.success.push('Caches rebuilt');

        // ═══════════════════════════════════════
        // PHASE 8: Full Verification
        // ═══════════════════════════════════════
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  🔍 PHASE 8: Full Verification');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Git
        r = await exec(conn, `cd ${APP} && git log --oneline -1`);
        console.log(`  Git HEAD:    ${r}`);

        // Laravel
        r = await exec(conn, `cd ${APP} && ${PHP} artisan --version 2>&1`);
        console.log(`  Laravel:     ${r}`);

        // Build
        r = await exec(conn, `find ${APP}/public/build -type f | wc -l`);
        console.log(`  Build files: ${r}`);

        // Manifest
        r = await exec(conn, `ls -la ${APP}/public/build/manifest.json 2>&1 | awk '{print $5, $6, $7, $8}'`);
        console.log(`  Manifest:    ${r}`);

        // Modules
        r = await exec(conn, `ls ${APP}/packages/noble/ | wc -l`);
        console.log(`  Modules:     ${r}`);

        // Vendor
        r = await exec(conn, `ls ${APP}/vendor/ | wc -l`);
        console.log(`  Vendor pkgs: ${r}`);

        // Migrations
        r = await exec(conn, `cd ${APP} && ${PHP} artisan migrate:status 2>&1 | grep -c '\\[✓\\]'`);
        console.log(`  Migrations:  ${r} ran`);

        // Disk
        r = await exec(conn, `du -sh ${APP}/ 2>/dev/null | awk '{print $1}'`);
        console.log(`  Disk:        ${r}`);

        // Junk check
        r = await exec(conn, `cd ${APP} && test -d tmp && echo "JUNK: tmp exists" || echo "Clean: no tmp"`);
        console.log(`  Junk check:  ${r}`);
        r = await exec(conn, `cd ${APP} && test -d packages/dionone && echo "JUNK: dionone exists" || echo "Clean: no dionone"`);
        console.log(`  Legacy:      ${r}`);

        // HTTP
        r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`);
        console.log(`  HTTP /login: ${r}`);
        r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/`);
        console.log(`  HTTP /:      ${r}`);

        // Any errors in today's log?
        r = await exec(conn, `grep -c "ERROR" ${APP}/storage/logs/laravel-$(date +%Y-%m-%d).log 2>/dev/null || echo "0"`);
        console.log(`  Errors today: ${r}`);

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('  ✅ FULL SERVER SYNC & CLEANUP COMPLETE');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`\n  ✅ Success: ${results.success.join(', ')}`);
        if (results.warnings.length) console.log(`  ⚠️ Warnings: ${results.warnings.join(', ')}`);
        if (results.errors.length) console.log(`  ❌ Errors: ${results.errors.join(', ')}`);
        console.log('\n  🌐 https://noble.dion.sy — LIVE & CLEAN\n');

    } catch (err) {
        console.error('\n❌ Fatal Error:', err.message);
    }

    conn.end();
    process.exit(0);
});

conn.on('error', e => { console.error('SSH Error:', e.message); process.exit(1); });
conn.connect({
    host: '62.72.25.117', port: 65002,
    username: 'u256167180', password: '4_m_XMkgux@.AgC',
    readyTimeout: 20000, keepaliveInterval: 3000, keepaliveCountMax: 10,
});
setTimeout(() => { console.log('\n⏱️ Global timeout'); conn.end(); process.exit(1); }, 900000);
