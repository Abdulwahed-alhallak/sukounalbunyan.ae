import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
    conn.exec('ls -la domains/noble.dion.sy && echo "---" && ls -la domains/noble.dion.sy/public_html', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT:\n' + data);
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
