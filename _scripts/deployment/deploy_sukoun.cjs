const { Client } = require('ssh2');

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
};

const PAT = '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';
const repoUrl = `https://Abdulwahed-alhallak:${PAT}@github.com/Abdulwahed-alhallak/sukounalbunyan.ae.git`;
const remotePath = 'domains/sukounalbunyan.ae/public_html/backend';

// Break deployment into small steps to avoid SSH timeouts
const steps = [
    {
        name: '1. Fix directory permissions',
        cmd: `chmod 755 ${remotePath} && cd ${remotePath} && chmod 755 . && echo "Permissions fixed"`
    },
    {
        name: '2. Initialize git repo',
        cmd: `cd ${remotePath} && if [ ! -d ".git" ]; then git init && git remote add origin ${repoUrl} && echo "Git initialized"; else git remote set-url origin ${repoUrl} && echo "Git remote updated"; fi`
    },
    {
        name: '3. Fetch from GitHub',
        cmd: `cd ${remotePath} && git fetch origin master && echo "Fetch complete"`
    },
    {
        name: '4. Reset to latest code',
        cmd: `cd ${remotePath} && git reset --hard origin/master && echo "Reset complete"`
    },
    {
        name: '4.5 Install dependencies',
        cmd: `cd ${remotePath} && rm -f bootstrap/cache/*.php && /opt/alt/php82/usr/bin/php /usr/local/bin/composer install --no-dev --optimize-autoloader && echo "Composer done"`
    },
    {
        name: '5. Clear caches',
        cmd: `cd ${remotePath} && /opt/alt/php82/usr/bin/php artisan optimize:clear && echo "Caches cleared"`
    },
    {
        name: '6. Run migrations',
        cmd: `cd ${remotePath} && /opt/alt/php82/usr/bin/php artisan migrate --force && echo "Migrations done"`
    },
    {
        name: '7. Cache config & routes',
        cmd: `cd ${remotePath} && /opt/alt/php82/usr/bin/php artisan config:cache && /opt/alt/php82/usr/bin/php artisan route:cache && /opt/alt/php82/usr/bin/php artisan view:cache && echo "Caching done"`
    },
    {
        name: '8. Verify',
        cmd: `cd ${remotePath} && /opt/alt/php82/usr/bin/php artisan --version && echo "✅ Deployment Complete!"`
    }
];

function runStep(stepIndex) {
    if (stepIndex >= steps.length) {
        console.log('\n🎉 ALL DEPLOYMENT STEPS COMPLETED SUCCESSFULLY!');
        return;
    }

    const step = steps[stepIndex];
    console.log(`\n--- ${step.name} ---`);

    const conn = new Client();
    conn.on('ready', () => {
        conn.exec(step.cmd, { pty: false }, (err, stream) => {
            if (err) {
                console.error(`Error executing step: ${err.message}`);
                conn.end();
                return;
            }
            let output = '';
            stream.on('close', (code) => {
                if (code === 0) {
                    console.log(`✓ Step ${stepIndex + 1} succeeded`);
                    conn.end();
                    // Run next step after a small delay
                    setTimeout(() => runStep(stepIndex + 1), 500);
                } else {
                    console.error(`✗ Step ${stepIndex + 1} FAILED (exit code ${code})`);
                    console.error('Output:', output);
                    conn.end();
                }
            }).on('data', (data) => {
                output += data.toString();
                process.stdout.write(data);
            }).stderr.on('data', (data) => {
                output += data.toString();
                process.stderr.write(data);
            });
        });
    }).on('error', (err) => {
        console.error(`Connection error at step ${stepIndex + 1}: ${err.message}`);
    }).connect(config);
}

console.log(`🚀 Deploying to ${remotePath}...`);
runStep(0);
