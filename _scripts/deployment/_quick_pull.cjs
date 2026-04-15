const { Client } = require('ssh2');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');

const conn = new Client();
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

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
}).connect(CONFIG.SSH);
