const { Client } = require('ssh2');
const conn = new Client();

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

const COMMANDS = [
    // Count users on production
    `cd ${APP} && ${PHP} artisan tinker --execute="echo 'Users: ' . App\\Models\\User::count();"`,
    // Check DB name
    `cd ${APP} && grep DB_DATABASE .env`,
    `cd ${APP} && grep DB_HOST .env`,
    // Check tables
    `cd ${APP} && ${PHP} artisan tinker --execute="echo 'Tables: ' . count(DB::select('SHOW TABLES'));"`,
    // Check Laravel version
    `cd ${APP} && ${PHP} artisan --version`,
    // Check git HEAD  
    `cd ${APP} && git log --oneline -1`,
    // Check build timestamp
    `ls -la ${APP}/public/build/manifest.json`,
];

conn.on('ready', () => {
    console.log('Connected.\n');
    let i = 0;
    function next() {
        if (i >= COMMANDS.length) { conn.end(); return; }
        const cmd = COMMANDS[i++];
        console.log(`> ${cmd.substring(0, 90)}`);
        conn.exec(cmd, (err, stream) => {
            if (err) { console.error(err); next(); return; }
            let out = '';
            stream.on('data', d => out += d.toString());
            stream.stderr.on('data', d => out += d.toString());
            stream.on('close', () => { console.log(`  ${out.trim()}\n`); next(); });
        });
    }
    next();
}).connect(CONFIG.SSH);
