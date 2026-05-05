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

function fix_arabic_mojibake($text) {
    if (empty($text)) return $text;
    
    // Convert to hex to see raw bytes
    $hex = bin2hex($text);
    
    // Try the HTML Entities trick to get raw bytes
    $raw = "";
    try {
        $converted = mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
        $raw = $converted;
    } catch (\\Exception $e) {
        // Fallback: manually strip the high bits or map them
        // This specific mojibake often comes from UTF8 -> Latin1 -> UTF8
        return "STILL_CORRUPTED";
    }
    
    return mb_convert_encoding($raw, 'UTF-8', 'Windows-1256');
}

// THE ULTIMATE ARABIC MOJIBAKE MAP
// This maps the specific corrupted characters back to their intended bytes
function fix_arabic_hardcore($str) {
    $map = [
        'ظ…' => "\\xe3", 'ط´' => "\\xf4", 'ط±' => "\\xf1", 'ظˆ' => "\\xf8", 'ط¹' => "\\xf9",
        'ط§' => "\\xe1", 'ظ„' => "\\xe1", 'طµ' => "\\xf5", 'ط¬' => "\\xec", 'ط©' => "\\xe9",
        'ط³' => "\\xf3", 'ظƒ' => "\\xf3", 'ظ†' => "\\xed", 'ظٹ' => "\\xed", 'ط®' => "\\xee",
        'ط¨' => "\\xe2", 'طھ' => "\\xea"
    ];
    // This is still just a guess.
    return $str;
}

// WAIT! I found the EXACT fix for "ظ…ط´ط±ظˆط¹":
// It is UTF-8 bytes interpreted as CP1252, then converted to UTF-8.
// To reverse it, we MUST use a byte-safe way.

function reverse_mojibake($str) {
    $out = "";
    $i = 0;
    $len = strlen($str);
    while ($i < $len) {
        $c = ord($str[$i]);
        if ($c == 0xC3) {
            $i++;
            $out .= chr(ord($str[$i]) + 64);
        } else if ($c == 0xC2) {
            $i++;
            $out .= chr(ord($str[$i]));
        } else {
            $out .= $str[$i];
        }
        $i++;
    }
    return $out;
}

$id = 4;
$str = \\DB::table('projects')->where('id', $id)->value('name');
echo "ORIGINAL: $str\\n";
echo "REVERSED: " . reverse_mojibake($str) . "\\n";

$id2 = 5;
$str2 = \\DB::table('projects')->where('id', $id2)->value('name');
echo "ORIGINAL 2: $str2\\n";
echo "REVERSED 2: " . reverse_mojibake($str2) . "\\n";
`;
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        const remoteFile = `${appDir}/fix_encoding_final_attempt.php`;
        const stream = sftp.createWriteStream(remoteFile);
        stream.write(phpCode);
        stream.end(() => {
            conn.exec(`cd ${appDir} && ${php} fix_encoding_final_attempt.php`, (err, stream) => {
                stream.on('data', d => process.stdout.write(d));
                stream.on('close', () => conn.end());
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
