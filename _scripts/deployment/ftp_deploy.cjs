/**
 * Noble Architecture — FTP Deploy + HTTP Trigger
 * Step 1: Upload deploy-hook.php via FTP (port 21 — usually NOT blocked)
 * Step 2: Call deploy-hook.php via HTTP to trigger git pull + artisan commands
 */
const ftp = require("basic-ftp");
const path = require("path");
const https = require("https");

const FTP_CONFIG = {
    host: "191.101.104.20",
    user: "u256167180",
    password: "4_m_XMkgux@.AgC",
    secure: false
};

const REMOTE_ROOT = "domains/noble.dion.sy/public_html";

async function uploadDeployHook() {
    console.log("▸ [1/2] Uploading deploy-hook.php via FTP...");
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    try {
        await client.access(FTP_CONFIG);
        console.log("  ✅ FTP Connected!");

        // Upload deploy-hook.php to public/
        const hookLocal = path.resolve(__dirname, "..", "..", "public", "deploy-hook.php");
        await client.uploadFrom(hookLocal, `${REMOTE_ROOT}/public/deploy-hook.php`);
        console.log("  ✅ deploy-hook.php uploaded to server\n");
        
    } catch (err) {
        console.error("  ❌ FTP Error:", err.message);
        throw err;
    } finally {
        client.close();
    }
}

function callDeployHook() {
    return new Promise((resolve, reject) => {
        console.log("▸ [2/2] Calling deploy-hook.php via HTTPS...");
        
        const url = "https://noble.dion.sy/deploy-hook.php?t=n0ble2026";
        
        const req = https.get(url, { rejectUnauthorized: false, timeout: 120000 }, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
                process.stdout.write(chunk.toString());
            });
            res.on('end', () => {
                if (data.includes('DEPLOY COMPLETE')) {
                    console.log('\n\n  ✅ Deployment completed successfully!');
                } else if (data.includes('Checking your browser')) {
                    console.log('\n\n  ⚠️ Hostinger WAF challenge detected — deploy-hook uploaded but HTTP trigger blocked.');
                    console.log('  📌 MANUAL STEP: Open this URL in your browser:');
                    console.log('     https://noble.dion.sy/deploy-hook.php?t=n0ble2026');
                } else {
                    console.log('\n\n  ⚠️ Unexpected response. Check output above.');
                }
                resolve(data);
            });
        });
        
        req.on('error', err => {
            console.log(`\n  ⚠️ HTTP Error: ${err.message}`);
            console.log('  📌 MANUAL STEP: Open this URL in your browser:');
            console.log('     https://noble.dion.sy/deploy-hook.php?t=n0ble2026');
            resolve('');
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log('\n  ⚠️ HTTP Timeout (2 min)');
            resolve('');
        });
    });
}

(async () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🏛️  NOBLE ARCHITECTURE — FTP DEPLOY');
    console.log('═══════════════════════════════════════════════════════\n');
    
    try {
        await uploadDeployHook();
        await callDeployHook();
    } catch (err) {
        console.error('\n❌ Fatal:', err.message);
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
})();
