import { Client } from 'ssh2';

const conn = new Client();
const PAT = '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';
const repoUrl = `https://Abdulwahed-alhallak:${PAT}@github.com/Abdulwahed-alhallak/nobel.dion.sy.git`;
const PHP = '/opt/alt/php82/usr/bin/php';

const deployCommands = `
cd domains/noble.dion.sy/public_html &&
git fetch origin main &&
git reset --hard origin/main &&
echo "--- 1. INSTALLING DEPENDENCIES (WITH PHP 8.2 FORCED) ---" &&
${PHP} /usr/local/bin/composer update --no-interaction -o &&
echo "--- 2. MIGRATING DATABASE ---" &&
${PHP} artisan migrate --force &&
echo "--- 3. CLEARING CACHES ---" &&
${PHP} artisan optimize:clear &&
echo "--- 4. EXECUTING NOBLE RESTRUCTURE SCRIPT ---" &&
/opt/alt/php82/usr/bin/php artisan noble:restructure-users &&
echo "--- 5. REBUILDING UNLIMITED MASTER PLAN & HRM MERGE ---" &&
/opt/alt/php82/usr/bin/php _scripts/rebuild_plans.php &&
echo "--- 6. CONFIGURING SMTP DEFAULTS & GLOBAL ALIGNMENT ---" &&
/opt/alt/php82/usr/bin/php _scripts/setup_smtp.php &&
echo "--- 7. VERIFYING DB CONNECTION ---" &&
${PHP} artisan db:show
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
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
