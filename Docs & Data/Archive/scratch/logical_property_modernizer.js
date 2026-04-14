const fs = require('fs');
const path = require('path');

const replacements = [
    // Margins
    { from: /\bml-([0-9]|auto|px|\[)/g, to: 'ms-$1' },
    { from: /\bmr-([0-9]|auto|px|\[)/g, to: 'me-$1' },
    // Paddings
    { from: /\bpl-([0-9]|px|\[)/g, to: 'ps-$1' },
    { from: /\bpr-([0-9]|px|\[)/g, to: 'pe-$1' },
    // Text Alignment
    { from: /\btext-left\b/g, to: 'text-start' },
    { from: /\btext-right\b/g, to: 'text-end' },
    // Positioning
    { from: /\bleft-([0-9]|px|auto|\[)/g, to: 'start-$1' },
    { from: /\bright-([0-9]|px|auto|\[)/g, to: 'end-$1' },
    // Border
    { from: /\bborder-l\b/g, to: 'border-s' },
    { from: /\bborder-r\b/g, to: 'border-e' },
    { from: /\bborder-l-([0-9]|px|\[)/g, to: 'border-s-$1' },
    { from: /\bborder-r-([0-9]|px|\[)/g, to: 'border-e-$1' },
    // Rounded
    { from: /\brounded-l-([a-z0-9]|px|\[)/g, to: 'rounded-s-$1' },
    { from: /\brounded-r-([a-z0-9]|px|\[)/g, to: 'rounded-e-$1' },
    { from: /\brounded-l\b/g, to: 'rounded-s' },
    { from: /\brounded-r\b/g, to: 'rounded-e' }
];

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        let dirPath = path.join(dir, f);
        if (f === 'node_modules' || f === 'vendor' || f === 'storage' || f === '.git' || f === 'public' || f === 'dist') continue;
        let stat = fs.statSync(dirPath);
        if (stat.isDirectory()) {
            walk(dirPath, callback);
        } else {
            callback(dirPath);
        }
    }
}

const targetDirs = [
    path.join(process.cwd(), 'main-file', 'resources', 'js'),
    path.join(process.cwd(), 'main-file', 'packages', 'noble')
];

let totalFiles = 0;
let modifiedFiles = 0;

targetDirs.forEach(dir => {
    walk(dir, (filePath) => {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.jsx') && !filePath.endsWith('.js') && !filePath.endsWith('.css')) return;
        
        totalFiles++;
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;
            
            replacements.forEach(rep => {
                content = content.replace(rep.from, (match, p1) => {
                    // Log matches for better debugging
                    // console.log(`Matched ${match} in ${filePath}`);
                    return rep.to.replace('$1', p1);
                });
            });

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                modifiedFiles++;
                // console.log(`Modified: ${filePath}`);
            }
        } catch (e) {
            console.error(`Error processing ${filePath}: ${e.message}`);
        }
    });
});

console.log(`Scan complete.`);
console.log(`Total files scanned: ${totalFiles}`);
console.log(`Modified files: ${modifiedFiles}`);
