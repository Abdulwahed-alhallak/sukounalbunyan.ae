<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

// 1. Get or Create Super Admin (ID 1)
$superAdmin = User::where('type', 'superadmin')->first();
if (!$superAdmin) {
    $superAdmin = User::firstOrCreate(['email' => 'superadmin@example.com'], [
        'name' => 'Super Admin',
        'password' => Hash::make('1234'),
        'type' => 'superadmin',
        'lang' => 'ar'
    ]);
}

// 2. Ensure "company@example.com" is type 'company' with created_by = $superAdmin->id
$companyExample = User::firstOrCreate(['email' => 'company@example.com'], [
    'name' => 'Company',
    'password' => Hash::make('1234'),
    'type' => 'company',
    'lang' => 'ar',
    'created_by' => $superAdmin->id
]);
$companyExample->type = 'company';
$companyExample->created_by = $superAdmin->id;
$companyExample->save();

// 3. Ensure "dion creative agency" exists
$dion = User::firstOrCreate(['email' => 'contact@dion.sy'], [
    'name' => 'dion creative agency',
    'password' => Hash::make('12345678'),
    'type' => 'company',
    'lang' => 'ar',
    'created_by' => $superAdmin->id
]);
$dion->type = 'company';
$dion->created_by = $superAdmin->id;
$dion->save();

// 4. Ensure "Noble Company" exists as a REGULAR COMPANY (Not Super Admin)
$noble = User::firstOrCreate(['email' => 'admin@noble.com'], [
    'name' => 'Noble Company',
    'password' => Hash::make('12345678'),
    'type' => 'company',
    'lang' => 'ar',
    'created_by' => $superAdmin->id
]);
$noble->type = 'company';
$noble->name = 'Noble Company';
$noble->created_by = $superAdmin->id;
$noble->save();

// Assign them the 'company' role
$companyExample->assignRole('company');
$dion->assignRole('company');
$noble->assignRole('company');

// Make specific inner scoped roles (vendor, client, staff) for these companies
User::MakeRole($companyExample->id);
User::MakeRole($dion->id);
User::MakeRole($noble->id);

// 5. Delete any OTHER company users
$allowedCompanyEmails = ['company@example.com', 'contact@dion.sy', 'admin@noble.com'];
User::where('type', 'company')->whereNotIn('email', $allowedCompanyEmails)->delete();

// Delete any OTHER superadmins just in case
User::where('type', 'superadmin')->where('id', '!=', $superAdmin->id)->delete();

// 6. Transfer ALL employees/staff to Noble Company!
// Find staff roles
$nobleStaffRole = Role::where('name', 'staff')->where('created_by', $noble->id)->first();

$employees = User::whereNotIn('type', ['superadmin', 'company'])->get();
foreach($employees as $emp) {
    $emp->created_by = $noble->id;
    $emp->creator_id = $noble->id;
    $emp->type = 'employee'; // Or whatever type it should be, usually just keep current but standard is 'staff' or 'employee'
    $emp->save();
    
    // Attempt to sync role correctly to the scoped role
    if ($nobleStaffRole) {
        $emp->syncRoles([$nobleStaffRole]);
    }
}

// Update `employees` table too (the HR module data)
DB::table('employees')->update(['created_by' => $noble->id]);

// If there are any previous super admin `admin@noblearchitecture.net`, we can completely delete it to avoid confusion
User::where('email', 'admin@noblearchitecture.net')->delete();

echo "Migration Complete.\n";
echo "Active SuperAdmin: {$superAdmin->name} ({$superAdmin->email})\n";
echo "Active Companies:\n";
echo " - {$companyExample->name} ({$companyExample->email})\n";
echo " - {$dion->name} ({$dion->email})\n";
echo " - {$noble->name} ({$noble->email})\n";
echo "Total employees transferred to Noble: " . $employees->count() . "\n";
