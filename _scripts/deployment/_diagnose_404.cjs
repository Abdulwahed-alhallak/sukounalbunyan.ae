const { Client } = require('ssh2');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.cjs');
const conn = new Client();

const COMMANDS = [
    // Check .htaccess in root
    `cat /home/u256167180/domains/noble.dion.sy/public_html/.htaccess 2>&1 | head -30`,
    // Check .htaccess in public/
    `cat /home/u256167180/domains/noble.dion.sy/public_html/public/.htaccess 2>&1 | head -30`,
    // Check directory structure
    `ls -la /home/u256167180/domains/noble.dion.sy/public_html/public/ | head -15`,
    // Check if index.php exists
    `ls -la /home/u256167180/domains/noble.dion.sy/public_html/public/index.php 2>&1`,
    // Check root index.php
    `ls -la /home/u256167180/domains/noble.dion.sy/public_html/index.php 2>&1`,
    // Check document root
    `cat /home/u256167180/domains/noble.dion.sy/public_html/.env | grep APP_URL 2>&1`,
    // Try running artisan route:list for login
    `/opt/alt/php82/usr/bin/php /home/u256167180/domains/noble.dion.sy/public_html/artisan route:list --name=login --columns=method,uri,name 2>&1`,
];

conn.on('ready', () => {
    console.log('Connected. Running diagnostics...\n');
    let cmdIdx = 0;
    
    function runCmd() {
        if (cmdIdx >= COMMANDS.length) {
            conn.end();
            return;
        }
        const cmd = COMMANDS[cmdIdx++];
        console.log(`>>> ${cmd.substring(0, 80)}...`);
        conn.exec(cmd, (err, stream) => {
            if (err) { console.error(err); runCmd(); return; }
            let out = '';
            stream.on('data', (d) => { out += d.toString(); });
            stream.stderr.on('data', (d) => { out += d.toString(); });
            stream.on('close', () => {
                console.log(out);
                runCmd();
            });
        });
    }
    runCmd();
}).connect(CONFIG.SSH);
