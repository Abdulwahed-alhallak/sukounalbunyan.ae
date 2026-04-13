import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
cat << 'EOF' > run_lifetime.php
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$user = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
$plan = \\App\\Models\\Plan::orderBy('id', 'desc')->first();

if ($user && $plan) {
    $user->active_plan = $plan->id;
    $user->plan_expire_date = null;
    $user->trial_expire_date = null;
    $user->is_trial_done = 1;
    $user->storage_limit = 999999999;
    $user->total_user = -1;
    $user->save();

    if (\\Schema::hasColumn('users', 'active_module')) {
        $user->active_module = implode(',', $plan->modules ?? []);
        $user->save();
    }
    
    $workspace = \\App\\Models\\Workspace::where('created_by', $user->id)->first();
    if ($workspace) {
        $workspace->active_modules = is_array($plan->modules) ? implode(',', $plan->modules) : $plan->modules;
        $workspace->save();
    }

    echo "✅ Success: NOBLE ARCHITECTURE HAS LIFETIME ACCESS TO ALL MODULES.\\n";
} else {
    echo "❌ Error: User or Plan not found.\\n";
}
EOF
/opt/alt/php82/usr/bin/php run_lifetime.php &&
rm run_lifetime.php
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Upgrading Noble Architecture Workspace to LIFETIME...');
    conn.exec(deployCommands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`Plan Upgrade Successful with Code: ${code}`);
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
