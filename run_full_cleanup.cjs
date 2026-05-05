const { Client } = require('ssh2');
const config = { host: '62.72.25.117', port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC' };

const tinkerCmd = 
\\App\\Models\\Setting::where('created_by', 7)->delete();
\\Noble\\ProductService\\Models\\ProductServiceUnit::withoutGlobalScopes()->where('created_by', 7)->delete();
\\Noble\\ProductService\\Models\\ProductServiceCategory::withoutGlobalScopes()->where('created_by', 7)->delete();
\\Noble\\ProductService\\Models\\ProductServiceItem::withoutGlobalScopes()->where('created_by', 7)->delete();
\\App\\Models\\Warehouse::withoutGlobalScopes()->where('created_by', 7)->delete();
\\Noble\\Lead\\Models\\Pipeline::where('created_by', 7)->delete();
\\Noble\\Lead\\Models\\LeadStage::where('created_by', 7)->delete();
\\Noble\\Lead\\Models\\DealStage::where('created_by', 7)->delete();
\\Noble\\Lead\\Models\\Lead::where('created_by', 7)->delete();
\\Noble\\Lead\\Models\\Deal::where('created_by', 7)->delete();
\\Noble\\Rental\\Models\\RentalContract::withoutGlobalScopes()->where('created_by', 7)->each(function (\\) { \\->items()->delete(); \\->delete(); });
\\Noble\\Taskly\\Models\\Project::withoutGlobalScopes()->where('created_by', 7)->delete();
\\Noble\\Account\\Models\\Customer::withoutGlobalScopes()->where('created_by', 7)->delete();
\\App\\Models\\User::withoutGlobalScopes()->where('created_by', 7)->delete();
echo "Data Cleaned.";
;

const conn = new Client();
conn.on('ready', () => {
    conn.exec('cd domains/sukounalbunyan.ae/public_html/backend && git pull origin master && /opt/alt/php82/usr/bin/php artisan tinker --execute="' + tinkerCmd.replace(/\\n/g, ' ') + '" && /opt/alt/php82/usr/bin/php artisan db:seed --class=DemoRentalDataSeeder --force', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => { conn.end(); }).on('data', (data) => { process.stdout.write(data); }).stderr.on('data', (data) => { process.stderr.write(data); });
    });
}).connect(config);
