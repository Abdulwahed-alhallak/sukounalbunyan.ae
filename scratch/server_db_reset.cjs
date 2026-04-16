const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    const cmd = "cd /home/u256167180/domains/noble.dion.sy/public_html && /opt/alt/php82/usr/bin/php artisan migrate:fresh --seed --force";
    console.log("🚀 Starting database fresh migration and seeding on Hostinger...");
    
    conn.exec(cmd, (err, stream) => {
        if (err) { console.error(err); conn.end(); return; }
        stream.on('data', d => process.stdout.write(d));
        stream.stderr.on('data', d => process.stderr.write(d));
        stream.on('close', () => {
            console.log("\n✅ Database migration and seeding completed successfully.");
            conn.end();
        });
    });
}).on('error', err => {
    console.error('SSH Error:', err.message);
}).connect({
    host: '62.72.25.117', port: 65002,
    username: 'u256167180', password: '4_m_XMkgux@.AgC',
    readyTimeout: 30000
});
