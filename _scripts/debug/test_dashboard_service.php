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

// Helper function to mock the activated modules
if (!function_exists('Module_is_active')) {
    function Module_is_active($module, $companyId) {
        return true; // Assume all modules are active for testing
    }
}

try {
    $companyId = 2; // admin@noblearchitecture.net
    echo "Testing DashboardAggregationService for Company ID $companyId...\n";
    
    $service = new \App\Services\DashboardAggregationService($companyId);
    
    // Test each method individually to pinpoint the failure
    
    echo "\n[1/7] Testing getFinancialKPIs()... ";
    $reflection = new ReflectionClass($service);
    $method = $reflection->getMethod('getFinancialKPIs');
    $method->setAccessible(true);
    $method->invoke($service);
    echo "OK\n";
    
    echo "[2/7] Testing getHrmKPIs()... ";
    $method = $reflection->getMethod('getHrmKPIs');
    $method->setAccessible(true);
    $method->invoke($service);
    echo "OK\n";
    
    echo "[3/7] Testing getCrmKPIs()... ";
    $method = $reflection->getMethod('getCrmKPIs');
    $method->setAccessible(true);
    $method->invoke($service);
    echo "OK\n";
    
    echo "[4/7] Testing getProjectKPIs()... ";
    $method = $reflection->getMethod('getProjectKPIs');
    $method->setAccessible(true);
    $method->invoke($service);
    echo "OK\n";
    
    echo "[5/7] Testing getPosKPIs()... ";
    $method = $reflection->getMethod('getPosKPIs');
    $method->setAccessible(true);
    $method->invoke($service);
    echo "OK\n";
    
    echo "[6/7] Testing getSupportKPIs()... ";
    $method = $reflection->getMethod('getSupportKPIs');
    $method->setAccessible(true);
    $method->invoke($service);
    echo "OK\n";
    
    echo "[7/7] Testing companyDashboard()... ";
    $data = $service->companyDashboard();
    echo "OK\n";
    
    echo "\nSuccess! Full Dashboard Data retrieved.\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "In File: " . $e->getFile() . " on line " . $e->getLine() . "\n";
}

