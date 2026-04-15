import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
cat << 'EOF' > run_fix_pass.php
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$users = [
    'admin@noblearchitecture.net',
    'superadmin@noblearchitecture.net',
];

foreach ($users as $email) {
    $user = \\App\\Models\\User::where('email', $email)->first();
    if ($user) {
        $user->password = \\Illuminate\\Support\\Facades\\Hash::make('1234');
        $user->save();
        echo "Reset password to 1234 for $email\\n";
    }
}
echo "Done!\\n";
EOF
/opt/alt/php82/usr/bin/php run_fix_pass.php &&
rm run_fix_pass.php
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Fixing database passwords globally...');
    conn.exec(deployCommands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
