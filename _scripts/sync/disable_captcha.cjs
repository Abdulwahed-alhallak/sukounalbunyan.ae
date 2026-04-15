const { Client } = require('ssh2');

const config = {
    host: CONFIG.SSH.host,
    port: CONFIG.SSH.port,
    username: 'u256167180',
    password: '${CONFIG.DB.password}',
    readyTimeout: 60000
};

const conn = new Client();
conn.on('ready', () => {
    console.log('Connected to Production.');
    
    // Command to disable recaptcha in database
    const tinkerCmd = `
        /opt/alt/php82/usr/bin/php domains/noble.dion.sy/public_html/artisan tinker --execute="
            \\\\App\\\\Models\\\\Utility::setSetting('recaptcha_enabled', 'off');
            echo 'SUCCESS_RECAPTCHA_OFF';
        "
    `.trim();

    conn.exec(tinkerCmd, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d));
        stream.on('close', (code) => {
            console.log(`\nCommand Finished. Exit: ${code}`);
            conn.end();
            process.exit(0);
        });
    });
}).on('error', console.error).connect(config);

