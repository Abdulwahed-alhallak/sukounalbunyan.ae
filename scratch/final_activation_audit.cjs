const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    const command = `cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="
        \\$admin = \\App\\Models\\User::where('email', 'admin@noblearchitecture.net')->first();
        \\$addonCount = \\App\\Models\\AddOn::where('is_enable', 1)->count();
        \\$activeModuleCount = \\DB::table('user_active_modules')->where('user_id', \\$admin->id)->count();
        \\$plan = \\App\\Models\\Plan::find(\\$admin->active_plan);
        
        echo json_encode([
            'admin_id' => \\$admin->id,
            'plan_name' => \\$plan ? \\$plan->name : 'NONE',
            'total_user_limit' => \\$admin->total_user,
            'enabled_addons_count' => \\$addonCount,
            'admin_active_modules_count' => \\$activeModuleCount,
            'active_modules_list' => \\DB::table('user_active_modules')->where('user_id', \\$admin->id)->pluck('module'),
        ]);
    "`;
    conn.exec(command, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', (d) => out += d.toString());
        stream.on('close', () => { console.log(out); conn.end(); });
    });
})
.on('error', (err) => console.error('Error:', err.message))
.connect({ ...CONFIG.SSH, readyTimeout: 60000 });
