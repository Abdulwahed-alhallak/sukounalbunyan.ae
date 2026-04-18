<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;

// Find or Create admin@noblearchitecture.net
$admin = User::firstOrCreate(
    ['email' => 'admin@noblearchitecture.net'],
    [
        'name' => 'noble architecture',
        'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
        'type' => 'super admin',
        'lang' => 'ar'
    ]
);

// Ensure it has the correct name and type
$admin->type = 'super admin';
$admin->name = 'noble architecture';
$admin->save();

// Ensure company@noble.dion.sy exists and is super admin or company
$company = User::firstOrCreate(
    ['email' => 'company@noble.dion.sy'],
    [
        'name' => 'Company',
        'password' => \Illuminate\Support\Facades\Hash::make('12345678'),
        'type' => 'company',
        'lang' => 'ar'
    ]
);

// We want admin@noblearchitecture.net to own the imported users and employees.
// So we set created_by = $admin->id for all users who are not super admins, and all employees.
DB::table('users')->whereNotIn('type', ['super admin', 'company'])->update(['created_by' => $admin->id]);
DB::table('employees')->update(['created_by' => $admin->id]);

// If there are other created_by dependencies like jobs, roles, etc, we update them.
// Now, remove any other users that are "super admin" or "company" except our two allowed accounts.
DB::table('users')
    ->whereIn('type', ['super admin', 'company'])
    ->whereNotIn('email', ['admin@noblearchitecture.net', 'company@noble.dion.sy'])
    ->delete();

echo "Transferred all users/employees to admin@noblearchitecture.net (ID: {$admin->id}).\n";
echo "Cleaned up other super admins/companies.\n";
