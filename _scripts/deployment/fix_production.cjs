const { Client } = require('ssh2');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const remotePath = 'domains/sukounalbunyan.ae/public_html/backend';

const commands = [
    `cd ${remotePath} && rm -f bootstrap/cache/packages.php bootstrap/cache/services.php bootstrap/cache/config.php`,
    `/opt/alt/php82/usr/bin/php ${remotePath}/artisan optimize:clear`,
    `/opt/alt/php82/usr/bin/php ${remotePath}/artisan config:cache`,
    `/opt/alt/php82/usr/bin/php ${remotePath}/artisan route:cache`,
    `echo "Production fixed! Debugbar artifacts removed."`
];

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connection Ready - Fixing Production Error...');
    let cmdIndex = 0;
    
    function runNext() {
        if (cmdIndex >= commands.length) {
            console.log('✨ SYSTEM RECOVERED SUCCESSFULLY!');
            conn.end();
            return;
        }
        
        const cmd = commands[cmdIndex];
        console.log(`Running: ${cmd}`);
        
        conn.exec(cmd, (err, stream) => {
            if (err) {
                console.error('Error:', err);
                conn.end();
                return;
            }
            stream.on('close', (code) => {
                console.log(`Command exited with code ${code}`);
                cmdIndex++;
                runNext();
            }).on('data', (data) => {
                process.stdout.write(data);
            }).stderr.on('data', (data) => {
                process.stderr.write(data);
            });
        });
    }
    
    runNext();
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);
