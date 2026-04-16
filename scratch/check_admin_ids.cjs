const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();
conn.on('ready', () => {
    const command = `cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="
        \\$sa = \\App\\Models\\User::where('type','superadmin')->first();
        \\$co = \\App\\Models\\User::where('type','company')->first();
        echo json_encode([
            'superadmin_id' => \\$sa ? \\$sa->id : null,
            'superadmin_email' => \\$sa ? \\$sa->email : null,
            'company_id' => \\$co ? \\$co->id : null,
            'company_email' => \\$co ? \\$co->email : null,
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
