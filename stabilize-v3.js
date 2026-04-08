import fs from 'fs';
import path from 'path';

const baseDir = 'c:/Users/DION-SERVER/Desktop/DionONE/main-file/packages/dionone/Hrm/src';

function walk(dir) {
    if (!fs.existsSync(dir)) return;
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

    // 1. Expanded HRM Prop Defaults
    const hrmProps = [
        'announcements', 'announcementcategories', 'departments', 'warnings', 
        'attendance', 'leaves', 'holidays', 'employees', 'designations', 
        'branches', 'complaints', 'resignations', 'terminations', 'promotions',
        'transfers', 'awards', 'document_types', 'event_types'
    ];
    
    hrmProps.forEach(prop => {
        // Fix usePage destructuring
        const usePageRegex = new RegExp(`const \\{ ([^\\}]*\\b${prop}\\b[^\\}]*) \\} = usePage`, 'g');
        content = content.replace(usePageRegex, (match, inner) => {
           if (!inner.includes(`${prop} = []`) && !inner.includes(`${prop} = {}`)) {
               const defaultValue = (prop.endsWith('s') || prop.endsWith('ies')) ? '[]' : '{}';
               return `const { ${inner.replace(new RegExp(`\\b${prop}\\b`, 'g'), `${prop} = ${defaultValue}`)} } = usePage`;
           }
           return match;
        });

        // Fix props destructuring from arguments
        const propsRegex = new RegExp(`\\(\\{ ([^\\}]*\\b${prop}\\b[^\\}]*) \\}\\)`, 'g');
        content = content.replace(propsRegex, (match, inner) => {
           if (!inner.includes(`${prop} = []`) && !inner.includes(`${prop} = {}`)) {
               const defaultValue = (prop.endsWith('s') || prop.endsWith('ies')) ? '[]' : '{}';
               return `({ ${inner.replace(new RegExp(`\\b${prop}\\b`, 'g'), `${prop} = ${defaultValue}`)} })`;
           }
           return match;
        });
    });

    // 2. Fix Paginated Table Data Access
    hrmProps.forEach(prop => {
        const dataRegex = new RegExp(`\\b${prop}\\.data\\b`, 'g');
        content = content.replace(dataRegex, (match) => {
            if (!match.includes('?.data')) {
               return `(${prop}?.data || [])`;
            }
            return match;
        });
    });

    // 3. Fix dynamic indexing
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

    // 4. Ensure .map() safety
    content = content.replace(/(\w+)\.map\(/g, (match, arr) => {
        if (!content.includes(`${arr}?.map(`)) {
            return `${arr}?.map(`;
        }
        return match;
    });

    // 5. Cleanup syntax artifacts
    content = content.replace(/\?\?\./g, '?.');
    content = content.replace(/\?\.\?\./g, '?.');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`STABILIZED V3 (HRM): ${filePath}`);
    }
}

console.log('--- STARTING STABILIZATION V3 (HRM FOCUS) ---');
walk(baseDir);
console.log('--- STABILIZATION COMPLETE ---');
