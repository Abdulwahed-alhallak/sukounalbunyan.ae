const { Client } = require('ssh2');
const CONFIG = require('../_scripts/deployment/secureConfig.cjs');

const conn = new Client();

const runTinker = (code) => {
    return new Promise((resolve, reject) => {
        conn.exec(`cd ${CONFIG.APP_DIR} && ${CONFIG.PHP} artisan tinker --execute="${code.replace(/"/g, '\\"')}"`, (err, stream) => {
            if (err) reject(err);
            let output = '';
            stream.on('data', (d) => output += d);
            stream.on('close', () => resolve(output));
        });
    });
};

conn.on('ready', async () => {
    console.log('🚀 Setting up Document Metadata (Gold Master v1.1)...');
    
    try {
        const adminId = 1; // Standard admin creator ID

        const setupCode = `collect([['Personal Identification'],['Employment Documents'],['Medical & Insurance'],['Licensing & Certificates'],['Financial Documents']])->each(fn($c)=>\\Noble\\Hrm\\Models\\DocumentCategory::updateOrCreate(['document_type'=>$c[0],'created_by'=>${adminId}],['creator_id'=>${adminId},'status'=>1])); collect([['Iqama / National ID',true],['Passport',true],['Employment Contract',true],['Health Insurance Card',true],['GOSI Certificate',false],['Muqeem Print',false],['Academic Degree',true],['Driving License',false],['Chamber of Commerce Authentication',false]])->each(fn($t)=>\\Noble\\Hrm\\Models\\EmployeeDocumentType::updateOrCreate(['document_name'=>$t[0],'created_by'=>${adminId}],['is_required'=>$t[1],'creator_id'=>${adminId}])); echo \"DONE\";`;

        const result = await runTinker(setupCode);
        console.log('Result:', result);
        conn.end();
    } catch (e) {
        console.error('Error:', e);
        conn.end();
    }
}).connect(CONFIG.SSH);
