const fs = require('fs');
const glob = require('glob');

const files = glob.sync('**/*.tsx', { ignore: ['node_modules/**'] });
let updated = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const og = content;
    // Replace specifically combinations of start-1/2 and -translate-x-1/2 in className strings
    content = content.replace(/start-1\/2(.*?)-translate-x-1\/2/g, 'left-1/2$1-translate-x-1/2');
    content = content.replace(/-translate-x-1\/2(.*?)start-1\/2/g, '-translate-x-1/2$1left-1/2');
    
    // Some lines might use end-1/2, etc. But start-1/2 + translate is the main culprit
    if (content !== og) {
        fs.writeFileSync(file, content);
        updated++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Total files fixed: ${updated}`);
