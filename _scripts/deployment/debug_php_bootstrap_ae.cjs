const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = { host: process.env.PRODUCTION_HOST, port: parseInt(process.env.PRODUCTION_PORT, 10), username: process.env.PRODUCTION_USERNAME, password: process.env.PRODUCTION_PASSWORD };
const appDir = process.env.PRODUCTION_APP_DIR;

const conn = new Client();
conn.on('ready', () => {
    const phpCode = `
    <?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    require 'vendor/autoload.php';
    $app = require_once 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\\\\Contracts\\\\Console\\\\Kernel::class);
    $kernel->bootstrap();
    echo "BOOTSTRAP_OK";
    `;
    const cmd = `php -d display_errors=On -r "${phpCode.replace(/"/g, '\\"').replace(/\n/g, '')}"`;
    conn.exec(`cd ${appDir} && ${cmd}`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('stderr', d => process.stderr.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => { console.error('❌ SSH Error:', err.message); }).connect(config);
