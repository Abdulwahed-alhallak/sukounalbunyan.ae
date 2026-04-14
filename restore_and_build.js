import fs from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

const root = 'c:/Users/DION-SERVER/Desktop/noble.dion.sy';
const sourceApp = resolve(root, 'temp_restore/js/app.tsx');
const destApp = resolve(root, 'resources/js/app.tsx');

try {
    console.log(`Reading source: ${sourceApp}`);
    const content = fs.readFileSync(sourceApp, 'utf8');
    console.log(`Content length: ${content.length}`);
    
    console.log(`Writing to: ${destApp}`);
    if (!fs.existsSync(resolve(root, 'resources/js'))) {
        fs.mkdirSync(resolve(root, 'resources/js'), { recursive: true });
    }
    fs.writeFileSync(destApp, content);
    console.log('Write successful');

    console.log('Running build...');
    const output = execSync('npm run build', { cwd: root, encoding: 'utf8' });
    console.log(output);
} catch (err) {
    console.error('ERROR:', err);
}
