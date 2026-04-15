const { Client } = require('ssh2');

// Load sensitive credentials from .env.production (NOT from hardcoded values)
const CONFIG = require('./secureConfig.js');

const SSH_CONFIG = CONFIG.SSH;
const PHP = CONFIG.PHP;
const APP_DIR = CONFIG.APP_DIR;

// Load GitHub PAT from environment (NOT from hardcoded values)
const PAT = process.env.GITHUB_PAT || 
    (() => {
        console.error('❌ ERROR: GITHUB_PAT environment variable not set');
        console.error('Set it using: $env:GITHUB_PAT = "your_token"');
        process.exit(1);
    })();

const COMMANDS = [
    `echo "═══════════════════════════════════════════════════"`,
    `echo "🚀 NOBLE ARCHITECTURE — FULL PRODUCTION SYNC"`,
    `echo "═══════════════════════════════════════════════════"`,
    `cd ${APP_DIR} && pwd`,
    
    // Step 1: Git pull latest from master
    `echo ""`,
    `echo "▸ [1/7] Git Pull from master..."`,
    `cd ${APP_DIR} && git fetch origin master && git reset --hard origin/master 2>&1 | tail -5`,
    
    // Step 2: Composer install (no-dev for production)
    `echo ""`,
    `echo "▸ [2/7] Composer install..."`,
    `cd ${APP_DIR} && ${PHP} /home/u256167180/bin/composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader 2>&1 | tail -5`,
    
    // Step 3: Run migrations
    `echo ""`, 
    `echo "▸ [3/7] Database migrations..."`,
    `cd ${APP_DIR} && ${PHP} artisan migrate --force 2>&1`,
    
    // Step 4: Storage link
    `echo ""`,
    `echo "▸ [4/7] Storage link..."`,
    `cd ${APP_DIR} && ${PHP} artisan storage:link 2>&1`,
    
    // Step 5: Clear all caches
    `echo ""`,
    `echo "▸ [5/7] Clear caches..."`,
    `cd ${APP_DIR} && ${PHP} artisan optimize:clear 2>&1`,
    
    // Step 6: Rebuild caches
    `echo ""`,
    `echo "▸ [6/7] Rebuild caches..."`,
    `cd ${APP_DIR} && ${PHP} artisan config:cache 2>&1`,
    `cd ${APP_DIR} && ${PHP} artisan route:cache 2>&1`,
    `cd ${APP_DIR} && ${PHP} artisan view:cache 2>&1`,
    
    // Step 7: Verify
    `echo ""`,
    `echo "▸ [7/7] Verification..."`,
    `cd ${APP_DIR} && ${PHP} artisan --version 2>&1`,
    `cd ${APP_DIR} && ls -la public/build/manifest.json 2>&1`,
    `curl -sk -o /dev/null -w "HTTP Status: %{http_code}" https://noble.dion.sy/login`,
    
    `echo ""`,
    `echo "═══════════════════════════════════════════════════"`,
    `echo "✅ DEPLOYMENT COMPLETE"`,
    `echo "═══════════════════════════════════════════════════"`,
];

console.log('🔗 Connecting to Hostinger SSH...');

const conn = new Client();
let cmdIndex = 0;

function runNextCommand(stream) {
    if (cmdIndex >= COMMANDS.length) {
        stream.end('exit\n');
        return;
    }
    const cmd = COMMANDS[cmdIndex];
    cmdIndex++;
    stream.write(cmd + '\n');
}

conn.on('ready', () => {
    console.log('✅ SSH Connected!\n');
    
    conn.shell((err, stream) => {
        if (err) throw err;
        
        let outputBuffer = '';
        
        stream.on('data', (data) => {
            const text = data.toString();
            outputBuffer += text;
            process.stdout.write(text);
            
            // After each command completes (shell prompt received), run next
            if (text.includes('$') || text.includes('#')) {
                setTimeout(() => runNextCommand(stream), 300);
            }
        });
        
        stream.on('close', () => {
            console.log('\n🔒 SSH Session Closed.');
            conn.end();
            process.exit(0);
        });
        
        // Start with the first command
        setTimeout(() => runNextCommand(stream), 1000);
    });
}).on('error', (err) => {
    console.error('❌ SSH Connection Error:', err.message);
    process.exit(1);
}).connect(SSH_CONFIG);

// Timeout after 5 minutes
setTimeout(() => {
    console.log('\n⏱️ Timeout reached. Closing connection...');
    conn.end();
    process.exit(1);
}, 300000);
