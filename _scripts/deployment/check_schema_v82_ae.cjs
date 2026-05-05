const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.production') });

const config = { host: process.env.PRODUCTION_HOST, port: parseInt(process.env.PRODUCTION_PORT, 10), username: process.env.PRODUCTION_USERNAME, password: process.env.PRODUCTION_PASSWORD };
const appDir = process.env.PRODUCTION_APP_DIR;
const php82 = '/opt/alt/php82/usr/bin/php';

const conn = new Client();
conn.on('ready', () => {
    const phpCode = `<?php
    require 'vendor/autoload.php';
    $app = require_once 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
    $kernel->bootstrap();
    $tables = ['product_service_items', 'warehouses', 'projects', 'rental_contracts'];
    $results = [];
    foreach ($tables as $table) {
        try {
            $results[$table] = Schema::getColumnListing($table);
        } catch (\\Exception $e) {
            $results[$table] = "ERROR: " . $e->getMessage();
        }
    }
    echo json_encode($results);
    `;
    const remoteFile = `${appDir}/check_schema_final.php`;
    const cmd = `echo "${phpCode.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" > ${remoteFile} && ${php82} ${remoteFile} && rm ${remoteFile}`;
    conn.exec(cmd, (err, stream) => {
        stream.on('data', d => process.stdout.write(d));
        stream.on('stderr', d => process.stderr.write(d));
        stream.on('close', () => conn.end());
    });
}).on('error', (err) => { console.error('❌ SSH Error:', err.message); }).connect(config);
