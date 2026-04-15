import { Client } from 'ssh2';

const conn = new Client();
const probeCommand = `
echo "Checking PHP paths..."
paths=(
    "/usr/bin/php8.2"
    "/usr/bin/php82"
    "/opt/cpanel/ea-php82/root/usr/bin/php"
    "/opt/alt/php82/usr/bin/php"
    "/usr/local/bin/php8.2"
)
for p in "\${paths[@]}"; do
    if [ -f "$p" ]; then
        echo "FOUND_PHP: $p"
        break
    fi
done
`;

conn.on('ready', () => {
    conn.exec(probeCommand, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        });
    });
}).connect({
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC'
});
