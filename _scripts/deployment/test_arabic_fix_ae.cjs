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
    const tinkerCmd = `
        $str = DB::table('projects')->where('id', 4)->value('name');
        echo "RAW: $str\\n";
        
        // This is a common fix for Arabic mojibake in MySQL
        function fixArabic($text) {
            $map = [
                'ط§' => 'ا', 'ط¨' => 'ب', 'ط©' => 'ة', 'طھ' => 'ت', 'ط«' => 'ث', 'ط¬' => 'ج', 'ط' => 'ح', 'ط®' => 'خ',
                'ط¯' => 'د', 'ط°' => 'ذ', 'ط±' => 'ر', 'ط²' => 'ز', 'ط³' => 'س', 'ط´' => 'ش', 'طµ' => 'ص', 'ط¶' => 'ض',
                'ط·' => 'ط', 'ط¸' => 'ظ', 'ط¹' => 'ع', 'ط؛' => 'غ', 'ظپ' => 'ف', 'ظ‚' => 'ق', 'ظƒ' => 'ك', 'ظ„' => 'ل',
                'ظ…' => 'م', 'ظ†' => 'ن', 'ظ‡' => 'ه', 'ظˆ' => 'و', 'ظٹ' => 'ي'
            ];
            // This is just a partial map, better to use the encoding logic
            return $text;
        }

        // Try the encoding reverse logic
        $fixed = mb_convert_encoding($str, "Windows-1252", "UTF-8");
        echo "FIXED_MB: " . $fixed . "\\n";
        
        $fixed_iconv = iconv("UTF-8", "Windows-1252//IGNORE", $str);
        echo "FIXED_ICONV: " . $fixed_iconv . "\\n";
    `;
    
    conn.exec(`cd ${appDir} && ${php} artisan tinker --execute='${tinkerCmd.replace(/'/g, "'\\''").replace(/\n/g, ' ')}'`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => {
    console.error('❌ SSH Error:', err.message);
}).connect(config);
