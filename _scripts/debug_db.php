<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

$tables = ['product_service_units', 'product_service_categories', 'users'];
foreach ($tables as $table) {
    echo "--- $table ---\n";
    try {
        $res = DB::select("SHOW CREATE TABLE $table")[0];
        $key = 'Create Table';
        echo $res->$key . "\n\n";
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n\n";
    }
}
