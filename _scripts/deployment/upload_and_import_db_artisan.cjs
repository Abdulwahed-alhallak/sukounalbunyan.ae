const { Client } = require('ssh2');
const fs = require('fs');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');
const SSH_CONFIG = CONFIG.SSH;

const LOCAL_DUMP = 'C:\\\\Users\\\\DION-SERVER\\\\Desktop\\\\noble.dion.sy\\\\docs\\\\Archive\\\\nobel_db_backup_v1.0.sql';
const REMOTE_DUMP = '/home/u256167180/nobel_db_backup_v1.0.sql';
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

const conn = new Client();

function exec(conn, cmd) {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', code => resolve({out, code}));
        });
    });
}

conn.on('ready', async () => {
    console.log('✅ SSH Connected');
    
    // Upload SQL dump
    console.log('⬆️ Uploading database dump...');
    try {
        await new Promise((resolve, reject) => {
            conn.sftp((err, sftp) => {
                if (err) return reject(err);
                sftp.fastPut(LOCAL_DUMP, REMOTE_DUMP, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
        console.log('✅ Upload complete');
        
        // Wipe and Import using Artisan / Tinker for safety
        console.log('🔄 Wiping database via Artisan...');
        await exec(conn, `cd ${APP} && ${PHP} artisan db:wipe --force`);
        
        console.log('🔄 Importing SQL via Tinker...');
        const tinkerCmd = `
        $sql = file_get_contents('${REMOTE_DUMP}');
        DB::unprepared($sql);
        echo "Import DONE\\n";
        `;
        
        // Write tinker script
        await exec(conn, `echo "<?php require __DIR__.'/vendor/autoload.php'; \\$app = require_once __DIR__.'/bootstrap/app.php'; \\$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); DB::unprepared(file_get_contents('${REMOTE_DUMP}')); echo \\"SUCCESSFUL_IMPORT\\\\n\\";" > ${APP}/import_db.php`);
        
        let res = await exec(conn, `cd ${APP} && ${PHP} import_db.php`);
        console.log('Import Output:', res.out);
        
        // Clean up
        await exec(conn, `rm ${APP}/import_db.php`);
        
        // Verify
        let check = await exec(conn, `cd ${APP} && ${PHP} artisan tinker --execute="echo App\\Models\\User::count();"`);
        console.log('Users in production: ' + check.out);
        
        console.log('✅ Full database synchronization complete.');
        conn.end();
        
    } catch (e) {
        console.error('Error:', e);
        conn.end();
    }
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(SSH_CONFIG);
