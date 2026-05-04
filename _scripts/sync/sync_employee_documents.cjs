/**
 * Sukoun Albunyan - Gold Master v1.1
 * Total Document & Employee Data Synchronization
 * 
 * Strategy: Local PHP Generation + Remote Execution
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');

const CSV_PATH = path.join(__dirname, '../../docs/Archive/nobel Employee S Data.csv');

// Lightweight CSV Parser
function parseCSV(content) {
    const lines = content.split(/\r?\n/);
    if (lines.length === 0) return [];
    
    let headerLine = lines[0].replace(/^\uFEFF/, ''); // Remove BOM
    const headers = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const cleanHeaders = headers.map(h => h.replace(/^"|"$/g, '').trim());

    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        cleanHeaders.forEach((h, i) => {
            let val = values[i] || '';
            obj[h] = val.replace(/^"|"$/g, '').trim();
        });
        return obj;
    }).filter(r => r.Name || r['Application ID']);
}

const conn = new Client();

const uploadFile = (localPath, remotePath) => {
    return new Promise((resolve, reject) => {
        conn.sftp((err, sftp) => {
            if (err) reject(err);
            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) reject(err);
                resolve();
            });
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
    console.log('🚀 Starting Platinum Document Synchronization (v1.1) via PHP Upload...');

    try {
        const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parseCSV(csvContent);
        console.log(`📊 Loaded ${records.length} records from CSV.`);

        // Generate PHP Script Content
        let phpCode = '<?php\n\n';
        phpCode += "require __DIR__.'/vendor/autoload.php';\n";
        phpCode += "$app = require_once __DIR__.'/bootstrap/app.php';\n";
        phpCode += "$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();\n\n";
        phpCode += "$admin = \\App\\Models\\User::whereIn('type', ['super admin', 'company'])->first();\n";
        phpCode += "$adminId = $admin ? $admin->id : 1;\n";
        phpCode += 'echo "STARTING_METADATA_SETUP for Admin ID: $adminId\\n";\n';
        
        // Setup Metadata Categories
        phpCode += `$cats = ['Personal Identification', 'Employment Documents', 'Medical & Insurance', 'Licensing & Certificates', 'Financial Documents'];\n`;
        phpCode += `foreach($cats as $c) { \\Noble\\Hrm\\Models\\DocumentCategory::updateOrCreate(['document_type' => $c, 'created_by' => $adminId], ['creator_id' => $adminId, 'status' => 1]); }\n`;
        
        // Setup Metadata Types
        phpCode += `$types = [['Iqama / National ID', 1], ['Passport', 1], ['Employment Contract', 1], ['Health Insurance Card', 1], ['GOSI Certificate', 0], ['Muqeem Print', 0], ['Academic Degree', 1], ['Driving License', 0], ['Chamber of Commerce Authentication', 0]];\n`;
        phpCode += `foreach($types as $t) { \\Noble\\Hrm\\Models\\EmployeeDocumentType::updateOrCreate(['document_name' => $t[0], 'created_by' => $adminId], ['is_required' => $t[1], 'creator_id' => $adminId]); }\n`;

        phpCode += 'echo "STARTING_EMPLOYEE_SYNC\\n";\n';

        for (const record of records) {
            const appId = record['Application ID'] || record['﻿Application ID'] || record['Application ID'];
            const name = record['Name'];
            const iqamaNo = record['ID/Iqama No.'];
            const passportNo = record['Passport No.'];
            
            if (!name && !appId) continue;

            const parseDate = (val) => {
                if (!val || val.toLowerCase() === 'n/a' || val.trim() === '' || val === '#N/A') return 'null';
                return "'" + val.trim() + "'";
            };

            const salary = (parseFloat((record['Total Salary'] || '0').replace(/[^0-9.]/g, ''))) || 0;

            phpCode += `
try {
    $user = \\App\\Models\\User::where('name', '${name.replace(/'/g, "\\'")}')->first();
    $employee = null;
    if ($user) {
        $employee = \\Noble\\Hrm\\Models\\Employee::where('user_id', $user->id)->first();
    }

    if (!$employee && !empty('${appId}')) {
        $employee = \\Noble\\Hrm\\Models\\Employee::where('application_id', '${appId}')->first();
    }

    if ($employee) {
        $employee->update([
            'iqama_no' => '${iqamaNo}',
            'passport_no' => '${passportNo}',
            'iqama_issue_date' => ${parseDate(record['Iqama Issue Date'])},
            'iqama_expiry_date' => ${parseDate(record['Iqama Expiry Date'])},
            'passport_expiry_date' => ${parseDate(record['Passport Expiry Date'])},
            'date_of_joining' => ${parseDate(record['Joining Date'])},
            'gosi_joining_date' => ${parseDate(record['تاريخ الإلتحاق حسب التامينات'])},
            'insurance_status' => '${record['Insurance Status'] || ''}',
            'insurance_class' => '${record['Insurance Class'] || ''}',
            'sponsor_id' => '${record['Sponsor ID'] || ''}',
            'basic_salary' => ${salary}
        ]);
        echo "SYNCED: ${name}\\n";
    } else {
        echo "NOT_FOUND: ${name} (${appId})\\n";
    }
} catch (\\Exception $e) {
    echo "ERROR: ${name} - " . $e->getMessage() . "\\n";
}
`;
        }

        const localTmpPath = path.join(__dirname, 'maintenance_sync.php');
        fs.writeFileSync(localTmpPath, phpCode);

        console.log('📤 Uploading synchronization script to production...');
        const remotePath = `${CONFIG.APP_DIR}/maintenance_sync.php`;
        await uploadFile(localTmpPath, remotePath);

        console.log('⚡ Executing synchronization via standard PHP...');
        const syncResult = await runCommand(`cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} maintenance_sync.php`);
        
        console.log('\n--- SYNC OUTPUT ---');
        console.log(syncResult);
        console.log('--- END OUTPUT ---\n');

        console.log('✨ Cleanup: Removing temporary sync file...');
        await runCommand(`rm ${remotePath}`);
        fs.unlinkSync(localTmpPath);

        console.log('✅ Platinum Document Synchronization Complete.');
        conn.end();
    } catch (e) {
        console.error('❌ Fatal Sync Error:', e);
        conn.end();
    }
}).connect(CONFIG.SSH);
