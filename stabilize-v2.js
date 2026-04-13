import fs from 'fs';
import path from 'path';

const baseDir = 'c:/Users/DION-SERVER/Desktop/Noble Architecture/main-file/packages/dionone';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file).replace(/\\/g, '/');
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            stabilize(fullPath);
        }
    }
}

function stabilize(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Fix dynamic indexing
    const colorObjects = ['statusColors', 'priorityColors', 'badgeColors', 'typeColors', 'categoryColors', 'statusClasses', 'itemColors'];
    colorObjects.forEach(obj => {
        const regex = new RegExp(`${obj}\\[([^\\s\\]]+)\\]`, 'g');
        content = content.replace(regex, (match, key) => {
            if (!match.includes('as keyof typeof')) {
                return `${obj}[${key} as keyof typeof ${obj}]`;
            }
            return match;
        });
    });

    // 2. Fix potential syntax errors from previous runs
    content = content.replace(/\?\?\./g, '?.'); // Fix double optional chaining
    content = content.replace(/\?\.\?\./g, '?.'); // Fix triple optional chaining artifacts

    // 3. Fix for 'undefined' not assignable to 'any[]' in usePage destructuring
    const commonPropNames = ['customers', 'users', 'employees', 'transactions', 'revenues', 'payments', 'bills', 'items', 'categories', 'tags'];
    commonPropNames.forEach(prop => {
        const destructureRegex = new RegExp(`const \\{ ([^\\}]*\\b${prop}\\b[^\\}]*) \\} = usePage`, 'g');
        content = content.replace(destructureRegex, (match, inner) => {
           if (!inner.includes(`${prop} = []`)) {
               return `const { ${inner.replace(new RegExp(`\\b${prop}\\b`, 'g'), `${prop} = []`)} } = usePage`;
           }
           return match;
        });
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`STABILIZED V2.2: ${filePath}`);
    }
}

console.log('--- STARTING STABILIZATION V2.2 ---');
walk(baseDir);
console.log('--- STABILIZATION COMPLETE ---');

