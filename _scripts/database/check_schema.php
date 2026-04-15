<?php
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check users table columns
$cols = Illuminate\Support\Facades\Schema::getColumnListing('users');
echo "=== Users Table Columns ===" . PHP_EOL;
echo implode(', ', $cols) . PHP_EOL;

// Check orders table
echo PHP_EOL . "=== Orders Table Columns ===" . PHP_EOL;
$orderCols = Illuminate\Support\Facades\Schema::getColumnListing('orders');
echo implode(', ', $orderCols) . PHP_EOL;

// Check plans table
echo PHP_EOL . "=== Plans Table Columns ===" . PHP_EOL;
$planCols = Illuminate\Support\Facades\Schema::getColumnListing('plans');
echo implode(', ', $planCols) . PHP_EOL;

// Find active orders
echo PHP_EOL . "=== Orders ===" . PHP_EOL;
$orders = App\Models\Order::all();
foreach ($orders as $o) {
    echo "  Order ID: {$o->id} | User: {$o->user_id} | Plan: {$o->plan_id} | Status: {$o->status}" . PHP_EOL;
}
