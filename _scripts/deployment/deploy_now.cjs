const { Client } = require('ssh2');

const conn = new Client();
const PHP = '/opt/alt/php82/usr/bin/php';
const APP = '/home/u256167180/domains/noble.dion.sy/public_html';

const commands = [
    'echo "=== NOBLE DEPLOY START ==="',
    `cd ${APP} && git remote -v`,
    `cd ${APP} && git fetch --all 2>&1`,
    `cd ${APP} && git log --oneline -3 origin/master`,
    `cd ${APP} && git reset --hard origin/master 2>&1`,
    `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`,
    `cd ${APP} && ${PHP} artisan migrate --force 2>&1`,
    `cd ${APP} && ${PHP} artisan config:cache 2>&1`,
    `cd ${APP} && ${PHP} artisan route:cache 2>&1`,
    `cd ${APP} && ${PHP} artisan view:cache 2>&1`,
    `cd ${APP} && ${PHP} artisan storage:link 2>&1`,
    `cd ${APP} && ls -la public/build/manifest.json 2>&1`,
    `curl -sk -o /dev/null -w "HTTP: %{http_code}" https://noble.dion.sy/login`,
    'echo ""',
    'echo "=== DEPLOY COMPLETE ==="',
];

function exec(conn, cmd) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve('[timeout]'), 60000);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(timer); return reject(err); }
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => { clearTimeout(timer); resolve(out.trim()); });
        });
    });
}

console.log('═══════════════════════════════════════════════');
console.log('  🏛️  NOBLE ARCHITECTURE — FULL DEPLOY');
console.log('═══════════════════════════════════════════════\n');
console.log('🔗 Connecting to 62.72.25.117:65002...');

conn.on('ready', async () => {
    console.log('✅ SSH Connected!\n');
    
    for (const cmd of commands) {
        console.log(`> ${cmd.substring(0, 80)}`);
        try {
            const result = await exec(conn, cmd);
            if (result) console.log(`  ${result}\n`);
        } catch (err) {
            console.error(`  ❌ Error: ${err.message}\n`);
        }
    }
    
    conn.end();
    process.exit(0);
});

conn.on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
    process.exit(1);
});

conn.connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 20000,
    keepaliveInterval: 3000,
    keepaliveCountMax: 10,
});

setTimeout(() => { conn.end(); process.exit(1); }, 300000);
