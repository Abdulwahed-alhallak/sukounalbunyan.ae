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

function fix_arabic_mojibake_final($str) {
    $map = [
        'ظ…' => 'م', 'ط´' => 'ش', 'ط±' => 'ر', 'ظˆ' => 'و', 'ط¹' => 'ع',
        'ظ†' => 'ن', 'ط®' => 'خ', 'ظ„' => 'ل', 'ط©' => 'ة', 'ط¬' => 'ج',
        'ظٹ' => 'ي', 'ط§' => 'ا', 'ط¨' => 'ب', 'طھ' => 'ت', 'ط«' => 'ث',
        'ط' => 'ح', 'ط¯' => 'د', 'ط°' => 'ذ', 'ط²' => 'ز', 'ط³' => 'س',
        'طµ' => 'ص', 'ط¶' => 'ض', 'ط·' => 'ط', 'ط¸' => 'ظ', 'ط¹' => 'ع',
        'ط؛' => 'غ', 'ظپ' => 'ف', 'ظ‚' => 'ق', 'ظƒ' => 'ك', 'ظ…' => 'م',
        'ظ†' => 'ن', 'ظ‡' => 'ه', 'ظˆ' => 'و', 'ظٹ' => 'ي', 'ط£' => 'أ',
        'ط¥' => 'إ', 'ط¢' => 'آ', 'ط¤' => 'ؤ', 'ط¦' => 'ئ', 'ظ‰' => 'ى'
    ];
    
    // Sort keys by length descending to match longer patterns first
    uksort($map, function($a, $b) {
        return strlen($b) - strlen($a);
    });
    
    return strtr($str, $map);
}

$projects = \\DB::table('projects')->get();
foreach ($projects as $project) {
    $fixed = fix_arabic_mojibake_final($project->name);
    if ($fixed !== $project->name) {
        echo "ID: {$project->id}\\n";
        echo "  OLD: {$project->name}\\n";
        echo "  NEW: $fixed\\n";
        // Uncomment to actually update
        // \\DB::table('projects')->where('id', $project->id)->update(['name' => $fixed]);
    }
}
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/fix_encoding_map.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            conn.exec(`cd ${appDir} && ${php} fix_encoding_map.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
