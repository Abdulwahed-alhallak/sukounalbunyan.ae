#!/usr/bin/env node
/**
 * Check Deployment Status on Hostinger
 * Verifies that all files are properly deployed and accessible
 */

const { Client: SSHClient } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');

async function checkDeployment() {
    return new Promise((resolve, reject) => {
        const conn = new SSHClient();

        conn.on('ready', () => {
            console.log('🔍 Checking deployment status on Hostinger...\n');

            // Check if main files exist
            const checks = [
                'ls -la public/index.php',
                'ls -la public/build/',
                'ls -la public/sw.js',
                'ls -la artisan',
                'ls -la composer.json',
                'ls -la package.json',
                'ls -la .env',
                'php artisan --version',
                'php artisan config:cache --no-interaction',
                'ls -la storage/app/',
                'ls -la storage/logs/',
                'ls -la bootstrap/cache/'
            ];

            let completed = 0;
            const total = checks.length;

            checks.forEach((cmd, index) => {
                conn.exec(cmd, (err, stream) => {
                    if (err) {
                        console.error(`❌ Command failed: ${cmd}`);
                        console.error(err.message);
                        return;
                    }

                    console.log(`🔍 Checking: ${cmd}`);
                    stream.on('close', (code) => {
                        if (code === 0) {
                            console.log(`✅ ${cmd} - OK`);
                        } else {
                            console.log(`⚠️  ${cmd} - Code: ${code}`);
                        }
                        completed++;
                        if (completed === total) {
                            console.log('\n🎉 Deployment check completed!');
                            conn.end();
                            resolve();
                        }
                    }).on('data', (data) => {
                        // Optional: log output for debugging
                        // process.stdout.write(data);
                    }).stderr.on('data', (data) => {
                        // Optional: log errors for debugging
                        // process.stderr.write(data);
                    });
                });
            });
        }).on('error', (err) => {
            console.error('❌ SSH Connection failed:', err.message);
            reject(err);
        }).connect(CONFIG.SSH);
    });
}

checkDeployment().catch(console.error);
