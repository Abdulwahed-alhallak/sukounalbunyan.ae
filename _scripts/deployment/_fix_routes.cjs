const { Client } = require('ssh2');
const conn = new Client();
const APP = '/home/u256167180/domains/noble.dion.sy/public_html';
const PHP = '/opt/alt/php82/usr/bin/php';

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

conn.on('ready', async () => {
    console.log('✅ Connected\n');

    // Find composer
    let r = await exec(conn, `which composer 2>/dev/null; find /usr -name composer -type f 2>/dev/null; find /home/u256167180 -name composer -o -name composer.phar 2>/dev/null | head -5`);
    console.log(`Composer paths: ${r}\n`);

    // Check today's errors
    r = await exec(conn, `tail -30 ${APP}/storage/logs/laravel-$(date +%Y-%m-%d).log 2>/dev/null`);
    console.log(`Recent errors:\n${r}\n`);

    // Fix: clear route cache (might be causing 404)
    console.log('Fixing route cache...');
    await exec(conn, `cd ${APP} && ${PHP} artisan route:clear 2>&1`);
    await exec(conn, `cd ${APP} && ${PHP} artisan config:clear 2>&1`);
    await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`);
    
    // Rebuild with optimize (which does config+route+view together)
    r = await exec(conn, `cd ${APP} && ${PHP} artisan optimize 2>&1`);
    console.log(`optimize: ${r}\n`);

    // Verify
    r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`);
    console.log(`HTTP /login: ${r}`);
    r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/`);
    console.log(`HTTP /: ${r}`);

    conn.end();
    process.exit(0);
});

conn.on('error', e => { console.error(e.message); process.exit(1); });
conn.connect({ host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC', readyTimeout: 20000, keepaliveInterval: 3000 });
setTimeout(() => { conn.end(); process.exit(1); }, 120000);
