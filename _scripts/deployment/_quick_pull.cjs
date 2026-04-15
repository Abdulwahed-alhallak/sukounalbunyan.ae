const { Client } = require('ssh2');

const conn = new Client();
const APP = '/home/u256167180/domains/noble.dion.sy/public_html';
const PHP = '/opt/alt/php82/usr/bin/php';

const COMMANDS = [
    `cd ${APP} && git pull origin master 2>&1 | tail -10`,
    `cd ${APP} && ${PHP} artisan optimize:clear 2>&1`,
    `cd ${APP} && ${PHP} artisan config:cache 2>&1`,
    `cd ${APP} && ${PHP} artisan route:cache 2>&1`,
    `echo "--- .htaccess check ---"`,
    `cat ${APP}/.htaccess | grep "public/index.php"`,
    `echo "--- HTTP Test ---"`,
    `curl -sk -o /dev/null -w "%{http_code}" https://noble.dion.sy/login`,
    `echo ""`,
    `echo "DONE"`,
];

conn.on('ready', () => {
    console.log('Connected.\n');
    let i = 0;
    function next() {
        if (i >= COMMANDS.length) { conn.end(); return; }
        const cmd = COMMANDS[i++];
        console.log(`> ${cmd.substring(0, 80)}`);
        conn.exec(cmd, (err, stream) => {
            if (err) { console.error(err); next(); return; }
            let out = '';
            stream.on('data', (d) => out += d.toString());
            stream.stderr.on('data', (d) => out += d.toString());
            stream.on('close', () => { console.log(out); next(); });
        });
    }
    next();
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
