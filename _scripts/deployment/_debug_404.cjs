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

    // 1. Check git situation
    let r = await exec(conn, `cd ${APP} && git log --oneline -5`);
    console.log('Server commits:\n' + r + '\n');

    r = await exec(conn, `cd ${APP} && git log --oneline -5 origin/master`);
    console.log('Origin commits:\n' + r + '\n');

    r = await exec(conn, `cd ${APP} && git status --short | head -20`);
    console.log('Git status:\n' + r + '\n');

    // 2. Check if .env has correct APP_URL
    r = await exec(conn, `cd ${APP} && grep 'APP_URL' .env`);
    console.log('.env APP_URL:\n' + r + '\n');

    // 3. Check the public/.htaccess
    r = await exec(conn, `cat ${APP}/public/.htaccess 2>&1`);
    console.log('.htaccess:\n' + r + '\n');

    // 4. Check Hostinger's document root
    r = await exec(conn, `ls -la ${APP}/../public_html 2>&1 | head -3`);
    console.log('Document root check:\n' + r + '\n');

    // 5. Check if index.php exists in public/
    r = await exec(conn, `test -f ${APP}/public/index.php && echo "EXISTS" || echo "MISSING"`);
    console.log('public/index.php: ' + r + '\n');

    // 6. Check if index.php exists in root
    r = await exec(conn, `test -f ${APP}/index.php && echo "EXISTS" || echo "MISSING"`);
    console.log('root index.php: ' + r + '\n');

    // 7. Check symlinks
    r = await exec(conn, `ls -la ${APP}/../ 2>&1`);
    console.log('Parent dir:\n' + r + '\n');

    // 8. Try accessing with PHP directly
    r = await exec(conn, `cd ${APP} && ${PHP} artisan route:list --path=login 2>&1 | head -10`);
    console.log('Route list (login):\n' + r + '\n');

    // 9. Check .htaccess in root APP dir
    r = await exec(conn, `cat ${APP}/.htaccess 2>&1`);
    console.log('Root .htaccess:\n' + r + '\n');

    conn.end();
    process.exit(0);
});

conn.on('error', e => { console.error(e.message); process.exit(1); });
conn.connect({ host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC', readyTimeout: 20000, keepaliveInterval: 3000 });
