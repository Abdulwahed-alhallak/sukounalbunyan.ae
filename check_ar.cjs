const fs = require('fs');
const data = JSON.parse(fs.readFileSync('resources/lang/ar.json', 'utf8'));
console.log(data['Materials']);
console.log(data['Rental Contracts']);
