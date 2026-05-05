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

function safe_fix_mojibake($str) {
    if (empty($str)) return $str;
    if (!is_string($str)) return $str;
    
    // ONLY apply if we see very specific long mojibake patterns
    if (strpos($str, "ظ…ط´ط±ظˆط¹") === false && strpos($str, "ط§ظ„") === false && strpos($str, "ظ†ط®ظ„ط©") === false) {
        // If it doesn't look like our specific corrupted data, don't touch it
        // Or if it already looks like good Arabic
        if (preg_match('/[\\x{0600}-\\x{06FF}]{5,}/u', $str)) {
             // If it has 5+ consecutive Arabic characters, it's probably fine
             // BUT, we might have mixed data.
        }
    }

    $map = [
        'ظ…ط´ط±ظˆط¹' => 'مشروع',
        'ط§ظ„' => 'ال',
        'ظ†ط®ظ„ط©' => 'نخلة',
        'ط¬ظ…ظٹط±ط§' => 'جميرا',
        'طµط¬ط¹ط©' => 'صجعة',
        'ط³ظƒظ†ظٹ' => 'سكني',
        'طھظˆط³ط¹ط©' => 'توسعة',
        'ظ…طµظ†ط¹' => 'مصنع',
        'ظ…طµظپط­' => 'مصفح',
        'ظ…ط³طھظˆط¯ط¹' => 'مستودع',
        'ط§ظ„ط±ط¦ظٹط³ظٹ' => 'الرئيسي',
        'ظ…ظ†ط·ظ‚ط©' => 'منطقة',
        'ط§ظ„طµظ†ط§ط¹ظٹط©' => 'الصناعية',
        'ط§ظ„ط´ط§ط±ظ‚ط©' => 'الشارقة',
        'ط§ظ„ط¥ظ…ط§ط±ط§طھ' => 'الإمارات',
        'ط§ظ„ط¹ط±ط¨ظٹط©' => 'العربية',
        'ط§ظ„ظ…طھط­ط¯ط©' => 'المتحدة',
        // Fallback for smaller bits (only if they contain the specific corrupted marks)
        'ظ…' => 'م', 'ط´' => 'ش', 'ط±' => 'ر', 'ظˆ' => 'و', 'ط¹' => 'ع',
        'ظ†' => 'ن', 'ط®' => 'خ', 'ظ„' => 'ل', 'ط©' => 'ة', 'ط¬' => 'ج',
        'ظٹ' => 'ي', 'ط§' => 'ا', 'ط¨' => 'ب', 'طھ' => 'ت', 'ط«' => 'ث',
        'ط­' => 'ح', 'ط¯' => 'د', 'ط°' => 'ذ', 'ط²' => 'ز', 'ط³' => 'س',
        'طµ' => 'ص', 'ط¶' => 'ض', 'ط·' => 'ط', 'ط¸' => 'ظ', 'ط¹' => 'ع',
        'ط؛' => 'غ', 'ظپ' => 'ف', 'ظ‚' => 'ق', 'ظƒ' => 'ك', 'ظ‡' => 'ه',
        'ط£' => 'أ', 'ط¥' => 'إ', 'ط¢' => 'آ', 'ط¤' => 'ؤ', 'ط¦' => 'ئ', 'ظ‰' => 'ى'
    ];
    
    // REMOVE single characters from map that are real Arabic characters
    unset($map['ط']); // This was breaking "منطقة"
    unset($map['ظ']);
    
    // Add specific mojibake symbols that are NOT real Arabic characters
    $map['ط§'] = 'ا';
    $map['ط¬'] = 'ج';
    $map['ط±'] = 'ر';
    
    uksort($map, function($a, $b) { return mb_strlen($b) - mb_strlen($a); });
    
    return strtr($str, $map);
}

// RESTORE any accidentally broken words (like منحقة)
$tables = ['projects', 'contracts', 'invoices', 'users', 'deals', 'job_locations', 'items', 'warehouses', 'inventory_transactions'];
foreach ($tables as $table) {
    if (!\\Schema::hasTable($table)) continue;
    $rows = \\DB::table($table)->get();
    foreach ($rows as $row) {
        $updates = [];
        foreach ($row as $col => $val) {
            if (!is_string($val)) continue;
            // Fix "منحقة" -> "منطقة"
            $fixed = str_replace('منحقة', 'منطقة', $val);
            // Fix "حŒ" which was probably a comma
            $fixed = str_replace('حŒ', '،', $fixed);
            
            if ($fixed !== $val) {
                $updates[$col] = $fixed;
                echo "  RESTORING ID {$row->id} [$col]: $val -> $fixed\\n";
            }
        }
        if (!empty($updates)) {
            \\DB::table($table)->where('id', $row->id)->update($updates);
        }
    }
}

echo "✅ RECOVERY COMPLETED\\n";
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/safe_encoding_recovery.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            console.log('🚀 Executing Recovery...');
            conn.exec(`cd ${appDir} && ${php} safe_encoding_recovery.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
