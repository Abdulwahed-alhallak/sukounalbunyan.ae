const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    const phpPath = CONFIG.PHP;
    const appDir = CONFIG.APP_DIR;
    
    const command = `cd ${appDir} && ${phpPath} artisan tinker --execute="
        // 1. Check add_ons table
        \\$addons = \\DB::table('add_ons')->get();
        
        // 2. Check plans
        \\$plans = \\DB::table('plans')->get(['id','name','free_plan','number_of_users','modules']);
        
        // 3. Check admin user plan status
        \\$admin = \\App\\Models\\User::where('email','admin@noblearchitecture.net')->first();
        \\$adminPlan = ['active_plan'=>\\$admin->active_plan,'plan_expire_date'=>\\$admin->plan_expire_date,'total_user'=>\\$admin->total_user,'storage_limit'=>\\$admin->storage_limit];
        
        // 4. Check user_active_modules for admin
        \\$activeModules = \\DB::table('user_active_modules')->where('user_id', \\$admin->id)->pluck('module')->toArray();
        
        // 5. List all package dirs
        \\$dirs = array_map('basename', glob(base_path('packages/noble/*'), GLOB_ONLYDIR));
        
        echo json_encode([
            'addons_count' => \\$addons->count(),
            'addons' => \\$addons->map(fn(\\$a) => ['id'=>\\$a->id,'module'=>\\$a->module,'is_enable'=>\\$a->is_enable,'for_admin'=>\\$a->for_admin]),
            'plans' => \\$plans,
            'admin_plan' => \\$adminPlan,
            'admin_active_modules' => \\$activeModules,
            'package_dirs' => \\$dirs,
        ]);
    "`;

    conn.exec(command, (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('data', (data) => output += data.toString());
        stream.on('close', () => {
            console.log(output);
            conn.end();
        });
    });
})
.on('error', (err) => console.error('Error:', err.message))
.connect({ ...CONFIG.SSH, readyTimeout: 90000 });
