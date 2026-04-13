const fs = require('fs');
const path = require('path');

function stripBom(filePath) {
    try {
        let content = fs.readFileSync(filePath);
        // Check for UTF-8 BOM EF BB BF
        if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
            content = content.slice(3);
            fs.writeFileSync(filePath, content);
            console.log(`Stripped BOM from: ${filePath}`);
        }
    } catch (e) {
        // Skip
    }
}

function processDirectory(directory) {
    if (!fs.existsSync(directory)) return;
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.json')) {
            stripBom(fullPath);
        }
    }
}

// Process base languages
processDirectory(path.join(__dirname, '../resources/lang'));

// Process package languages
processDirectory(path.join(__dirname, '../packages/noble'));

console.log('BOM analysis and sweeping complete!');
