<?php
namespace App;

use App\Models\User;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Designation;
use Noble\Hrm\Models\Branch;

echo "🚀 Starting Metadata Reconstruction...\n";

// Get the main company admin (Gold Master Admin)
$admin = User::where('email', 'admin@noblearchitecture.net')->first();
if (!$admin) {
    die("❌ Error: Admin user not found.\n");
}

$employees = Employee::where('created_by', $admin->id)->get();
echo "Found " . $employees->count() . " employees.\n";

$deptsCreated = 0;
$desigsCreated = 0;
$branchesCreated = 0;
$updatedCount = 0;

foreach ($employees as $employee) {
    // 1. Handle Branch (based on allocated_area prefixes like 'JEDDAH')
    $area = $employee->allocated_area ?? 'Main Office';
    $branchName = explode(' / ', $area)[0]; // Basic heuristic
    
    $branch = Branch::firstOrCreate(
        ['branch_name' => $branchName, 'created_by' => $admin->id],
        ['creator_id' => $admin->id]
    );
    if ($branch->wasRecentlyCreated) $branchesCreated++;

    // 2. Handle Department (using the full allocated_area as the department identifier)
    $dept = Department::firstOrCreate(
        ['department_name' => $area, 'branch_id' => $branch->id, 'created_by' => $admin->id],
        ['creator_id' => $admin->id]
    );
    if ($dept->wasRecentlyCreated) $deptsCreated++;

    // 3. Handle Designation (using job_title)
    $title = $employee->job_title ?: ($employee->occupation ?: 'General Staff');
    $desig = Designation::firstOrCreate(
        ['designation_name' => $title, 'department_id' => $dept->id, 'created_by' => $admin->id],
        ['creator_id' => $admin->id]
    );
    if ($desig->wasRecentlyCreated) $desigsCreated++;

    // 4. Update Employee links
    $employee->branch_id = $branch->id;
    $employee->department_id = $dept->id;
    $employee->designation_id = $desig->id;

    if ($employee->isDirty()) {
        $employee->save();
        $updatedCount++;
    }
}

echo "✅ Reconstruction Complete:\n";
echo "- Branches Created: $branchesCreated\n";
echo "- Departments Created: $deptsCreated\n";
echo "- Designations Created: $desigsCreated\n";
echo "- Employees Linked: $updatedCount\n";
