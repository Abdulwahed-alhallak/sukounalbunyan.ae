<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'admin@noblearchitecture.net';
$user = \DB::table('users')->where('email', $email)->first();

if (!$user) {
    die("User $email not found.\n");
}

echo "User Found: " . json_encode($user, JSON_PRETTY_PRINT) . "\n";

$plans = \DB::table('plans')->get();
echo "\nAvailable Plans:\n";
foreach($plans as $plan) {
    echo "- ID: {$plan->id}, Name: {$plan->name}, Modules: {$plan->modules}\n";
}

// Columns in users table
$columns = \Schema::getColumnListing('users');
echo "\nUsers table columns: " . implode(', ', $columns) . "\n";

// Columns in projects table
if (\Schema::hasTable('projects')) {
    $columns = \Schema::getColumnListing('projects');
    echo "\nProjects table columns: " . implode(', ', $columns) . "\n";
} else {
    echo "\nProjects table not found.\n";
}

// Columns in project_tasks table
if (\Schema::hasTable('project_tasks')) {
    $columns = \Schema::getColumnListing('project_tasks');
    echo "\nProject Tasks table columns: " . implode(', ', $columns) . "\n";
} else {
    echo "\nProject Tasks table not found.\n";
}
