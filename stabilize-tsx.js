import fs from 'fs';
import path from 'path';

const baseDir = 'c:/Users/DION-SERVER/Desktop/Noble Architecture/main-file/packages/dionone';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file).replace(/\\/g, '/');
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.tsx')) {
            stabilizeTSX(fullPath);
        }
    }
}

function stabilizeTSX(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Fix dynamic indexing in statusColors and similar objects
    const colorObjects = ['statusColors', 'priorityColors', 'badgeColors', 'typeColors', 'categoryColors'];
    colorObjects.forEach(obj => {
        const regex = new RegExp(`${obj}\\[(\\w+(\\.\\w+)*)\\]`, 'g');
        content = content.replace(regex, (match, key) => {
            if (!match.includes('as keyof typeof')) {
                return `${obj}[${key} as keyof typeof ${obj}]`;
            }
            return match;
        });
    });

    // 2. Fix map() on potentially undefined arrays
    const commonArrays = ['departments', 'users', 'employees', 'roles', 'permissions', 'categories', 'tags'];
    commonArrays.forEach(arr => {
        const regex = new RegExp(`\\b${arr}\\.map\\(`, 'g');
        content = content.replace(regex, `${arr}?.map(`);
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`STABILIZED TSX: ${filePath}`);
    }
}

console.log('--- STARTING TSX STABILIZATION V1 ---');
walk(baseDir);
console.log('--- TSX STABILIZATION COMPLETE ---');

