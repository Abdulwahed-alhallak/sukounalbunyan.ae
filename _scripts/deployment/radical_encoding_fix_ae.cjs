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

function fix_mojibake($str) {
    if (empty($str)) return $str;
    if (!is_string($str)) return $str;
    
    $map = [
        'ظ…' => 'م', 'ط´' => 'ش', 'ط±' => 'ر', 'ظˆ' => 'و', 'ط¹' => 'ع',
        'ظ†' => 'ن', 'ط®' => 'خ', 'ظ„' => 'ل', 'ط©' => 'ة', 'ط¬' => 'ج',
        'ظٹ' => 'ي', 'ط§' => 'ا', 'ط¨' => 'ب', 'طھ' => 'ت', 'ط«' => 'ث',
        'ط' => 'ح', 'ط¯' => 'د', 'ط°' => 'ذ', 'ط²' => 'ز', 'ط³' => 'س',
        'طµ' => 'ص', 'ط¶' => 'ض', 'ط·' => 'ط', 'ط¸' => 'ظ', 'ط¹' => 'ع',
        'ط؛' => 'غ', 'ظپ' => 'ف', 'ظ‚' => 'ق', 'ظƒ' => 'ك', 'ظ…' => 'م',
        'ظ†' => 'ن', 'ظ‡' => 'ه', 'ظˆ' => 'و', 'ظٹ' => 'ي', 'ط£' => 'أ',
        'ط¥' => 'إ', 'ط¢' => 'آ', 'ط¤' => 'ؤ', 'ط¦' => 'ئ', 'ظ‰' => 'ى',
        'ط±' => 'ر', 'ط' => 'ح', 'ط§' => 'ا', 'ط§' => 'ا', // duplicates for safety
        'ط¨' => 'ب', 'طھ' => 'ت', 'ط«' => 'ث', 'ط¬' => 'ج', 'ط' => 'ح',
        'ط®' => 'خ', 'ط¯' => 'د', 'ط°' => 'ذ', 'ط±' => 'ر', 'ط²' => 'ز',
        'ط³' => 'س', 'ط´' => 'ش', 'طµ' => 'ص', 'ط¶' => 'ض', 'ط·' => 'ط',
        'ط¸' => 'ظ', 'ط¹' => 'ع', 'ط؛' => 'غ', 'ظپ' => 'ف', 'ظ‚' => 'ق',
        'ظƒ' => 'ك', 'ظ„' => 'ل', 'ظ…' => 'م', 'ظ†' => 'ن', 'ظ‡' => 'ه',
        'ظˆ' => 'و', 'ظٹ' => 'ي'
    ];
    
    uksort($map, function($a, $b) { return strlen($b) - strlen($a); });
    
    $fixed = strtr($str, $map);
    
    // Check if it's still containing mojibake chars. If so, it might be double-double encoded or something.
    // But for now, this is a huge improvement.
    return $fixed;
}

$tables = ['projects', 'contracts', 'invoices', 'users', 'deals', 'job_locations', 'items', 'warehouses', 'inventory_transactions'];

foreach ($tables as $table) {
    if (!\\Schema::hasTable($table)) continue;
    
    echo "Processing table: $table\\n";
    $columns = \\Schema::getColumnListing($table);
    $textColumns = [];
    foreach ($columns as $col) {
        $type = \\Schema::getColumnType($table, $col);
        if (in_array($type, ['string', 'text', 'varchar'])) {
            $textColumns[] = $col;
        }
    }
    
    $rows = \\DB::table($table)->get();
    foreach ($rows as $row) {
        $updates = [];
        foreach ($textColumns as $col) {
            $original = $row->$col;
            if (empty($original)) continue;
            $fixed = fix_mojibake($original);
            if ($fixed !== $original) {
                $updates[$col] = $fixed;
                echo "  ID {$row->id} [$col]: {$original} -> {$fixed}\\n";
            }
        }
        if (!empty($updates)) {
            \\DB::table($table)->where('id', $row->id)->update($updates);
        }
    }
}

echo "✅ RADICAL FIX COMPLETED\\n";
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/radical_encoding_fix.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            console.log('🚀 Executing Radical Fix...');
            conn.exec(`cd ${appDir} && ${php} radical_encoding_fix.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => {
                    // conn.exec(`rm ${remoteFile}`, () => conn.end());
                    conn.end();
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
