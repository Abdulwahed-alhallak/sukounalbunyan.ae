<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Carbon\Carbon;

$csvFile = dirname(__DIR__) . '/nobel Employee S Data.csv';
$file = fopen($csvFile, "r");
$header = fgetcsv($file); 

function parseDate($str) {
    if (!$str || $str === '#N/A' || $str === 'n/a' || $str === 'N/A') return null;
    try { return Carbon::parse(trim($str))->format('Y-m-d'); } catch (\Exception $e) { return null; }
}
function parseString($str) {
    $str = trim($str);
    if ($str === '#N/A' || $str === 'n/a' || $str === 'N/A') return null;
    return $str === '' ? null : $str;
}
function parseBoolean($str) {
    $str = strtoupper(trim($str));
    if ($str === '#N/A' || $str === 'N/A' || empty($str)) return 0;
    if ($str === 'TRUE' || $str === '1' || $str === 'YES' || $str === 'ACTIVE') return 1;
    return 0;
}
function parseNumber($str) {
    $str = trim($str);
    if (empty($str) || $str === '#N/A' || $str === 'n/a' || $str === 'N/A') return null;
    return filter_var($str, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
}

Schema::disableForeignKeyConstraints();

while (($data = fgetcsv($file)) !== FALSE) {
    if (empty($data[0]) || empty($data[1])) continue; 

    try {
        $email = parseString($data[15]) ?: parseString($data[14]) ?: rand(1,999) . '@test.com';
        $employeeIdSafe = parseString($data[34]) ?: parseString($data[0]);

        $employeeData = [
            'user_id' => 1,
            'application_id' => parseString($data[0]),
            'name_ar' => parseString($data[2]),
            'date_of_birth' => parseDate($data[3]),
            'nationality' => parseString($data[4]),
            'marital_status' => parseString($data[5]),
            'place_of_birth' => parseString($data[6]),
            'gender' => strtolower(trim($data[7] ?? '')) === 'm' || strtolower(trim($data[7] ?? '')) === 'male' ? 'Male' : 'Female',
            'marital_status2' => parseString($data[8]),
            'religion' => parseString($data[9]),
            'no_of_dependents' => (int)($data[10] ?? 0),
            'blood_type' => parseString($data[11]),
            'mobile_no' => parseString($data[12]),
            'alternate_mobile_no' => parseString($data[13]),
            'email_address' => parseString($data[14]),
            'work_email' => parseString($data[15]),
            'place_of_residence' => parseString($data[16]),
            'address_line_1' => parseString($data[17]),
            'resident_type' => parseString($data[18]),
            'iqama_no' => parseString($data[19]),
            'passport_no' => parseString($data[20]),
            'employee_status' => parseString($data[21]),
            'oct_active' => parseBoolean($data[22]),
            'employer_number' => parseString($data[23]),
            'occupation' => parseString($data[24]),
            'education_level' => parseString($data[25]),
            'university' => parseString($data[26]),
            'major_field' => parseString($data[27]),
            'graduation_year' => parseString($data[28]),
            'total_experience_years' => parseNumber($data[29]),
            'computer_skills' => parseString($data[30]),
            'english_level' => parseString($data[31]),
            'arabic_level' => parseString($data[32]),
            'other_languages' => parseString($data[33]),
            'employee_id' => $employeeIdSafe, 
            'job_title' => parseString($data[35]),
            'job_title_ar' => parseString($data[36]),
            'date_of_joining' => parseDate($data[37]),
            'gosi_joining_date' => parseDate($data[38]),
            'allocated_area' => parseString($data[39]),
            'employment_type' => parseString($data[41]),
            'line_manager' => parseString($data[42]),
            'iqama_issue_date' => parseDate($data[43]),
            'iqama_expiry_date' => parseDate($data[44]),
            'passport_expiry_date' => parseDate($data[45]),
            'list_type' => parseString($data[46]),
            'jisr_active' => parseBoolean($data[47]),
            'notes' => parseString($data[48]),
            'insurance_status' => parseString($data[49]),
            'insurance_class' => parseString($data[50]),
            'sponsor_id' => parseString($data[51]) ? rtrim(parseString($data[51]), ',') : null,
            'basic_salary' => parseNumber($data[52]),
            'payment_method' => parseString($data[53]),
            'bank_name' => parseString($data[54]),
            'account_holder_name' => parseString($data[55]),
            'bank_iban' => parseString($data[56]),
            'swift_code' => parseString($data[57] ?? ''),
            'created_by' => 1
        ];

        DB::table('employees')->updateOrInsert(['employee_id' => $employeeIdSafe], $employeeData);
        echo "Row 1 inserted testing.\n"; break; // Stop after 1
    } catch (\Exception $e) {
        $msg = $e->getMessage();
        echo "Pure Error: " . substr($msg, strpos($msg, "SQLSTATE") ?: 0, 300) . "...\n";
        break;
    }
}
