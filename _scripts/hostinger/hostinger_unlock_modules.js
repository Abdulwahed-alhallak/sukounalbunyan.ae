import { Client } from 'ssh2';

const conn = new Client();
const deployCommands = `
cd domains/noble.dion.sy/public_html &&
cat << 'EOF' > run_unlock_modules.php
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

$user = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();

if (!$user) {
    echo "❌ User not found.\\n";
    exit;
}

// Get ALL modules from the AddOn table
$allModules = \\App\\Models\\AddOn::pluck('module')->toArray();

// Just in case AddOn table is empty or missing something, merge with defaults:
$backupModules = ["Taskly","Account","Hrm","Lead","Pos","Stripe","Paypal","AIAssistant","BudgetPlanner","Calendar","Contract","DoubleEntry","FormBuilder","Goal","Performance","Quotation","Recruitment","Slack","SupportTicket","Telegram","Timesheet","Training","Twilio","Webhook","ZoomMeeting","Retainer","Dairy","ProductService","Sales"];

$finalModules = array_unique(array_merge($allModules, $backupModules));
$modulesStr = implode(',', $finalModules);

// Update their current plan
$plan = \\App\\Models\\Plan::find($user->active_plan);
if ($plan) {
    $plan->modules = $finalModules; // Casted as JSON or array usually
    $plan->save();
}

// Update User active_module column if it exists
if (\\Schema::hasColumn('users', 'active_module')) {
    $user->active_module = $modulesStr;
    $user->save();
}

// Update their Workspace
if (class_exists('\\App\\Models\\Workspace')) {
    $workspace = \\App\\Models\\Workspace::where('created_by', $user->id)->active()->first() ?? \\App\\Models\\Workspace::where('created_by', $user->id)->first();
    if ($workspace) {
        $workspace->active_modules = $modulesStr;
        $workspace->save();
    }
}

// Re-generate UserActiveModules relationship
\\App\\Models\\UserActiveModule::where('user_id', $user->id)->delete();
foreach ($finalModules as $modName) {
    \\App\\Models\\UserActiveModule::create([
        'user_id' => $user->id,
        'module' => $modName,
    ]);
}

// Fire the events to grant permissions internally based on new modules
event(new \\App\\Events\\DefaultData($user->id, $modulesStr));

$client_role = \\Spatie\\Permission\\Models\\Role::where('name', 'client')->where('created_by', $user->id)->first();
$staff_role = \\Spatie\\Permission\\Models\\Role::where('name', 'staff')->where('created_by', $user->id)->first();

if (!empty($client_role)) {
    event(new \\App\\Events\\GivePermissionToRole($client_role->id, 'client', $modulesStr));
}
if (!empty($staff_role)) {
    event(new \\App\\Events\\GivePermissionToRole($staff_role->id, 'staff', $modulesStr));
}

echo "✅ SUCCESS! All " . count($finalModules) . " modules forcibly unlocked and assigned to Sukoun Albunyan.\\n";

EOF
/opt/alt/php82/usr/bin/php run_unlock_modules.php &&
rm run_unlock_modules.php
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Forcibly Unlocking All Modules...');
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
