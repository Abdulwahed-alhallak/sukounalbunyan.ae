import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('ls domains/noble.dion.sy/public_html/public/sw.js domains/noble.dion.sy/public_html/public/manifest.json', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
