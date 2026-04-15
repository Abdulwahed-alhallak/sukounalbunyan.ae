<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('email', 'qa_0@noble.test')->first();
if ($user) {
    echo "User found: " . $user->name . "\n";
    echo "User type: " . $user->type . "\n";
    echo "Roles:\n";
    print_r($user->roles->pluck('name')->toArray());
    echo "Direct Permissions:\n";
    print_r($user->permissions->pluck('name')->toArray());
} else {
    echo "User not found\n";
}
