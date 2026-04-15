const ftp = require("basic-ftp");
const path = require("path");

async function upload() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "62.72.25.117",
            user: "u256167180",
            password: "4_m_XMkgux@.AgC",
            secure: false
        });
        console.log("✅ FTP Connected!");
        
        const triggerPath = path.resolve(__dirname, "deploy_trigger.php");
        // For Hostinger, we often start in the root, need to go to public_html
        // We'll try common paths
        await client.uploadFrom(triggerPath, "domains/noble.dion.sy/public_html/deploy_trigger.php");
        console.log("✅ deploy_trigger.php uploaded!");

        const syncPath = path.resolve(__dirname, "public", "deploy_sync.php");
        await client.uploadFrom(syncPath, "domains/noble.dion.sy/public_html/public/deploy_sync.php");
        console.log("✅ public/deploy_sync.php uploaded!");
    }
    catch(err) {
        console.log("❌ FTP Error: " + err);
    }
    client.close();
}

upload();
