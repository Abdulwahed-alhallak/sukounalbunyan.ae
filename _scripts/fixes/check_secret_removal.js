const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
    console.log('SSH Connected. Checking for "System Root" in build...');
    conn.exec('grep -r "System Root" domains/noble.dion.sy/public_html/public/build/assets', (err, stream) => { 
        if (err) throw err;
        let found = false;
        stream.on('data', (data) => {
            console.log('FOUND MATCH:', data.toString());
            found = true;
        });
        stream.on('close', (code) => {
            if (!found) console.log('CONFIRMED: "System Root" NOT FOUND in production assets.');
            else console.log('WARNING: "System Root" STILL EXISTS in production assets.');
            conn.end();
        }); 
    }); 
}).connect({ 
    host: '62.72.25.117', 
    port: 65002, 
    username: 'u256167180', 
    password: '4_m_XMkgux@.AgC' 
});
