import { Client } from 'ssh2';

const CONFIG = require('../deployment/secureConfig.js');

const conn = new Client();
const PAT = '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';
const repoUrl = `https://Abdulwahed-alhallak:${PAT}@github.com/Abdulwahed-alhallak/nobel.dion.sy.git`;

const deployCommands = `
cd domains/noble.dion.sy/public_html &&
echo "--- 1. INITIALIZING GIT ---" &&
if [ ! -d ".git" ]; then
    git init && git remote add origin ${repoUrl}
else
    git remote set-url origin ${repoUrl}
fi &&
echo "--- 2. FETCHING FROM GITHUB ---" &&
git fetch origin master &&
git reset --hard origin/master &&
echo "--- 3. INSTALLING DEPENDENCIES ---" &&
composer install --no-dev --optimize-autoloader &&
echo "--- 4. MIGRATING DATABASE ---" &&
php artisan migrate --force &&
echo "--- 5. CLEARING CACHES ---" &&
php artisan optimize:clear &&
echo "--- 6. VERIFYING DB CONNECTION ---" &&
php artisan db:show
`;

conn.on('ready', () => {
    console.log('Hostinger SSH Connected. Starting Deployment...');
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

