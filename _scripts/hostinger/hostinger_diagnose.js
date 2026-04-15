import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

// Load database credentials from CONFIG (loaded from .env.production)
const DB_HOST = CONFIG.DB.host;
const DB_USER = CONFIG.DB.username;
const DB_PASS = CONFIG.DB.password;
const DB_NAME = CONFIG.DB.database;

const conn = new Client();

conn.on('ready', () => {
    console.log('SSH Connected. Full Production Diagnostics...');
    
    const commands = [
        'cd domains/noble.dion.sy/public_html',
        'echo "=== CURRENT .env DB settings ==="',
        'grep -E "^(DB_|APP_)" .env',
        'echo "=== Testing DB Connection ==="',
        `/opt/alt/php82/usr/bin/php -r "try { $pdo = new PDO('mysql:host=127.0.0.1;dbname=${DB_NAME}', '${DB_USER}', '${DB_PASS}'); echo 'LOCAL OK'; } catch(Exception $e) { echo 'LOCAL FAIL: '.$e->getMessage(); }"`,
        'echo ""',
        `/opt/alt/php82/usr/bin/php -r "try { $pdo = new PDO('mysql:host=localhost;dbname=${DB_NAME}', '${DB_USER}', '${DB_PASS}'); echo 'LOCALHOST OK'; } catch(Exception $e) { echo 'LOCALHOST FAIL: '.$e->getMessage(); }"`,
        'echo ""', 
        `/opt/alt/php82/usr/bin/php -r "try { $pdo = new PDO('mysql:host=srv1142.hstgr.io;dbname=${DB_NAME}', '${DB_USER}', '${DB_PASS}'); echo 'REMOTE OK'; } catch(Exception $e) { echo 'REMOTE FAIL: '.$e->getMessage(); }"`,
        'echo ""',
        'echo "=== Config Cache DB Host ==="',
        'grep "srv1142\\|127.0.0.1\\|localhost" bootstrap/cache/config.php 2>/dev/null | head -3 || echo "No config cache"',
        'echo "=== Checking storage permissions ==="',
        'ls -la storage/framework/sessions/ | head -3',
        'echo "=== PHP Error ==="',
        '/opt/alt/php82/usr/bin/php -d display_errors=1 -r "require \'vendor/autoload.php\'; \\$app = require \'bootstrap/app.php\'; \\$kernel = \\$app->make(Illuminate\\Contracts\\Http\\Kernel::class); echo \'Kernel OK\';" 2>&1 | tail -10',
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
            console.log(`\nDiagnostics Done: exit ${code}`);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect(CONFIG.SSH);

