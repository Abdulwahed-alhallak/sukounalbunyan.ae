const { Client } = require('ssh2');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 60000
};

const conn = new Client();
conn.on('ready', () => {
    console.log('Connected to Production.');

    // 1. Fix Fonts and Disable ReCAPTCHA
    const fixCmd = `
        cd domains/noble.dion.sy/public_html && 
        sed -i "s/@5.0.0/@5.0.3/g" resources/views/app.blade.php &&
        sed -i "s/RECAPTCHA_MODULE=.*/RECAPTCHA_MODULE=off/g" .env &&
        /opt/alt/php82/usr/bin/php artisan config:cache
    `.trim();
    
    // 2. Activate Lifetime Plan via Tinker
    const tinkerCmd = `
        /opt/alt/php82/usr/bin/php domains/noble.dion.sy/public_html/artisan tinker --execute="
            \\$u = \\\\App\\\\Models\\\\User::where('name', 'NOBLE')->orWhere('email', 'admin@example.com')->first();
            if (\\$u) {
                \\$p = \\\\App\\\\Models\\\\Plan::updateOrCreate(
                    ['name' => 'Legacy Master Plan'],
                    ['price' => 0, 'duration' => 'Lifetime', 'enable_crm' => 1, 'enable_hrm' => 1, 'enable_account' => 1, 'enable_pms' => 1, 'enable_pos' => 1, 'modules' => 'all', 'max_users' => -1, 'max_customers' => -1, 'max_vendors' => -1]
                );
                \\$u->plan_id = \\$p->id;
                \\$u->plan_expire_date = null;
                \\$u->save();
                echo 'SUCCESS_LIFETIME_ACTIVATED_FOR_' . \\$u->name;
            } else { echo 'USER_NOT_FOUND'; }
        "
    `.trim();

    console.log('Applying surgical fixes...');
    conn.exec(fixCmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
            console.log('Environment fixed. Running database sync...');
            conn.exec(tinkerCmd, (err2, stream2) => {
                if (err2) throw err2;
                stream2.on('data', (d) => process.stdout.write(d));
                stream2.on('close', (code) => {
                    console.log(`\nActivation complete. Exit: ${code}`);
                    conn.end();
                    process.exit(0);
                });
            });
        });
    });
}).on('error', console.error).connect(config);
