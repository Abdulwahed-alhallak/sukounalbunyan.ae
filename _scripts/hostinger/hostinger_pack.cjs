const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const phases = [
    {
        name: 'build.tar.gz',
        patterns: ['public/build/**', 'public/sw.js', 'public/manifest.json', 'public/favicon.ico']
    },
    {
        name: 'resources.tar.gz',
        patterns: ['resources/lang/**', 'resources/views/**']
    },
    {
        name: 'packages.tar.gz',
        patterns: ['packages/noble/*/module.json', 'packages/noble/*/src/Resources/lang/**']
    }
];

console.log('--- Sukoun Albunyan PRODUCTION PACKER (PHASED) ---');

phases.forEach(phase => {
    console.log(`\n📦 Processing Phase: ${phase.name}`);
    let allFiles = [];
    phase.patterns.forEach(pattern => {
        const matches = globSync(pattern, { nodir: false });
        allFiles = allFiles.concat(matches);
    });

    const uniqueFiles = [...new Set(allFiles)].map(f => f.replace(/\//g, path.sep));
    
    if (uniqueFiles.length === 0) {
        console.warn(`   ⚠️ No files found for ${phase.name}. Skipping.`);
        return;
    }

    const includeFile = `include_${phase.name.split('.')[0]}.txt`;
    fs.writeFileSync(includeFile, uniqueFiles.join('\n'));

    try {
        console.log(`   Packing ${uniqueFiles.length} items...`);
        execSync(`tar -czf ${phase.name} -T ${includeFile}`, { stdio: 'inherit' });
        const stats = fs.statSync(phase.name);
        console.log(`   ✅ Created ${phase.name} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
    } finally {
        if (fs.existsSync(includeFile)) fs.unlinkSync(includeFile);
    }
});

console.log('\n✨ Phased Packing Complete.');
