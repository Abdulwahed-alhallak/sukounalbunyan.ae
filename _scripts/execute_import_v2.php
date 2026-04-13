<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Branch;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Designation;
use Illuminate\Support\Facades\DB;

function creatorId() { 
    $user = User::where('type', 'superadmin')->orWhere('type', 'company')->first();
    return $user ? $user->id : 1; 
}

echo "=================================================\n";
echo "🚀 REMOTE INJECTING CSV TO PRODUCTION DATABASE 🚀\n";
echo "=================================================\n\n";

$csvFilePath = __DIR__ . '/nobel_Employee_S_Data.csv';
if (!file_exists($csvFilePath)) {
    die("ERROR: CSV File not found at $csvFilePath\n");
}

$fileHandle = fopen($csvFilePath, 'r');
$bom = fread($fileHandle, 3);
if ($bom !== "\xef\xbb\xbf") rewind($fileHandle);

$headers = fgetcsv($fileHandle);
$headers = array_map('trim', $headers);

$creatorId = creatorId();
$added = 0;
$updated = 0;
$skipped = 0;

DB::beginTransaction();
try {
    while (($row = fgetcsv($fileHandle, 10000, ',')) !== false) {
        if(count($headers) !== count($row)) { $skipped++; continue; }
        
        $data = array_combine($headers, $row);
        
        $email = trim($data['Email'] ?? '');
        $name = trim($data['Name'] ?? $data['Full Name'] ?? '');
        
        if (empty($name)) { $skipped++; continue; }
        if (empty($email)) {
             $email = Str::slug($name) . rand(10, 99) . '@noble.sy';
        }

        Employee::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'employee_id' => $data['Application ID'] ?? $data['ID/Iqama No.'] ?? rand(10000, 99999),
                'dob' => null,
                'gender' => 'Male',
                'phone' => $data['Mobile No.'] ?? null,
                'address' => null,
                'email' => $email,
                'password' => Hash::make('123456'),
                'department_id' => 1,
                'designation_id' => 1,
                'company_id' => 1,
                'created_by' => $creatorId,
            ]
        );
        $added++;
    }
    DB::commit();
    echo "SUCCESS: Added/Updated $added records.\n";
    echo "Skipped: $skipped records.\n";
} catch (\Exception $e) {
    DB::rollback();
    echo "CRITICAL ERROR: " . $e->getMessage() . "\n";
}
fclose($fileHandle);
