const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = {
    host: process.env.PRODUCTION_HOST,
    port: parseInt(process.env.PRODUCTION_PORT, 10),
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD
};

const appDir = process.env.PRODUCTION_APP_DIR;
const php = '/opt/alt/php82/usr/bin/php';

const conn = new Client();
conn.on('ready', () => {
    const phpCode = `<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

function replace_legacy($str) {
    if (empty($str)) return $str;
    $str = str_ireplace('nobel.dion.sy', 'sukounalbunyan.ae', $str);
    $str = str_ireplace('dion.sy', 'sukounalbunyan.ae', $str);
    $str = str_ireplace('Abdulwahed-alhallak', 'sukounalbunyan', $str);
    return $str;
}

$targets = [
    ['custom_pages', 'content'],
    ['landing_page_settings', 'contact_email'],
    ['settings', 'value']
];

foreach ($targets as $t) {
    $table = $t[0];
    $col = $t[1];
    if (!\\Schema::hasTable($table)) continue;
    
    $rows = \\DB::table($table)->where($col, 'LIKE', '%dion.sy%')->orWhere($col, 'LIKE', '%alhallak%')->get();
    foreach ($rows as $row) {
        $old = $row->$col;
        $new = replace_legacy($old);
        if ($old !== $new) {
            \\DB::table($table)->where('id', $row->id)->update([$col => $new]);
            echo "Updated $table.$col (ID: {$row->id})\\n";
        }
    }
}
echo "✅ LEGACY LINKS REPLACED\\n";
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/replace_legacy_links.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            conn.exec(`cd ${appDir} && ${php} replace_legacy_links.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
