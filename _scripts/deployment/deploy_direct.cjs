/**
 * Noble Architecture — Direct SSH Deploy
 * Uses ssh2 with aggressive keepAlive and retries
 */
const { Client } = require('ssh2');

const CONFIGS = [
    { host: '62.72.25.117', port: 65002 },
    { host: '191.101.104.20', port: 65002 },
    { host: '193.203.166.17', port: 65002 },
];

const AUTH = { username: 'u256167180', password: '4_m_XMkgux@.AgC' };
const APP = '/home/u256167180/domains/noble.dion.sy/public_html';
const PHP = '/usr/local/bin/php';

const DEPLOY_SCRIPT = `
cd ${APP} &&
echo "=== NOBLE DEPLOY START ===" &&
git fetch origin master 2>&1 &&
git reset --hard origin/master 2>&1 &&
${PHP} artisan optimize:clear 2>&1 &&
${PHP} artisan migrate --force 2>&1 &&
${PHP} artisan config:cache 2>&1 &&
${PHP} artisan route:cache 2>&1 &&
${PHP} artisan view:cache 2>&1 &&
${PHP} artisan storage:link 2>&1 &&
ls -la public/build/manifest.json 2>&1 &&
echo "=== DEPLOY COMPLETE ==="
`.trim().replace(/\n/g, ' ');

function tryConnect(config, timeout = 20000) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const timer = setTimeout(() => {
            conn.end();
            reject(new Error(`Timeout connecting to ${config.host}`));
        }, timeout);

        conn.on('ready', () => {
            clearTimeout(timer);
            resolve(conn);
        });
        conn.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
        conn.connect({
            ...config,
            ...AUTH,
            readyTimeout: timeout,
            keepaliveInterval: 3000,
            keepaliveCountMax: 10,
            debug: (msg) => {
                if (msg.includes('KEX') || msg.includes('AUTH') || msg.includes('handshake')) {
                    process.stdout.write('.');
                }
            }
        });
    });
}

(async () => {
    console.log('═══════════════════════════════════════════════');
    console.log('  🏛️  NOBLE ARCHITECTURE — SSH DEPLOY');
    console.log('═══════════════════════════════════════════════\n');

    let conn = null;

    for (const config of CONFIGS) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`🔗 ${config.host}:${config.port} (attempt ${attempt}/3)...`);
            try {
                conn = await tryConnect(config);
                console.log(' ✅ CONNECTED!\n');
                break;
            } catch (err) {
                console.log(` ❌ ${err.message}`);
                if (attempt < 3) await new Promise(r => setTimeout(r, 2000));
            }
        }
        if (conn) break;
    }

    if (!conn) {
        console.log('\n❌ All SSH connections failed.');
        process.exit(1);
    }

    // Execute deploy
    console.log('▸ Running deploy commands...\n');
    conn.exec(DEPLOY_SCRIPT, { pty: true }, (err, stream) => {
        if (err) { console.error('Exec error:', err); conn.end(); process.exit(1); }

        stream.on('data', (data) => process.stdout.write(data.toString()));
        stream.stderr.on('data', (data) => process.stderr.write(data.toString()));
        stream.on('close', (code) => {
            console.log(`\n\nExit code: ${code}`);
            conn.end();
            process.exit(code || 0);
        });
    });

    // Timeout 5 min
    setTimeout(() => { console.log('\n⏱️ Timeout 5min'); if (conn) conn.end(); process.exit(1); }, 300000);
})();
