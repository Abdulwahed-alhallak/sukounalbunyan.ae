import { Client } from 'ssh2';

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 60000
};

const conn = new Client();
conn.on('ready', () => {
    conn.exec('ls -la domains/noble.dion.sy/public_html/_scripts/nobel\\ Employee\\ S\\ Data.csv', (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d));
        stream.on('close', () => {
            conn.end();
            process.exit(0);
        });
    });
}).connect(config);
