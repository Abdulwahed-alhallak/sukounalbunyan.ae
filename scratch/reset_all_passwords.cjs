const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    const newPassword = 'Nn@!23456';
    const phpCode = `
        require 'vendor/autoload.php';
        $app = require_once 'bootstrap/app.php';
        $kernel = $app->make(Illuminate\\Contracts\\Http\\Kernel::class);
        $kernel->handle(Illuminate\\Http\\Request::capture());
        
        $count = App\\Models\\User::count();
        App\\Models\\User::query()->update(['password' => Illuminate\\Support\\Facades\\Hash::make('${newPassword}')]);
        echo "SUCCESS: Updated $count users with the new password.";
    `;
    const cmd = `cd /home/u256167180/domains/noble.dion.sy/public_html && /opt/alt/php82/usr/bin/php -r "${phpCode.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`;
    
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
