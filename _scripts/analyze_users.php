<?php

require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$superAdmin = User::where('type', 'superadmin')->first();
$companies = User::where('type', 'company')->get(['id', 'name', 'email']);

echo "Super Admin: {$superAdmin->id} - {$superAdmin->name} ({$superAdmin->email})\n";
echo "Companies:\n";
foreach ($companies as $c) {
    echo "  {$c->id} - {$c->name} ({$c->email})\n";
}

$otherUsersCount = User::whereNotIn('type', ['superadmin', 'company'])->count();
echo "Other Users (Employees/Staff) Count: {$otherUsersCount}\n";

// Show some sample employees and their current created_by
$sample = User::whereNotIn('type', ['superadmin', 'company'])->take(5)->get(['id', 'name', 'created_by', 'type']);
echo "Sample Employees:\n";
foreach ($sample as $s) {
    echo "  {$s->id} - {$s->name} - created_by: {$s->created_by} - type: {$s->type}\n";
}
