const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = { host: process.env.PRODUCTION_HOST, port: parseInt(process.env.PRODUCTION_PORT, 10), username: process.env.PRODUCTION_USERNAME, password: process.env.PRODUCTION_PASSWORD };
const appDir = process.env.PRODUCTION_APP_DIR;

const conn = new Client();
conn.on('ready', () => {
    const phpCode = `
    <?php
    require 'vendor/autoload.php';
    $app = require_once 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\\\\Contracts\\\\Console\\\\Kernel::class);
    $kernel->bootstrap();
    $tables = ['product_service_items', 'warehouses', 'projects', 'rental_contracts'];
    $results = [];
    foreach ($tables as $table) {
        try {
            $results[$table] = Schema::getColumnListing($table);
        } catch (\\\\Exception $e) {
            $results[$table] = "ERROR: " . $e->getMessage();
        }
    }
    echo json_encode($results);
    `;
    // We need to be careful with quotes in the command line
    const cmd = `php -r "${phpCode.replace(/"/g, '\\"').replace(/\n/g, '')}"`;
    conn.exec(`cd ${appDir} && ${cmd}`, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => { console.error('❌ SSH Error:', err.message); }).connect(config);
