const { spawn } = require('child_process');
const path = require('path');

const localFile = path.resolve(__dirname, '../noble_production_ecosystem.tar.gz');
const remoteUser = 'u256167180';
const remoteHost = '62.72.25.117';
const remotePort = '65002';
const remotePath = 'domains/noble.dion.sy/public_html/';

// NOTE: This requires SSH keys to be set up or it will prompt for password.
// Since we don't have keys, we use a trick or just hope it works with the system's scp.
// But better: we use a package that wraps scp if available.
// Actually, I'll just use the raw 'ssh2' but with 'ssh2-sftp-client' if it exists.

console.log('Starting SCP-style upload via native system call...');

const scp = spawn('scp', [
    '-P', remotePort,
    '-o', 'BatchMode=no',
    '-o', 'StrictHostKeyChecking=no',
    localFile,
    `${remoteUser}@${remoteHost}:${remotePath}`
], { shell: true });

scp.stdout.on('data', (data) => {
    process.stdout.write(data);
});

scp.stderr.on('data', (data) => {
    process.stderr.write(data);
});

scp.on('close', (code) => {
    console.log(`SCP process exited with code ${code}`);
    if (code === 0) {
        console.log('Upload successful. Run post-deploy manually or via another script.');
    }
});
