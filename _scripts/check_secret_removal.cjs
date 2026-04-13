const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
    console.log('SSH Connected. Checking for "System Root" in build...');
    // -l just lists files
    conn.exec('grep -l -r "System Root" domains/noble.dion.sy/public_html/public/build/assets', (err, stream) => { 
        if (err) throw err;
        stream.on('data', (data) => {
            console.log('FOUND IN FILE:', data.toString().trim());
        });
        stream.on('close', (code) => {
            conn.end();
        }); 
    }); 
}).connect({ 
    host: '62.72.25.117', 
    port: 65002, 
    username: 'u256167180', 
    password: '4_m_XMkgux@.AgC' 
});
