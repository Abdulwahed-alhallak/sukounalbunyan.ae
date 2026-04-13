const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const archiveName = 'noble_production_ecosystem.tar.gz';

console.log('--- NOBLE ARCHITECTURE PRODUCTION PACKER ---');
console.log('Resolving glob paths...');

// Folders/Files to include in the deployment package
const patterns = [
    'public/build/**',
    'public/sw.js',
    'public/manifest.json',
    'public/favicon.ico',
    'resources/lang/**',
    'resources/views/**',
    'packages/noble/*/module.json',
    'packages/noble/*/src/Resources/lang/**',
];

// Expand patterns manually to avoid 'tar' wildcard issues on Windows
let allFiles = [];
patterns.forEach(pattern => {
    const matches = globSync(pattern, { nodir: false });
    allFiles = allFiles.concat(matches);
});

// Filter unique files and convert to OS specific paths
const uniqueFiles = [...new Set(allFiles)].map(f => f.replace(/\//g, path.sep));

if (uniqueFiles.length === 0) {
    console.error('No files found to pack! Check your patterns.');
    process.exit(1);
}

const includeFile = 'include.txt';
fs.writeFileSync(includeFile, uniqueFiles.join('\n'));

console.log(`Packing ${uniqueFiles.length} items into ${archiveName}...`);

try {
    // We use tar -czf. 
    // On Windows, tar (bsdtar) from Win10/11 handles -T with local paths well.
    execSync(`tar -czf ${archiveName} -T ${includeFile}`, { stdio: 'inherit' });
    console.log(`\n✅ Successfully created ${archiveName}`);
    
    const stats = fs.statSync(archiveName);
    console.log(`📦 Final Archive size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} catch (err) {
    console.error('\n❌ Failed to create archive:', err.message);
} finally {
    if (fs.existsSync(includeFile)) fs.unlinkSync(includeFile);
}
