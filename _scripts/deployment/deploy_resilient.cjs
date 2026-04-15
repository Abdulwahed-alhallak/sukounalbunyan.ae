/**
 * Noble Architecture — Resilient SFTP Build Uploader
 * Uploads public/build/ with retry logic and keepAlive
 */
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const CONFIG = require('./secureConfig.cjs');
const SSH_CONFIG = {
    ...CONFIG.SSH,
    keepaliveInterval: 5000,
    keepaliveCountMax: 10,
    readyTimeout: 30000,
    algorithms: {
        kex: ['ecdh-sha2-nistp256','ecdh-sha2-nistp384','diffie-hellman-group14-sha256','diffie-hellman-group14-sha1'],
    }
};
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;
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

function exec(conn, cmd, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => resolve('[timeout]'), timeout);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(t); return reject(err); }
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => { clearTimeout(t); resolve(out.trim()); });
        });
    });
}

function connectSSH(config, maxRetries = 3) {
    return new Promise((resolve, reject) => {
        let attempt = 0;
        function tryConnect() {
            attempt++;
            console.log(`  🔗 SSH attempt ${attempt}/${maxRetries}...`);
            const conn = new Client();
            const timer = setTimeout(() => {
                conn.end();
                if (attempt < maxRetries) { setTimeout(tryConnect, 3000); }
                else reject(new Error('SSH: all retries exhausted'));
            }, 15000);

            conn.on('ready', () => { clearTimeout(timer); resolve(conn); });
            conn.on('error', (err) => {
                clearTimeout(timer);
                console.log(`  ⚠️ Attempt ${attempt} failed: ${err.message}`);
                if (attempt < maxRetries) setTimeout(tryConnect, 3000);
                else reject(err);
            });
            conn.connect(config);
        }
        tryConnect();
    });
}

(async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🏛️  NOBLE — RESILIENT PRODUCTION DEPLOYER');
    console.log('═══════════════════════════════════════════════════════\n');

    const files = walkDir(LOCAL_BUILD);
    console.log(`✅ Local build: ${files.length} files\n`);

    try {
        const conn = await connectSSH(SSH_CONFIG, 5);
        console.log('✅ SSH Connected!\n');

        // Step 1: Git pull
        console.log('▸ [1/5] Git pull...');
        let r = await exec(conn, `cd ${APP} && git fetch origin master 2>&1 && git reset --hard origin/master 2>&1`, 120000);
        console.log(`  ${r.split('\n').slice(-2).join('\n  ')}\n`);

        // Step 2: Upload build
        console.log('▸ [2/5] Uploading build files...');
        await new Promise((resolve, reject) => {
            conn.sftp(async (err, sftp) => {
                if (err) return reject(err);

                // Create dirs
                const dirs = new Set();
                files.forEach(f => { const d = path.dirname(f.rel); if (d !== '.') dirs.add(d); });
                for (const dir of [...dirs].sort()) {
                    let cur = `${APP}/public/build`;
                    for (const p of dir.split('/')) { cur += '/' + p; await new Promise(r => sftp.mkdir(cur, () => r())); }
                }

                let up = 0;
                for (let i = 0; i < files.length; i += 15) {
                    const batch = files.slice(i, i + 15);
                    await Promise.all(batch.map(f => new Promise(done => {
                        sftp.fastPut(f.local, `${APP}/public/build/${f.rel}`, e => { up++; if (up % 100 === 0 || up === files.length) process.stdout.write(`\r  📦 ${up}/${files.length}`); done(); });
                    })));
                }
                console.log(`\n  ✅ ${up} files uploaded\n`);
                resolve();
            });
        });

        // Step 3: Migrations
        console.log('▸ [3/5] Migrations...');
        r = await exec(conn, `cd ${APP} && ${PHP} artisan migrate --force 2>&1`, 60000);
        console.log(`  ${r}\n`);

        // Step 4: Cache
        console.log('▸ [4/5] Cache clear & rebuild...');
        await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`);
        await exec(conn, `cd ${APP} && ${PHP} artisan config:cache 2>&1`);
        await exec(conn, `cd ${APP} && ${PHP} artisan route:cache 2>&1`);
        await exec(conn, `cd ${APP} && ${PHP} artisan view:cache 2>&1`);
        console.log('  ✅ Done\n');

        // Step 5: Verify
        console.log('▸ [5/5] Verify...');
        r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`);
        console.log(`  HTTP Status: ${r}`);

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('  ✅ DEPLOYMENT COMPLETE — https://noble.dion.sy');
        console.log('═══════════════════════════════════════════════════════');

        conn.end();
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Error:', err.message);
        process.exit(1);
    }
})();

setTimeout(() => { console.log('⏱️ Timeout'); process.exit(1); }, 600000);
