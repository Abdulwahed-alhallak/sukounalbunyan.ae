<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
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
echo "🚀 AUTOMATICALLY INJECTING FULL CSV TO DATABASE VIA CORE IMPORT LOGIC 🚀\n";
echo "=================================================\n\n";

$csvFilePath = __DIR__ . '/../../nobel Employee S Data.csv';
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
        
        $applicationId = trim($data['Application ID'] ?? '');
        $iqamaNo = trim($data['ID/Iqama No.'] ?? '');
        $name = trim($data['Name'] ?? '');
        
        if (empty($name)) { $skipped++; continue; }

        $email = trim($data['Email Address'] ?? '');
        if(empty($email) || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $email = 'emp_' . strtolower(Str::random(6)) . '@' . parse_url(url('/'), PHP_URL_HOST);
        }

        $deptName = trim($data['Department'] ?? '');
        $departmentId = null;
        $branchId = null;
        if (!empty($deptName)) {
            $parts = array_map('trim', explode('/', $deptName));
            $branchName = count($parts) > 1 ? $parts[0] : 'Main Branch';
            $cleanDeptName = count($parts) > 1 ? $parts[1] : $deptName;

            $branch = Branch::firstOrCreate(
                ['branch_name' => $branchName, 'created_by' => $creatorId],
                ['created_by' => $creatorId]
            );
            $branchId = $branch->id;

            $department = Department::firstOrCreate(
                ['department_name' => $cleanDeptName, 'branch_id' => $branchId, 'created_by' => $creatorId],
                ['created_by' => $creatorId]
            );
            $departmentId = $department->id;
        }

        $jobTitle = trim($data['Job Title'] ?? '');
        if(empty($jobTitle)) $jobTitle = trim($data['Occupation'] ?? 'Employee');
        $designationId = null;
        if (!empty($jobTitle) && $departmentId) {
            $designation = Designation::firstOrCreate(
                ['designation_name' => $jobTitle, 'department_id' => $departmentId, 'created_by' => $creatorId],
                ['branch_id' => $branchId, 'created_by' => $creatorId]
            );
            $designationId = $designation->id;
        }

        /** @var \Noble\Hrm\Models\Employee|null $existingEmployee */
        $existingEmployee = Employee::where('created_by', $creatorId)
            ->where(function ($q) use ($applicationId, $iqamaNo) {
                if(!empty($applicationId)) $q->orWhere('application_id', $applicationId);
                if(!empty($iqamaNo) && $iqamaNo != 'n/a' && $iqamaNo != '#N/A') $q->orWhere('iqama_no', $iqamaNo);
            })->first();

        $dbUser = null;
        if ($existingEmployee) {
            /** @var \App\Models\User|null $dbUser */
            $dbUser = User::find($existingEmployee->user_id);
        }

        if (!$dbUser) {
            $dbUser = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('123456'),
                'type' => 'employee',
                'lang' => 'en',
                'created_by' => $creatorId,
            ]);
            if (\Spatie\Permission\Models\Role::where('name', 'employee')->exists()) {
                $dbUser->assignRole('employee');
            }
        } else {
            $dbUser->update(['name' => $name]);
        }

        $parseBoolean = function($val) {
            $val = strtoupper(trim($val));
            return ($val === 'TRUE' || $val === '1' || $val === 'YES') ? 1 : 0;
        };

        $parseDate = function($val) {
            $val = trim($val);
            if(empty($val) || $val == 'N/A' || $val == 'n/a') return null;
            try { return \Carbon\Carbon::parse($val)->format('Y-m-d'); } catch(\Exception $e) { return null; }
        };

        $parseNumeric = function($val, $default = 0) {
            $val = trim($val);
            if ($val === '' || $val === 'n/a' || $val === '#N/A' || $val === 'N/A') return $default;
            $clean = str_replace([',', ' '], '', $val);
            return is_numeric($clean) ? $clean : $default;
        };

        $empData = [
            'user_id' => $dbUser->id,
            'employee_id' => trim($data['Employee  ID'] ?? '') ?: Employee::generateEmployeeId(),
            'application_id' => $applicationId,
            'name_ar' => trim($data['Name (Ar)'] ?? ''),
            'date_of_birth' => $parseDate($data['Birthdate'] ?? null),
            'gender' => strtolower(trim($data['Gender'] ?? '')) == 'female' ? 'Female' : 'Male',
            'nationality' => trim($data['Nationality'] ?? ''),
            'marital_status' => trim($data['Marital Status'] ?? ''),
            'marital_status2' => trim($data['Marital Status2'] ?? ''),
            'place_of_birth' => trim($data['Place of Birth'] ?? ''),
            'religion' => trim($data['Religion'] ?? ''),
            'no_of_dependents' => $parseNumeric($data['No. of Dependents'] ?? 0),
            'blood_type' => trim($data['Blood Type'] ?? ''),
            'mobile_no' => trim($data['Mobile No.'] ?? ''),
            'alternate_mobile_no' => trim($data['Alternate Mobile No.'] ?? ''),
            'email_address' => $email,
            'work_email' => trim($data['Work Email'] ?? ''),
            'place_of_residence' => trim($data['Place of residence'] ?? ''),
            'resident_type' => trim($data['Resident Type'] ?? ''),
            'address_line_1' => trim($data['Address'] ?? ''),
            'iqama_no' => $iqamaNo,
            'passport_no' => trim($data['Passport No.'] ?? ''),
            'iqama_issue_date' => $parseDate($data['Iqama Issue Date'] ?? null),
            'iqama_expiry_date' => $parseDate($data['Iqama Expiry Date'] ?? null),
            'passport_expiry_date' => $parseDate($data['Passport Expiry Date'] ?? null),
            'employer_number' => trim($data['Employer Number'] ?? ''),
            'occupation' => trim($data['Occupation'] ?? ''),
            'job_title' => $jobTitle,
            'job_title_ar' => trim($data['JOP Title Arabic'] ?? ''),
            'allocated_area' => trim($data['Allocated Area'] ?? ''),
            'line_manager' => trim($data['Line manager'] ?? ''),
            'date_of_joining' => $parseDate($data['Joining Date'] ?? null),
            'gosi_joining_date' => $parseDate($data['تاريخ الإلتحاق حسب التامينات'] ?? null),
            'employment_type' => trim($data['Employment Type'] ?? 'Full Time'),
            'employee_status' => trim($data['Statue'] ?? 'Active'),
            'oct_active' => $parseBoolean($data['OCT ACTIVE'] ?? 'FALSE'),
            'jisr_active' => $parseBoolean($data['JISR'] ?? 'FALSE'),
            'list_type' => trim($data['List'] ?? ''),
            'notes' => trim($data['Note'] ?? ''),
            'insurance_status' => trim($data['Insurance Status'] ?? ''),
            'insurance_class' => trim($data['Insurance Class'] ?? ''),
            'sponsor_id' => trim($data['Sponsor ID'] ?? ''),
            'basic_salary' => $parseNumeric($data['Total Salary'] ?? 0),
            'payment_method' => trim($data['Payment Method'] ?? 'Bank Transfer'),
            'bank_name' => trim($data['Bank Name'] ?? ''),
            'account_holder_name' => trim($data['Account Holder Name'] ?? ''),
            'bank_iban' => trim($data['Bank IBAN No'] ?? ''),
            'swift_code' => trim($data['SWIFT Code'] ?? ''),
            'education_level' => trim($data['Education Level'] ?? ''),
            'university' => trim($data['University/Institution'] ?? ''),
            'major_field' => trim($data['Major / Field of Study'] ?? ''),
            'graduation_year' => $parseNumeric($data['Graduation Year'] ?? null, null),
            'total_experience_years' => $parseNumeric($data['Total Years of Experience'] ?? 0),
            'computer_skills' => trim($data['Computer Skills Level'] ?? ''),
            'english_level' => trim($data['English Level'] ?? ''),
            'arabic_level' => trim($data['Arabic Level'] ?? ''),
            'other_languages' => trim($data['Other Languages'] ?? ''),
            'branch_id' => $branchId,
            'department_id' => $departmentId,
            'designation_id' => $designationId,
            'creator_id' => $creatorId,
            'created_by' => $creatorId,
        ];

        if ($existingEmployee) {
            $existingEmployee->update($empData);
            $updated++;
        } else {
            $emp = new Employee();
            $emp->fill($empData);
            $emp->save();
            $added++;
        }
    }
    fclose($fileHandle);
    DB::commit();

    echo "✅ Operation successful.\n";
    echo "📊 Total Added: {$added}\n";
    echo "♻️ Total Updated: {$updated}\n";
    echo "⚠️ Total Skipped: {$skipped}\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "❌ Execution Failed: " . $e->getMessage() . "\n";
}
