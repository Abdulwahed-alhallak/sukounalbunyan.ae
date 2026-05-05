const chokidar = require('chokidar');
const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Load configurations
const CONFIG = require('./secureConfig.cjs');
const SSH_CONFIG = CONFIG.SSH;
const REMOTE_ROOT = CONFIG.APP_DIR;
const LOCAL_ROOT = path.join(__dirname, '..', '..');

console.log('===================================================');
console.log('☁️  Sukoun Albunyan - DIRECT CLOUD WATCHER ACTIVE');
console.log('===================================================\n');

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ Connected to Cloud Server via SSH/SFTP');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;

        console.log('👀 Watching for local changes...\n');

        const watcher = chokidar.watch([
            'app',
            'config',
            'routes',
            'resources',
            'packages',
            'database',
            '.env'
        ], {
            ignored: [/(^|[\/\\])\../, '**/node_modules/**', '**/vendor/**', '**/public/build/**'],
            persistent: true,
            cwd: LOCAL_ROOT
        });

        let isBuilding = false;
        let pendingBuild = false;

        async function syncFile(relPath) {
            const localPath = path.join(LOCAL_ROOT, relPath);
            const remotePath = path.join(REMOTE_ROOT, relPath.replace(/\\/g, '/'));
            
            console.log(`🚀 Syncing: ${relPath} -> ${remotePath}`);
            
            sftp.fastPut(localPath, remotePath, (err) => {
                if (err) {
                    console.error(`❌ Failed to sync ${relPath}:`, err.message);
                } else {
                    console.log(`✅ Synced: ${relPath}`);
                    
                    // If it's a backend file, clear remote cache
                    if (relPath.endsWith('.php') || relPath.includes('config/')) {
                         conn.exec(`cd ${REMOTE_ROOT} && ${CONFIG.PHP} artisan optimize:clear`, (err, stream) => {
                             if (!err) stream.on('close', () => console.log('   ⚡ Remote Cache Cleared'));
                         });
                    }
                }
            });
        }

        async function triggerBuild() {
            if (isBuilding) {
                pendingBuild = true;
                return;
            }

            isBuilding = true;
            console.log('\n📦 Frontend change detected. Starting Vite Build...');
            
            exec('npm run build', { cwd: LOCAL_ROOT }, (err, stdout, stderr) => {
                isBuilding = false;
                if (err) {
                    console.error('❌ Build failed:', stderr);
                } else {
                    console.log('✅ Build complete. Syncing assets...');
                    // Logic to sync public/build folder could be added here or just rely on manual full sync for large builds
                    // For now, we sync the specific modified resource file and assume the dev knows to run full sync for production assets
                    console.log('   💡 Tip: For large frontend changes, run node _scripts/deployment/auto_sync.cjs');
                }

                if (pendingBuild) {
                    pendingBuild = false;
                    triggerBuild();
                }
            });
        }

        watcher.on('change', (relPath) => {
            if (relPath.includes('resources/') || relPath.includes('packages/')) {
                // frontend trigger
                syncFile(relPath);
                triggerBuild();
            } else {
                // backend trigger
                syncFile(relPath);
            }
        });
    });
}).on('error', (err) => {
    console.error('❌ SSH Connection Error:', err.message);
}).connect(SSH_CONFIG);
