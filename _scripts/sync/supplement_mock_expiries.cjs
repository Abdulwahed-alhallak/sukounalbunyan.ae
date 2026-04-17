const { Client } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const uploadFile = (localPath, remotePath) => {
    return new Promise((resolve, reject) => {
        conn.sftp((err, sftp) => {
            if (err) reject(err);
            sftp.fastPut(localPath, remotePath, resolve);
        });
    });
};

const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) reject(err);
            let output = '';
            stream.on('data', (d) => output += d);
            stream.on('close', () => resolve(output));
        });
    });
};

conn.on('ready', async () => {
    console.log('🚀 Supplementing Gold Master Data: Generating mock expiry dates for UI demonstration...');

    let phpCode = '<?php\n\n';
    phpCode += "require __DIR__.'/vendor/autoload.php';\n";
    phpCode += "$app = require_once __DIR__.'/bootstrap/app.php';\n";
    phpCode += "$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();\n\n";
    
    phpCode += `
$employees = \\Noble\\Hrm\\Models\\Employee::get();
$count = 0;
foreach($employees as $index => $emp) {
    if (!$emp->iqama_expiry_date) {
        $addDays = rand(10, 100);
        if ($index % 5 == 0) { // 20% expire within 60 days
            $addDays = rand(5, 55);
        } else {
            $addDays = rand(65, 300);
        }
        $emp->iqama_expiry_date = now()->addDays($addDays);
    }
    if (!$emp->passport_expiry_date) {
        $addDays = rand(10, 100);
        if ($index % 4 == 0) { // 25% expire within 60 days
            $addDays = rand(5, 55);
        } else {
            $addDays = rand(65, 300);
        }
        $emp->passport_expiry_date = now()->addDays($addDays);
    }
    if (!$emp->iqama_issue_date) {
        $emp->iqama_issue_date = now()->subDays(rand(100, 400));
    }
    
    // Safety check just in case bank details were missing
    if (!$emp->bank_name) $emp->bank_name = 'Al Rajhi Bank';
    if (!$emp->bank_iban) $emp->bank_iban = 'SA' . rand(10, 99) . '8000' . rand(1000, 9999) . rand(1000, 9999);
    
    $emp->save();
    $count++;
}
echo "Populated mock expiry dates for $count employees!\\n";
`;

    const localTmpPath = path.join(__dirname, 'mock_expiries.php');
    fs.writeFileSync(localTmpPath, phpCode);

    try {
        const remotePath = `${CONFIG.APP_DIR}/mock_expiries.php`;
        await uploadFile(localTmpPath, remotePath);

        console.log('⚡ Executing date generation script...');
        const result = await runCommand(`cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} mock_expiries.php`);
        console.log(result);

        await runCommand(`rm ${remotePath}`);
        fs.unlinkSync(localTmpPath);
        console.log('✅ UI demonstration data successfully synchronized.');
    } catch (e) {
        console.error(e);
    } finally {
        conn.end();
    }
}).connect(CONFIG.SSH);
