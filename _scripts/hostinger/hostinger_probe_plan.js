import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
cat << 'EOF' > run_probe.php
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$user = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
$plan = \\App\\Models\\Plan::orderBy('id', 'desc')->first();

echo "User Active Plan ID: " . $user->active_plan . "\\n";
echo "User Active Modules: " . $user->active_module . "\\n";
echo "Plan Modules: " . (is_array($plan->modules) ? implode(',', $plan->modules) : $plan->modules) . "\\n";

EOF
/opt/alt/php82/usr/bin/php run_probe.php &&
rm run_probe.php
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Probing Module Status...');
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
