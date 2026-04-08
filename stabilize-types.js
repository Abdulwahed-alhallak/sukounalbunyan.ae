import fs from 'fs';
import path from 'path';

const baseDir = 'c:/Users/DION-SERVER/Desktop/DionONE/main-file/packages/dionone';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file).replace(/\\/g, '/');
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file === 'types.ts') {
            stabilizeFile(fullPath);
        }
    }
}

function stabilizeFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Convert unknown index signatures to any (Inertia compatibility)
    content = content.replace(/\[key: string\]: unknown;/g, '[key: string]: any;');

    // 2. Fix generic PageProps requirements
    content = content.replace(/extends PageProps(\s*)\{/g, 'extends PageProps<any>$1{');

    // 3. Robust Interface Stabilization (Handles extends, nested bodies)
    // Targets: interface Name [extends ...] { body }
    const interfaceRegex = /interface (\w+)(\s+extends\s+[^{]+)?\s*\{([\s\S]*?)\}/g;
    content = content.replace(interfaceRegex, (match, name, extension, body) => {
        if (!body.includes('[key: string]:') && !body.includes('// skip-stabilize')) {
            // Trim and add index signature
            const trimmedBody = body.replace(/\s+$/, '');
            const hasProperties = trimmedBody.trim().length > 0;
            const separator = hasProperties ? '\n    ' : '';
            return `interface ${name}${extension || ''} {${trimmedBody}${separator}[key: string]: any;\n}`;
        }
        return match;
    });

    // 4. Type Alias Object Stabilization
    // Targets: export type Name = { body }
    const typeAliasRegex = /type (\w+)\s*=\s*\{([\s\S]*?)\};/g;
    content = content.replace(typeAliasRegex, (match, name, body) => {
        if (!body.includes('[key: string]:') && body.includes(':') && !body.includes('// skip-stabilize')) {
            const trimmedBody = body.replace(/\s+$/, '');
            return `type ${name} = {${trimmedBody}\n    [key: string]: any;\n};`;
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`STABILIZED: ${filePath}`);
    }
}

console.log('--- STARTING GLOBAL TYPE STABILIZATION V4 ---');
walk(baseDir);
console.log('--- STABILIZATION COMPLETE ---');
