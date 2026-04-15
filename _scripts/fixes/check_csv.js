import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const config = {
    host: CONFIG.SSH.host,
    port: CONFIG.SSH.port,
    username: CONFIG.SSH.username,
    password: CONFIG.SSH.password,
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

