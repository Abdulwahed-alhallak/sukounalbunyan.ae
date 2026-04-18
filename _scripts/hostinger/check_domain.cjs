#!/usr/bin/env node
/**
 * Check Domain Structure on Hostinger
 */

const { Client: SSHClient } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');

async function checkDomain() {
    return new Promise((resolve, reject) => {
        const conn = new SSHClient();

        conn.on('ready', () => {
            console.log('🔍 Checking domain structure...\n');

            // Check domains directory
            conn.exec('ls -la domains/', (err, stream) => {
                if (err) throw err;
                console.log('Domains directory:');
                console.log('==================');
                stream.on('close', () => {
                    // Check noble.dion.sy directory
                    conn.exec('ls -la domains/noble.dion.sy/', (err, stream) => {
                        if (err) {
                            console.log('❌ domains/noble.dion.sy/ not found');
                        } else {
                            console.log('\nNoble domain directory:');
                            console.log('=======================');
                            stream.on('close', () => {
                                // Check public_html
                                conn.exec('ls -la domains/noble.dion.sy/public_html/', (err, stream) => {
                                    if (err) {
                                        console.log('❌ public_html not found');
                                    } else {
                                        console.log('\nPublic HTML directory:');
                                        console.log('======================');
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

checkDomain().catch(console.error);