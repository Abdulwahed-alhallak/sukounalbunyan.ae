#!/usr/bin/env node
/**
 * Secure Configuration Loader
 * Loads sensitive production credentials from .env.production
 * NEVER hardcode credentials in deployment scripts!
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env.production') });

function getConfig() {
    const required = [
        'PRODUCTION_HOST',
        'PRODUCTION_PORT',
        'PRODUCTION_USERNAME',
        'PRODUCTION_PASSWORD',
        'PRODUCTION_APP_DIR'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('\n❌ MISSING REQUIRED ENVIRONMENT VARIABLES:');
        missing.forEach(key => console.error(`   - ${key}`));
        console.error('\n⚠️  Solution:');
        console.error('   1. Copy .env.production.example to .env.production');
        console.error('   2. Fill in the sensitive values in .env.production');
        console.error('   3. Make sure .env.production is in .gitignore (it should NOT be committed)\n');
        process.exit(1);
    }

    return {
        SSH: {
            host: process.env.PRODUCTION_HOST,
            port: parseInt(process.env.PRODUCTION_PORT, 10),
            username: process.env.PRODUCTION_USERNAME,
            password: process.env.PRODUCTION_PASSWORD
        },
        APP_DIR: process.env.PRODUCTION_APP_DIR,
        PHP: process.env.PRODUCTION_PHP_EXECUTABLE || '/opt/alt/php82/usr/bin/php',
        DB: {
            host: process.env.PRODUCTION_DB_HOST || 'localhost',
            username: process.env.PRODUCTION_DB_USERNAME || process.env.PRODUCTION_USERNAME,
            password: process.env.PRODUCTION_DB_PASSWORD || process.env.PRODUCTION_PASSWORD,
            database: process.env.PRODUCTION_DB_NAME || 'u256167180_noble',
            port: process.env.PRODUCTION_DB_PORT || 3306
        }
    };
}

module.exports = getConfig();
