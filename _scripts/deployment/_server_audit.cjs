const { Client } = require('ssh2');
const conn = new Client();
const APP = '/home/u256167180/domains/noble.dion.sy/public_html';

const commands = [
    // Top-level structure
    `ls -1 ${APP}/`,
    // Check critical dirs
    `echo "--- node_modules ---" && test -d ${APP}/node_modules && echo "EXISTS ($(ls ${APP}/node_modules/ | wc -l) packages)" || echo "MISSING"`,
    `echo "--- vendor ---" && test -d ${APP}/vendor && echo "EXISTS ($(ls ${APP}/vendor/ | wc -l) packages)" || echo "MISSING"`,
    `echo "--- .env ---" && test -f ${APP}/.env && echo "EXISTS" || echo "MISSING"`,
    `echo "--- .env.production ---" && test -f ${APP}/.env.production && echo "EXISTS" || echo "MISSING"`,
    `echo "--- public/build ---" && test -d ${APP}/public/build && echo "EXISTS ($(find ${APP}/public/build -type f | wc -l) files)" || echo "MISSING"`,
    `echo "--- public/storage ---" && ls -la ${APP}/public/storage 2>&1`,
    `echo "--- resources/js ---" && test -d ${APP}/resources/js && echo "EXISTS ($(find ${APP}/resources/js -type f | wc -l) files)" || echo "MISSING"`,
    `echo "--- resources/css ---" && test -d ${APP}/resources/css && echo "EXISTS" || echo "MISSING"`,
    `echo "--- resources/lang ---" && test -d ${APP}/resources/lang && echo "EXISTS ($(ls ${APP}/resources/lang/))" || echo "MISSING"`,
    `echo "--- packages/noble ---" && ls ${APP}/packages/noble/ | wc -l`,
    `echo "--- packages/noble list ---" && ls ${APP}/packages/noble/`,
    `echo "--- _scripts ---" && test -d ${APP}/_scripts && echo "EXISTS ($(ls ${APP}/_scripts/ | wc -l) subdirs)" || echo "MISSING"`,
    `echo "--- database/migrations ---" && ls ${APP}/database/migrations/ | wc -l`,
    `echo "--- storage/logs ---" && ls ${APP}/storage/logs/ 2>&1 | tail -3`,
    `echo "--- git status ---" && cd ${APP} && git status --short 2>&1 | head -20`,
    `echo "--- git log ---" && cd ${APP} && git log --oneline -3`,
    // Disk usage
    `echo "--- DISK USAGE ---" && du -sh ${APP}/ 2>/dev/null`,
    `echo "--- BUILD SIZE ---" && du -sh ${APP}/public/build/ 2>/dev/null || echo "N/A"`,
    `echo "--- VENDOR SIZE ---" && du -sh ${APP}/vendor/ 2>/dev/null || echo "N/A"`,
    `echo "--- NODE_MODULES SIZE ---" && du -sh ${APP}/node_modules/ 2>/dev/null || echo "N/A"`,
];

function exec(conn, cmd) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve('[timeout]'), 30000);
        conn.exec(cmd, (err, stream) => {
            if (err) { clearTimeout(timer); return reject(err); }
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => { clearTimeout(timer); resolve(out.trim()); });
        });
    });
}

conn.on('ready', async () => {
    console.log('✅ SSH Connected — Scanning server files...\n');
    for (const cmd of commands) {
        const result = await exec(conn, cmd);
        console.log(result);
        console.log('');
    }
    conn.end();
    process.exit(0);
});

conn.on('error', e => { console.error('SSH Error:', e.message); process.exit(1); });
conn.connect({ host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC', readyTimeout: 20000, keepaliveInterval: 3000 });
setTimeout(() => { conn.end(); process.exit(1); }, 120000);
