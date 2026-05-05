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

function fix_arabic_mojibake($str) {
    if (empty($str)) return $str;
    
    // Attempt 1: Standard double-UTF8 fix
    $fix1 = @iconv("UTF-8", "ISO-8859-1//IGNORE", $str);
    if ($fix1 && preg_match('/[\\x{0600}-\\x{06FF}]/u', $fix1)) return $fix1;

    // Attempt 2: Windows-1252 to UTF-8
    $fix2 = @iconv("UTF-8", "Windows-1252//IGNORE", $str);
    if ($fix2 && preg_match('/[\\x{0600}-\\x{06FF}]/u', $fix2)) return $fix2;
    
    // Attempt 3: Custom map for the most common ones
    $mojibake_map = [
        'ط§' => 'ا', 'ط¨' => 'ب', 'ط©' => 'ة', 'طھ' => 'ت', 'ط«' => 'ث', 'ط¬' => 'ج', 'ط' => 'ح', 'ط®' => 'خ',
        'ط¯' => 'د', 'ط°' => 'ذ', 'ط±' => 'ر', 'ط²' => 'ز', 'ط³' => 'س', 'ط´' => 'ش', 'طµ' => 'ص', 'ط¶' => 'ض',
        'ط·' => 'ط', 'ط¸' => 'ظ', 'ط¹' => 'ع', 'ط؛' => 'غ', 'ظپ' => 'ف', 'ظ‚' => 'ق', 'ظƒ' => 'ك', 'ظ„' => 'ل',
        'ظ…' => 'م', 'ظ†' => 'ن', 'ظ‡' => 'ه', 'ظˆ' => 'و', 'ظٹ' => 'ي'
    ];
    // Add variations
    $mojibake_map['ظ'] = 'م';
    $mojibake_map['ط'] = 'ا'; // simplified
    
    // If all else fails, use a dedicated library-like approach
    // We can try to manually rebuild bytes if we see the pattern
    // The pattern "ظ…" is common for "م"
    
    return $str;
}

$id = 4;
$str = \\DB::table('projects')->where('id', $id)->value('name');
echo "ORIGINAL: $str\\n";

// Let's try to FORCE decode it by treating UTF-8 chars as their low bytes
function force_decode($str) {
    $out = "";
    $chars = preg_split('//u', $str, -1, PREG_SPLIT_NO_EMPTY);
    foreach ($chars as $c) {
        $hex = bin2hex($c);
        if (strlen($hex) == 4 && substr($hex, 0, 2) == 'd8') {
             // This is likely a single-byte char that was converted to a 2-byte Arabic char
             // E.g. 0xD9 interpreted as some char in another encoding
        }
    }
    return $str;
}

// THE RADICAL FIX:
// If the string is already in the DB as "ظ…ط´ط±ظˆط¹", we need to convert it to BINARY
// then back to UTF8 but interpreting it as Latin1 first.

$fixed_sql = \\DB::selectOne("SELECT CONVERT(BINARY CONVERT(? USING utf8mb4) USING latin1) as fixed", [$str]);
echo "SQL_FIX_1: " . ($fixed_sql->fixed ?? 'FAIL') . "\\n";

$fixed_sql2 = \\DB::selectOne("SELECT CONVERT(BINARY ? USING latin1) as fixed", [$str]);
echo "SQL_FIX_2: " . ($fixed_sql2->fixed ?? 'FAIL') . "\\n";

$fixed_sql3 = \\DB::selectOne("SELECT CONVERT(CAST(? AS BINARY) USING utf8mb4) as fixed", [$str]);
echo "SQL_FIX_3: " . ($fixed_sql3->fixed ?? 'FAIL') . "\\n";

`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/fix_encoding_sql.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            conn.exec(`cd ${appDir} && ${php} fix_encoding_sql.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
