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

    // 1. Restore index.php in root (entry point proxy)
    console.log('▸ [1/4] Restoring index.php entry point...');
    const indexPhp = `<?php
/**
 * Noble Architecture — Root Entry Point
 * Proxies all requests to public/index.php
 * REQUIRED on Hostinger where document root = public_html/
 */
define('LARAVEL_START', microtime(true));
require __DIR__.'/public/index.php';
`;
    await exec(conn, `cat > ${APP}/index.php << 'NOBLE_EOF'
${indexPhp}
NOBLE_EOF`);
    let r = await exec(conn, `test -f ${APP}/index.php && echo "EXISTS" || echo "MISSING"`);
    console.log(`  index.php: ${r}\n`);

    // 2. Restore sw.js (service worker needed for PWA)
    console.log('▸ [2/4] Restoring sw.js...');
    await exec(conn, `cd ${APP} && git checkout origin/master -- sw.js 2>&1`);
    r = await exec(conn, `test -f ${APP}/sw.js && echo "EXISTS" || echo "MISSING"`);
    console.log(`  sw.js: ${r}\n`);

    // 3. Clear all caches (config:clear is critical since we changed files)
    console.log('▸ [3/4] Clearing and rebuilding caches...');
    await exec(conn, `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`);
    r = await exec(conn, `cd ${APP} && ${PHP} artisan optimize 2>&1`);
    console.log(`  ${r}\n`);

    // 4. Verify
    console.log('▸ [4/4] Verification...');
    r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`);
    console.log(`  HTTP /login: ${r}`);
    r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/`);
    console.log(`  HTTP /:      ${r}`);
    r = await exec(conn, `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/dashboard`);
    console.log(`  HTTP /dashboard: ${r}`);

    console.log('\n✅ Done!');
    conn.end();
    process.exit(0);
});

conn.on('error', e => { console.error(e.message); process.exit(1); });
conn.connect({ host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC', readyTimeout: 20000, keepaliveInterval: 3000 });
