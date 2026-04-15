const fs = require('fs');
const path = require('path');

// Recursive function to get all files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    
    return arrayOfFiles;
};

// Replace logical properties safely inside className strings
const fixRtlLogicalProperties = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // We only want to replace tailwind classes inside className="..." or className={`...`}
    // But a global regex for specific tailwind boundaries is safer.
    
    const replacements = {
        '\\bml-': 'ms-',       // margin-left to margin-start
        '\\bmr-': 'me-',       // margin-right to margin-end
        '\\bpl-': 'ps-',       // padding-left to padding-start
        '\\bpr-': 'pe-',       // padding-right to padding-end
        '\\bleft-': 'start-',  // left position to start position
        '\\bright-': 'end-',   // right position to end position
        '\\btext-left\\b': 'text-start',
        '\\btext-right\\b': 'text-end',
        '\\bborder-l-': 'border-s-',
        '\\bborder-r-': 'border-e-',
        '\\brounded-l-': 'rounded-s-',
        '\\brounded-r-': 'rounded-e-',
    };

    let changesMade = 0;

    for (const [pattern, replacement] of Object.entries(replacements)) {
        // Find matches and replace
        const regex = new RegExp(pattern, 'g');
        const matches = content.match(regex);
        if (matches && matches.length > 0) {
            content = content.replace(regex, replacement);
            changesMade += matches.length;
        }
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        return changesMade;
    }

    return 0;
};

// Scan the packages directory
const searchPath = path.join(__dirname, '../../packages/noble');
console.log(`🚀 Starting Global RTL Logical Properties Audit in: ${searchPath}`);

const files = getAllFiles(searchPath);
console.log(`Found ${files.length} TypeScript files.`);

let totalModifiedFiles = 0;
let totalReplacements = 0;

files.forEach(file => {
    const changes = fixRtlLogicalProperties(file);
    if (changes > 0) {
        totalModifiedFiles++;
        totalReplacements += changes;
        console.log(`✅ Fixed RTL in: ${file.replace(searchPath, '')} (${changes} replacements)`);
    }
});

console.log('===================================================');
console.log(`🏆 RTL AUDIT COMPLETE`);
console.log(`Files Modified: ${totalModifiedFiles}`);
console.log(`Total Logical Property Replacements: ${totalReplacements}`);
console.log('===================================================');
