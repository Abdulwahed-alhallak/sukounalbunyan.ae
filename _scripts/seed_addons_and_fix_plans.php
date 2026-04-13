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

$modules_path = base_path('packages/dionone');
$directories = array_map('basename', \File::directories($modules_path));

echo "Seeding Addons...\n";
foreach ($directories as $module) {
    $json_path = $modules_path . '/' . $module . '/module.json';
    
    $data = [
        'module' => $module,
        'name' => $module,
        'is_enable' => 1,
        'priority' => 10,
        'monthly_price' => 0,
        'yearly_price' => 0,
        'image' => '',
        'package_name' => strtolower($module),
        'for_admin' => 0,
        'created_at' => now(),
        'updated_at' => now(),
    ];
    
    if (\File::exists($json_path)) {
        $json = json_decode(\File::get($json_path), true);
        $data['name'] = $json['alias'] ?? ($json['name'] ?? $module);
        $data['priority'] = $json['priority'] ?? 10;
        $data['monthly_price'] = $json['monthly_price'] ?? 0;
        $data['yearly_price'] = $json['yearly_price'] ?? 0;
        $data['package_name'] = $json['package_name'] ?? strtolower($module);
    }

    \DB::table('add_ons')->updateOrInsert(
        ['module' => $module],
        $data
    );
    echo "- Seeded: $module ({$data['name']})\n";
}

echo "\nFixing Plans...\n";
// Free Plan
\DB::table('plans')->where('id', 1)->update([
    'number_of_users' => 10,
    'storage_limit' => 1024,
    'status' => 1,
]);
echo "- Updated Free Plan (ID 1)\n";

// Starter Plan
\DB::table('plans')->where('id', 2)->update([
    'number_of_users' => 50,
    'storage_limit' => 10240,
    'status' => 1,
]);
echo "- Updated Starter Plan (ID 2)\n";

// Professional Plan
\DB::table('plans')->where('id', 3)->update([
    'number_of_users' => 500,
    'storage_limit' => 102400,
    'status' => 1,
]);
echo "- Updated Professional Plan (ID 3)\n";

echo "\nDone!\n";

