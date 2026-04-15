<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Assign Staff Role and Permissions
$role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'staff']);

$users = \App\Models\User::where('email', 'like', 'qa_%@noble.test')->get();
foreach ($users as $user) {
    if (!$user->hasRole('staff')) {
        $user->assignRole($role);
        echo "Assigned 'staff' role to: {$user->name}\n";
    }
}

// Call Taskly Project Permissions 
\Noble\Taskly\Models\Project::GivePermissionToRoles($role->id, 'staff');
echo "Taskly Permissions applied to role ID: {$role->id}\n";
