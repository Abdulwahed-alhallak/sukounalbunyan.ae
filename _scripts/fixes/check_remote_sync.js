import { Client } from 'ssh2';

const config = {
    host: '62.72.25.117',
    port: 65002,
    username: 'u256167180',
    password: '4_m_XMkgux@.AgC',
    readyTimeout: 60000
};

const conn = new Client();
conn.on('ready', () => {
    const phpCode = `
        require 'vendor/autoload.php';
        $app = require_once 'bootstrap/app.php';
        $kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
        $kernel->bootstrap();
        try {
            echo "Users: " . \\App\\Models\\User::count() . "\\n";
            echo "Employees: " . \\Noble\\Hrm\\Models\\Employee::count() . "\\n";
            echo "AddOns: " . \\App\\Models\\AddOn::count() . "\\n";
        } catch (\\Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    `;
    
    conn.exec(`/opt/alt/php82/usr/bin/php -r "${phpCode.replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d));
        stream.on('close', () => {
            conn.end();
            process.exit(0);
        });
    });
}).connect(config);
