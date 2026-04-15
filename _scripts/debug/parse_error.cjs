const fs = require('fs');
const html = fs.readFileSync('public/error.html', 'utf8');

const titleMatch = html.match(/<title>(.*?)<\/title>/is);
console.log('TITLE:', titleMatch ? titleMatch[1].trim() : 'No Title');

const msgMatch = html.match(/"message"\s*:\s*"([^"]*)"/is);
console.log('MESSAGE:', msgMatch ? msgMatch[1] : 'No Message');

const fileMatch = html.match(/"file"\s*:\s*"([^"]*)"/is);
console.log('FILE:', fileMatch ? fileMatch[1] : 'No File');

const exMatch = html.match(/"class"\s*:\s*"([^"]*)"/is);
console.log('CLASS:', exMatch ? exMatch[1] : 'No Class');
