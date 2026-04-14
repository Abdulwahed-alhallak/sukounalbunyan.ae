const Client = require('ssh2').Client;
const fs = require('fs');

const conn = new Client();
const file = 'noble_production_ecosystem.tar.gz';
const remotePath = '/home/u256167180/noble_production_ecosystem.tar.gz';

console.log(`🚀 Starting Optimized SFTP Upload for ${file}...`);

conn.on('ready', () => {
    console.log('✅ SSH Connected. Starting fastPut...');
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        sftp.fastPut(file, remotePath, {
            step: (total_transferred, chunk, total) => {
                const percent = ((total_transferred / total) * 100).toFixed(2);
                if (total_transferred % (1024 * 1024) < chunk) {
                    console.log(`📦 Progress: ${percent}% (${(total_transferred / 1024 / 1024).toFixed(2)}MB / ${(total / 1024 / 1024).toFixed(2)}MB)`);
                }
            }
        }, (err) => {
            if (err) {
                console.error('❌ Upload Error:', err.message);
                conn.end();
                process.exit(1);
            }
            console.log('✅ Upload Successful via fastPut!');
            conn.end();
            process.exit(0);
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
