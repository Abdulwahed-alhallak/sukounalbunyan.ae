const { Client } = require('ssh2');
const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};
const conn = new Client();
conn.on('ready', () => {
    console.log('SSH Connected! Creating index.php in root...');
    conn.exec('echo "<?php header(\\"Location: /backend/\\"); exit;" > domains/sukounalbunyan.ae/public_html/index.php', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            conn.end();
            console.log('Redirect created.');
        });
    });
}).connect(config);
