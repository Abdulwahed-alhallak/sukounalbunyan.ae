<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

$csvFile = dirname(__DIR__) . '/noble Employee S Data.csv';
if (!file_exists($csvFile)) {
    echo "CSV file not found: $csvFile\n";
    exit(1);
}

$file = fopen($csvFile, "r");
$header = fgetcsv($file); // Skip header

$importedCount = 0;
while (($data = fgetcsv($file)) !== FALSE) {
    if (empty($data[0]) || empty($data[1])) continue; // Skip empty rows

    // App ID: $data[0]
    // Name: $data[1]
    // Name_Ar: $data[2]
    // Birthdate: $data[3]
    // Nationality: $data[4]
    // Marital Status: $data[5]
    // Phone: $data[12]
    // Email: $data[14]
    // Work Email: $data[15]

    try {
        DB::beginTransaction();

        $email = !empty($data[15]) ? $data[15] : (!empty($data[14]) ? $data[14] : strtolower(str_replace(' ', '.', $data[1])) . '@noblearchitecture.net');
        $email = filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : rand(100,999) . $email;

        // Create or update User
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $data[1],
                'password' => Hash::make('12345678'),
                'type' => 'employee',
                'lang' => 'ar',
                'created_by' => 1, // Assume created by superadmin or company
                // Adjust branch/company IDs if necessary
            ]
        );

        // Map CSV fields to employees table columns
        $employeeData = [
            'user_id' => $user->id,
            'name_ar' => $data[2],
            'date_of_birth' => !empty(trim($data[3])) ? date('Y-m-d', strtotime(trim($data[3]))) : null,
            'nationality' => $data[4],
            'marital_status' => $data[5],
            'place_of_birth' => $data[6],
            'gender' => $data[7] === 'M' || strtolower($data[7]) === 'male' ? 'Male' : (empty($data[7]) ? 'Male' : 'Female'),
            'religion' => $data[9],
            'no_of_dependents' => intval($data[10]),
            'blood_type' => $data[11],
            'mobile_no' => $data[12],
            'alternate_mobile_no' => $data[13],
            'email_address' => $data[14],
            'work_email' => $data[15],
            'place_of_residence' => $data[16],
            'address_line_1' => $data[17],
            'resident_type' => $data[18],
            'iqama_no' => $data[19],
            'passport_no' => $data[20],
            'employee_status' => $data[21] === '#N/A' ? 'Inactive' : $data[21],
            'oct_active' => in_array(strtoupper(trim($data[22])), ['1', 'TRUE', 'YES']) ? 1 : 0,
            'employer_number' => $data[23],
            'occupation' => $data[24],
            'education_level' => $data[25],
            'university' => $data[26],
            'major_field' => $data[27],
            'graduation_year' => $data[28],
            'total_experience_years' => intval($data[29]),
            'computer_skills' => $data[30],
            'english_level' => $data[31],
            'arabic_level' => $data[32],
            'other_languages' => $data[33],
            'employee_id' => $data[34], // Employee ID like S-01-2017
            'job_title' => $data[35],
            'job_title_ar' => $data[36],
            'date_of_joining' => !empty(trim($data[37])) ? date('Y-m-d', strtotime(trim($data[37]))) : null,
            'gosi_joining_date' => !empty(trim($data[38])) ? date('Y-m-d', strtotime(trim($data[38]))) : null,
            'allocated_area' => $data[39],
            // Department: $data[40] => you might need to resolve ID
            'employment_type' => $data[41],
            'line_manager' => $data[42],
            'iqama_issue_date' => !empty(trim($data[43])) ? date('Y-m-d', strtotime(trim($data[43]))) : null,
            'iqama_expiry_date' => !empty(trim($data[44])) ? date('Y-m-d', strtotime(trim($data[44]))) : null,
            'passport_expiry_date' => !empty(trim($data[45])) ? date('Y-m-d', strtotime(trim($data[45]))) : null,
            'list_type' => $data[46],
            'jisr_active' => in_array(strtoupper(trim($data[47])), ['1', 'TRUE', 'YES']) ? 1 : 0,
            'notes' => $data[48],
            'insurance_status' => $data[49],
            'insurance_class' => $data[50],
            'sponsor_id' => rtrim($data[51], ','),
            'basic_salary' => floatval($data[52]),
            'payment_method' => $data[53],
            'bank_name' => $data[54],
            'account_holder_name' => $data[55],
            'bank_iban' => $data[56],
            'swift_code' => isset($data[57]) ? $data[57] : '',
            
            // Required default values for branches/departments
            'branch_id' => 1,
            'department_id' => 1,
            'designation_id' => 1,
            'created_by' => 1,
        ];

        DB::table('employees')->updateOrInsert(
            ['employee_id' => $data[34]], // Use employee_id to avoid duplicates
            $employeeData
        );
        
        DB::commit();
        $importedCount++;
    } catch (\Exception $e) {
        DB::rollBack();
        file_put_contents('csv_import_errors.txt', "Error importing Row {$data[0]}: " . $e->getMessage() . "\n", FILE_APPEND);
        echo "Error importing Row {$data[0]}: " . $e->getMessage() . "\n";
    }
}

fclose($file);
echo "Successfully imported/updated $importedCount employees.\n";

