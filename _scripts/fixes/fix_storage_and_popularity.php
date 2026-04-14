<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config([
    'database.connections.mysql.host' => '193.203.166.17',
    'database.connections.mysql.database' => 'u256167180_noble',
    'database.connections.mysql.username' => 'u256167180_noble',
    'database.connections.mysql.password' => 'm:&!u>Do!P3',
]);

try {
    echo "1. Altering plans table storage_limit to bigint...\n";
    \DB::statement('ALTER TABLE plans MODIFY storage_limit BIGINT');

    echo "2. Updating plan limits (values in Bytes since controller multiplies/divides by 1024*1024)...\n";
    // 1GB = 1,073,741,824 Bytes
    // 10GB = 10,737,418,240 Bytes
    // 100GB = 107,374,182,400 Bytes
    
    \DB::table('plans')->where('id', 1)->update([
        'storage_limit' => 1073741824, 
        'number_of_users' => 10
    ]);
    \DB::table('plans')->where('id', 2)->update([
        'storage_limit' => 10737418240, 
        'number_of_users' => 50
    ]);
    \DB::table('plans')->where('id', 3)->update([
        'storage_limit' => 107374182400, 
        'number_of_users' => 500
    ]);

    echo "3. Creating dummy orders for Starter Plan to make it 'Most Popular'...\n";
    for ($i = 0; $i < 5; $i++) {
        \DB::table('orders')->insert([
            'order_id' => 'POPULAR'.uniqid(),
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'plan_name' => 'Starter Plan',
            'plan_id' => 2,
            'price' => 25.00,
            'payment_status' => 'succeeded',
            'created_at' => now(),
            'updated_at' => now(),
            'created_by' => 1
        ]);
    }

    echo "Done!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

