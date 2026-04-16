const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    // We use a simpler command that doesn't use artisan tinker if possible, 
    // or we use a very carefully quoted tinker command.
    // Let's use raw PHP to fetch names.
    const phpCode = "require 'vendor/autoload.php'; \\$app = require_once 'bootstrap/app.php'; \\$kernel = \\$app->make(Illuminate\\\\Contracts\\\\Http\\\\Kernel::class); \\$kernel->handle(Illuminate\\\\Http\\\\Request::capture()); foreach(App\\\\Models\\\\User::select('name')->limit(30)->get() as \\$u) echo \\$u->name . PHP_EOL;";
    const cmd = `cd /home/u256167180/domains/noble.dion.sy/public_html && /opt/alt/php82/usr/bin/php -r "${phpCode}"`;
    
    conn.exec(cmd, (err, stream) => {
        if (err) { console.error(err); conn.end(); return; }
        stream.on('data', d => process.stdout.write(d));
        stream.stderr.on('data', d => process.stderr.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', err => {
    console.error('SSH Error:', err.message);
}).connect({
    host: '62.72.25.117', port: 65002,
    username: 'u256167180', password: '4_m_XMkgux@.AgC',
    readyTimeout: 30000
});
