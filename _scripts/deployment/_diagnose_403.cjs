const { Client } = require('ssh2');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');
const conn = new Client();
const APP = CONFIG.APP_DIR;
const PHP = CONFIG.PHP;

const COMMANDS = [
    // Check permissions
    `ls -la ${APP}/.htaccess`,
    `ls -la ${APP}/public/index.php`,
    `stat -c "%a %U %G" ${APP}/public/index.php`,
    `stat -c "%a %U %G" ${APP}/public/`,
    // Check if there's a directory index issue - root URL hits directory listing
    `ls -la ${APP}/index.php 2>&1`,
    // Check error logs
    `tail -20 /home/u256167180/domains/noble.dion.sy/logs/error.log 2>/dev/null || echo "No error.log"`,
    // Check Apache error logs  
    `tail -10 /home/u256167180/logs/noble.dion.sy.error.log 2>/dev/null || echo "No site error log"`,
    // Full htaccess content
    `cat ${APP}/.htaccess`,
    // Try direct PHP test
    `${PHP} ${APP}/public/index.php 2>&1 | head -5`,
    // Check if mod_rewrite is even enabled
    `apache2ctl -M 2>/dev/null | grep rewrite || echo "Cannot check modules"`,
];

conn.on('ready', () => {
    console.log('Connected. Diagnosing 403...\n');
    let i = 0;
    function next() {
        if (i >= COMMANDS.length) { conn.end(); return; }
        const cmd = COMMANDS[i++];
        console.log(`\n>>> ${cmd.substring(0, 90)}`);
        conn.exec(cmd, (err, stream) => {
            if (err) { console.error(err); next(); return; }
            let out = '';
            stream.on('data', (d) => out += d.toString());
            stream.stderr.on('data', (d) => out += d.toString());
            stream.on('close', () => { console.log(out.trim()); next(); });
        });
    }
    next();
}).connect(CONFIG.SSH);
