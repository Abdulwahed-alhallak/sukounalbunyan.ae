const { Client } = require('ssh2');
const conn = new Client();
const host = process.argv[2] || '193.203.166.17';
console.log(`Trying SSH to ${host}:65002...`);
conn.on('ready', () => { console.log('✅ SSH CONNECTED!'); conn.end(); process.exit(0); });
conn.on('error', (e) => { console.log('❌ Error:', e.message); process.exit(1); });
setTimeout(() => { console.log('⏱️ Timeout 15s'); conn.end(); process.exit(1); }, 15000);
conn.connect({ host, port: 65002, username: 'u256167180', password: '4_m_XMkgux@.AgC', readyTimeout: 10000 });
