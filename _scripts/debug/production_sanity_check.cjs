const { execSync } = require('child_process');
const https = require('https');
const { Client } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');

console.log('===================================================');
console.log('🔍 NOBLE ARCHITECTURE - PRODUCTION SANITY CHECK');
console.log('===================================================\n');

async function checkUrl(url) {
    return new Promise((resolve) => {
        console.log(`📡 Checking ${url}...`);
        https.get(url, (res) => {
            console.log(`   Result: ${res.statusCode} ${res.statusMessage}`);
            resolve(res.statusCode);
        }).on('error', (err) => {
            console.error(`   Error: ${err.message}`);
            resolve(0);
        });
    });
}

const conn = new Client();
conn.on('ready', async () => {
    try {
        console.log('✅ SSH Connected for internal audit.');

        // 1. Check if manifest exists and is readable
        const manifestPath = `${CONFIG.APP_DIR}/public/build/manifest.json`;
        console.log(`\n📄 Verifying manifest: ${manifestPath}`);
        conn.exec(`cat ${manifestPath}`, (err, stream) => {
            if (err) throw err;
            let data = '';
            stream.on('data', d => data += d);
            stream.on('close', async () => {
                if (data.includes('"file":')) {
                    console.log('   ✅ Manifest is valid and contains build entries.');
                } else {
                    console.error('   ❌ Manifest is invalid or empty!');
                }

                // 2. Check 133-employee count
                console.log('\n👥 Verifying Employee Count (Target: 133)...');
                const php = CONFIG.PHP;
                conn.exec(`cd ${CONFIG.APP_DIR} && ${php} artisan tinker --execute="echo \\App\\Models\\User::count();"`, (err, stream) => {
                    let count = '';
                    stream.on('data', d => count += d);
                    stream.on('close', async () => {
                        console.log(`   Current User Count: ${count.trim()}`);
                        
                        // 3. Final URL Check
                        await checkUrl('https://noble.dion.sy/login');
                        
                        console.log('\n===================================================');
                        console.log('✅ AUDIT COMPLETE');
                        console.log('===================================================');
                        conn.end();
                    });
                });
            });
        });
    } catch (e) {
        console.error('❌ Audit Failed:', e);
        conn.end();
    }
}).connect(CONFIG.SSH);
