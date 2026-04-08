<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

// Get Noble Company admin
$user = User::where('email', 'admin@noble.com')->first();
if (!$user) {
    echo "User not found!\n";
    exit(1);
}

echo "User: {$user->name} ({$user->email})\n";
echo "Company ID: {$user->created_by}\n";

// Get all roles
$roles = $user->roles()->pluck('name')->toArray();
echo "Current Roles: " . implode(', ', $roles) . "\n";

// Get current permissions count
$currentPerms = $user->getAllPermissions()->count();
echo "Current Permissions: {$currentPerms}\n";

// Get all permissions
$allPermissions = Permission::all();
echo "Total Available Permissions: {$allPermissions->count()}\n";

// Find the company-admin role or create one with all permissions
$companyRole = Role::where('name', 'company')->first();
if (!$companyRole) {
    echo "No 'company' role found. Looking for other roles...\n";
    $allRoles = Role::all()->pluck('name')->toArray();
    echo "Available roles: " . implode(', ', $allRoles) . "\n";
} else {
    echo "Company role found. Syncing all permissions...\n";
    $companyRole->syncPermissions($allPermissions);
    echo "All {$allPermissions->count()} permissions granted to 'company' role.\n";
}

// Also sync directly to user for safety
$user->syncPermissions($allPermissions);
echo "All {$allPermissions->count()} permissions granted directly to user.\n";

// Clear cache
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
echo "\nPermission cache cleared.\n";

// Verify
$finalPerms = $user->getAllPermissions()->count();
echo "Final Permissions Count: {$finalPerms}\n";
echo "✅ Done!\n";
