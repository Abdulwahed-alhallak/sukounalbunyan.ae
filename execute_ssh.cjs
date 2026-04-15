const { Client } = require('ssh2');

const conn = new Client();

console.log("Connecting SSH...");
conn.on('ready', () => {
    console.log('✅ SSH Connected!');
    conn.exec('cd domains/noble.dion.sy/public_html && git fetch --all && git reset --hard origin/master && php artisan optimize:clear && php artisan migrate --force && php artisan optimize', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('\n✅ Deployment Complete! Exit code: ' + code);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (err) => {
    console.error("❌ SSH Connection Error: ", err.message);
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 10000
});
