<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = \DB::select('SHOW TABLES');
echo "Tables:\n";
foreach($tables as $table) {
    echo "- " . array_values((array)$table)[0] . "\n";
}

if (\Schema::hasTable('subscriptions')) {
    echo "\nSubscriptions:\n";
    $subscriptions = \DB::table('subscriptions')->get();
    foreach($subscriptions as $sub) {
        echo json_encode($sub) . "\n";
    }
} else {
    echo "\nNo subscriptions table.\n";
}

if (\Schema::hasTable('plans')) {
    echo "\nPlans:\n";
    $plans = \DB::table('plans')->get();
    foreach($plans as $plan) {
        echo json_encode($plan) . "\n";
    }
}
