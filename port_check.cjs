const net = require('net');
const client = new net.Socket();
client.setTimeout(5000);
client.connect(65002, '62.72.25.117', () => {
    console.log('✅ Port 65002 is OPEN!');
    client.destroy();
    process.exit(0);
});
client.on('error', (err) => {
    console.log('❌ Port 65002 is CLOSED: ' + err.message);
    process.exit(1);
});
client.on('timeout', () => {
    console.log('❌ Port 65002 TIMEOUT');
    process.exit(1);
});
