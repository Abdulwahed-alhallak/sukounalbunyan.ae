const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../noble_production_ecosystem.tar.gz');
const CHUNK_SIZE = 512 * 1024; // 512KB

const stats = fs.statSync(file);
const fileSize = stats.size;
const fd = fs.openSync(file, 'r');

let offset = 0;
let part = 0;

while (offset < fileSize) {
    const bytesToRead = Math.min(CHUNK_SIZE, fileSize - offset);
    const buffer = Buffer.alloc(bytesToRead);
    fs.readSync(fd, buffer, 0, bytesToRead, offset);
    
    const partPath = path.resolve(__dirname, `../p_${part.toString().padStart(3, '0')}.chunk`);
    fs.writeFileSync(partPath, buffer);
    
    console.log(`Created part_${part}.chunk (${(bytesToRead / 1024 / 1024).toFixed(2)} MB)`);
    offset += bytesToRead;
    part++;
}

fs.closeSync(fd);
console.log('Split complete.');
