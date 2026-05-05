const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const remotePath = 'domains/sukounalbunyan.ae/public_html/backend';

const filesToUpload = [
    { local: path.join(__dirname, 'nobel_dump.sql'), remote: remotePath + '/nobel_dump.sql' },
    { local: path.join(__dirname, '_import_db.php'), remote: remotePath + '/_import_db.php' }
];

function uploadFiles(conn, callback) {
    conn.sftp((err, sftp) => {
        if (err) { console.error('SFTP error:', err); return; }
        
        let idx = 0;
        function next() {
            if (idx >= filesToUpload.length) { callback(); return; }
            const f = filesToUpload[idx++];
            const size = fs.statSync(f.local).size;
            console.log('   Uploading ' + path.basename(f.local) + ' (' + (size/1024/1024).toFixed(2) + ' MB)...');
            
            const rs = fs.createReadStream(f.local);
            const ws = sftp.createWriteStream(f.remote);
            ws.on('close', () => { console.log('   ✅ ' + path.basename(f.local) + ' uploaded.'); next(); });
            rs.pipe(ws);
        }
        next();
    });
}

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH connected.\n');
    
    // Step 1: Upload files
    console.log('📦 Step 1: Uploading files...');
    uploadFiles(conn, () => {
        console.log('\n🗄️  Step 2: Running import on server...');
        
        const cmd = 'cd ' + remotePath + ' && /opt/alt/php82/usr/bin/php _import_db.php && rm -f _import_db.php nobel_dump.sql';
        
        conn.exec(cmd, (err, stream) => {
            if (err) { console.error(err); conn.end(); return; }
            
            stream.on('close', (code) => {
                console.log('\n   Import exit code: ' + code);
                
                if (code === 0) {
                    console.log('\n🔄 Step 3: Rebuilding caches...');
                    const cacheCmd = 'cd ' + remotePath + ' && /opt/alt/php82/usr/bin/php artisan optimize:clear && /opt/alt/php82/usr/bin/php artisan config:cache && /opt/alt/php82/usr/bin/php artisan route:cache && /opt/alt/php82/usr/bin/php artisan view:cache';
                    
                    conn.exec(cacheCmd, (err, s2) => {
                        if (err) { console.error(err); conn.end(); return; }
                        s2.on('close', () => {
                            console.log('\n🎉 DATABASE FULLY SYNCED TO HOSTINGER!');
                            conn.end();
                        }).on('data', (d) => process.stdout.write(d))
                          .stderr.on('data', (d) => process.stderr.write(d));
                    });
                } else {
                    conn.end();
                }
            }).on('data', (d) => process.stdout.write(d))
              .stderr.on('data', (d) => process.stderr.write(d));
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err.message);
}).connect(config);
