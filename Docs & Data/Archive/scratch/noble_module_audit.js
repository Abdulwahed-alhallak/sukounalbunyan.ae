const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
        let dirPath = path.join(dir, f);
        if (f === 'node_modules' || f === 'vendor' || f === '.git') continue;
        let stat = fs.statSync(dirPath);
        if (stat.isDirectory()) {
            walk(dirPath, callback);
        } else {
            callback(dirPath);
        }
    }
}

const targetDir = path.join(process.cwd(), 'main-file', 'packages', 'noble');
const issues = [];

walk(targetDir, (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasUseTranslation = content.includes('useTranslation(');
        const hasImport = content.includes('import { useTranslation } from \'react-i18next\'') || 
                          content.includes('import {useTranslation} from \'react-i18next\'') ||
                          content.includes('import { useTranslation } from "react-i18next"');
        
        if (hasUseTranslation && !hasImport) {
            issues.push({ file: filePath, issue: 'Missing useTranslation import' });
        }

        const hasCn = /\bcn\(/.test(content);
        const hasCnImport = content.includes('import { cn } from \'@/lib/utils\'') || 
                             content.includes('import { cn } from "@/lib/utils"') ||
                             content.includes('import {cn} from "@/lib/utils"');

        if (hasCn && !hasCnImport) {
            // Check if it's already defined locally or imported elsewhere
            if (!content.includes('function cn(') && !content.includes('const cn =')) {
                 issues.push({ file: filePath, issue: 'Missing cn import' });
            }
        }
    } catch (e) {}
});

console.log(JSON.stringify(issues, null, 2));
