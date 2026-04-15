import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();
const PAT = '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';
const repoUrl = `https://Abdulwahed-alhallak:${PAT}@github.com/Abdulwahed-alhallak/nobel.dion.sy.git`;
const PHP = '/opt/alt/php82/usr/bin/php';

const deployCommands = `
echo "--- 1. UPDATING CODE VIA GIT ---" &&
cd domains/noble.dion.sy/public_html &&
git fetch origin main &&
git reset --hard origin/main &&
echo "--- 2. EXTRACTING FRONTEND ASSETS ---" &&
tar -xzf ~/noble_production_ecosystem.tar.gz -C . &&
echo "--- 3. INSTALLING DEPENDENCIES (WITH PHP 8.2 FORCED) ---" &&
${PHP} /usr/local/bin/composer update --no-interaction -o &&
echo "--- 4. MIGRATING DATABASE ---" &&
${PHP} artisan migrate --force &&
echo "--- 5. CLEARING CACHES ---" &&
${PHP} artisan optimize:clear &&
echo "--- 6. EXECUTING NOBLE RESTRUCTURE SCRIPT ---" &&
/opt/alt/php82/usr/bin/php artisan noble:restructure-users &&
echo "--- 7. REBUILDING UNLIMITED MASTER PLAN & HRM MERGE ---" &&
/opt/alt/php82/usr/bin/php _scripts/rebuild_plans.php &&
echo "--- 8. CONFIGURING SMTP DEFAULTS & GLOBAL ALIGNMENT ---" &&
/opt/alt/php82/usr/bin/php _scripts/setup_smtp.php &&
echo "--- 9. EXECUTING DISASTER RECOVERY BACKUP ---" &&
/opt/alt/php82/usr/bin/php _scripts/hostinger_backup.php &&
echo "--- 10. VERIFYING DB CONNECTION & SYMLINKS ---" &&
${PHP} artisan db:show &&
${PHP} artisan storage:link
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Force-deploying updates...');
    conn.exec(deployCommands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`Deployment Finished with Code: ${code}`);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).connect(CONFIG.SSH);

