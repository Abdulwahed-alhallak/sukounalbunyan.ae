import fs from 'fs';
import path from 'path';

const dir = 'resources/js';

function listDir(d) {
    if (!fs.existsSync(d)) {
        console.log(`${d} does not exist`);
        return;
    }
    const files = fs.readdirSync(d);
    files.forEach(file => {
        const fullPath = path.join(d, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            console.log(`DIR  ${fullPath}`);
            listDir(fullPath);
        } else {
            console.log(`FILE ${fullPath} (${stats.size} bytes)`);
        }
    });
}

listDir(dir);
