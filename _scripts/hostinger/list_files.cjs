#!/usr/bin/env node
/**
 * List Files on Hostinger Server
 * Shows what files are actually deployed
 */

const { Client: SSHClient } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');

async function listFiles() {
    return new Promise((resolve, reject) => {
        const conn = new SSHClient();

        conn.on('ready', () => {
            console.log('📂 Listing files on Hostinger server...\n');

            conn.exec('ls -la', (err, stream) => {
                if (err) throw err;
                console.log('Root directory:');
                console.log('================');
                stream.on('close', () => {
                    conn.exec('ls -la public/', (err, stream) => {
                        if (err) {
                            console.log('❌ public/ directory not found or empty');
                        } else {
                            console.log('\nPublic directory:');
                            console.log('=================');
                            stream.on('close', () => {
                                conn.exec('ls -la public/build/', (err, stream) => {
                                    if (err) {
                                        console.log('❌ public/build/ directory not found or empty');
                                    } else {
                                        console.log('\nBuild directory:');
                                        console.log('================');
                                        stream.on('close', () => {
                                            conn.end();
                                            resolve();
                                        }).on('data', (data) => {
                                            process.stdout.write(data);
                                        });
                                    }
                                });
                            }).on('data', (data) => {
                                process.stdout.write(data);
                            });
                        }
                    });
                }).on('data', (data) => {
                    process.stdout.write(data);
                });
            });
        }).on('error', (err) => {
            console.error('❌ SSH Connection failed:', err.message);
            reject(err);
        }).connect(CONFIG.SSH);
    });
}

listFiles().catch(console.error);