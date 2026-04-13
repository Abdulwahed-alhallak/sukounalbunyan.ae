<?php
/**
 * IMPORT EMPLOYEES FROM CSV (HRM Module)
 * Run: php _scripts/import_hrm_employees_csv.php
 */

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Noble\Hrm\Models\Employee;

echo "=================================================\n";
echo "🚀 INITIATING HRM EMPLOYEES CSV IMPORT 🚀\n";
echo "=================================================\n\n";

$csvFilePath = __DIR__ . '/../../nobel Employee S Data.csv';

if (!file_exists($csvFilePath)) {
    die("❌ Error: CSV file not found at $csvFilePath\n");
}

$file = fopen($csvFilePath, 'r');
$headers = fgetcsv($file); // Read headers

// Set default company / creator ID
$companyId = 1; // Assuming 1 is the main company

$successCount = 0;
$skippedCount = 0;

while (($row = fgetcsv($file)) !== false) {
    if (empty(array_filter($row))) continue; // Skip empty rows

    // Determine basic info mapping
    $applicationId = $row[0] ?? null;
    $englishName = !empty($row[1]) ? $row[1] : null;
    $arabicName = !empty($row[2]) ? $row[2] : null;

    if (!$englishName && !$arabicName) {
        $skippedCount++;
        continue;
    }

    $finalName = $englishName ?? $arabicName;
    
    // Check if Employee already exists by Application ID or Name
    $existingEmployee = null;
    if ($applicationId) {
        $existingEmployee = Employee::where('application_id', $applicationId)->first();
    }
    
    // Also try checking by Name 
    $user = User::where('name', $finalName)->first();

    if (!$user) {
        // Create matching User (so they can potentially login or be referenced)
        $email = (!empty($row[14]) && $row[14] !== 'n/a') ? $row[14] : strtolower(str_replace(' ', '.', $finalName)) . rand(100, 999) . '@dion.sy';
        
        // Prevent duplicate temporary emails
        if (User::where('email', $email)->exists()) {
             $email = 'emp_' . Str::random(5) . '@dion.sy';
        }

        $user = new User();
        $user->name = $finalName;
        $user->email = $email;
        $user->password = Hash::make('123456');
        $user->type = 'employee';
        $user->created_by = $companyId;
        $user->lang = 'ar';
        $user->save();
        $user->assignRole('employee');
    }

    if (!$existingEmployee) {
        // Build employee data
        $emp = new Employee();
        $emp->user_id = $user->id;
        $emp->created_by = $companyId;
        $emp->creator_id = $companyId;
        
        $emp->application_id = $applicationId;
        $emp->name_ar = $arabicName;
        
        // Format dates safely
        $dob = trim($row[3] ?? '');
        if ($dob && $dob !== 'n/a' && strtotime($dob)) $emp->date_of_birth = date('Y-m-d', strtotime($dob));

        $doj = trim($row[37] ?? '');
        if ($doj && $doj !== 'n/a' && strtotime($doj)) $emp->date_of_joining = date('Y-m-d', strtotime($doj));
        
        $gosiDate = trim($row[38] ?? '');
        if ($gosiDate && $gosiDate !== 'n/a' && strtotime($gosiDate)) $emp->gosi_joining_date = date('Y-m-d', strtotime($gosiDate));

        $iqamaIssue = trim($row[43] ?? '');
        if ($iqamaIssue && $iqamaIssue !== 'n/a' && strtotime($iqamaIssue)) $emp->iqama_issue_date = date('Y-m-d', strtotime($iqamaIssue));
        
        $emp->nationality = trim($row[4] ?? '');
        $emp->marital_status = trim($row[5] ?? '');
        $emp->place_of_birth = trim($row[6] ?? '');
        $emp->gender = trim($row[7] ?? '');
        $emp->marital_status2 = trim($row[8] ?? '');
        $emp->religion = trim($row[9] ?? '');
        
        // Handle Numeric Nulls
        $dependents = trim($row[10] ?? '');
        $emp->no_of_dependents = ($dependents !== '' && is_numeric($dependents)) ? (int) $dependents : 0;
        
        $emp->blood_type = trim($row[11] ?? '');
        $emp->mobile_no = trim($row[12] ?? '');
        $emp->alternate_mobile_no = trim($row[13] ?? '');
        $emp->email_address = trim($row[14] ?? '');
        $emp->work_email = trim($row[15] ?? '');
        $emp->place_of_residence = trim($row[16] ?? '');
        $emp->resident_type = trim($row[18] ?? '');
        
        $emp->iqama_no = trim($row[19] ?? '');
        $emp->passport_no = trim($row[20] ?? '');
        
        // CSV column: Statue / Employee Status (col 21)
        $rawStatus = strtoupper(trim($row[21] ?? ''));
        if (str_contains($rawStatus, 'RESIGN')) $status = 'RESIGNED';
        else if (str_contains($rawStatus, 'TERM')) $status = 'TERMINATED';
        else if (str_contains($rawStatus, 'ACTIVE')) $status = 'Active';
        else $status = 'Active';
        
        $emp->employee_status = $status;
        $emp->employer_number = trim($row[23] ?? '');
        $emp->occupation = trim($row[24] ?? '');
        
        $emp->education_level = trim($row[25] ?? '');
        $emp->university = trim($row[26] ?? '');
        $emp->major_field = trim($row[27] ?? '');
        
        $gradYear = trim($row[28] ?? '');
        $emp->graduation_year = ($gradYear !== '' && is_numeric($gradYear)) ? (int) $gradYear : null;
        
        $expYears = trim($row[29] ?? '');
        $emp->total_experience_years = ($expYears !== '' && is_numeric($expYears)) ? (int) $expYears : 0;
        
        $emp->computer_skills = trim($row[30] ?? '');
        $emp->english_level = trim($row[31] ?? '');
        $emp->arabic_level = trim($row[32] ?? '');
        
        // Employee ID (col 34)
        $customEmpId = trim($row[34] ?? '');
        $emp->employee_id = !empty($customEmpId) ? $customEmpId : Employee::generateEmployeeId();
        
        $emp->job_title = trim($row[35] ?? '');
        $emp->job_title_ar = trim($row[36] ?? '');
        $emp->allocated_area = trim($row[39] ?? '');
        
        $emp->employment_type = trim($row[41] ?? '');
        $emp->notes = trim($row[48] ?? '');
        $emp->insurance_status = trim($row[49] ?? '');
        $emp->insurance_class = trim($row[50] ?? '');
        $emp->sponsor_id = trim($row[51] ?? '');
        
        $salary = str_replace([',', ' '], '', trim($row[52] ?? '0'));
        $emp->basic_salary = is_numeric($salary) ? $salary : 0;
        
        $emp->payment_method = trim($row[53] ?? '');
        $emp->bank_name = trim($row[54] ?? '');
        $emp->account_holder_name = trim($row[55] ?? '');
        $emp->bank_iban = trim($row[56] ?? '');
        $emp->swift_code = trim($row[57] ?? '');
        
        try {
            $emp->save();
            $successCount++;
        } catch (\Exception $e) {
            echo "❌ Failed saving employee: $finalName | Error: " . $e->getMessage() . "\n";
            $skippedCount++;
        }
    } else {
        $skippedCount++; // Exists
    }
}

fclose($file);

echo "✅ SUCCESS! Imported $successCount employees.\n";
echo "⏭️  SKIPPED: $skippedCount employees (Missing Name or Already Exists).\n";
echo "=================================================\n";
