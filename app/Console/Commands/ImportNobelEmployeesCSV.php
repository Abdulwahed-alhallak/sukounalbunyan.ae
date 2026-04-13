<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Noble\Hrm\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ImportNobelEmployeesCSV extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'noble:import-employees {file} {--company= : ID of the company to attach to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import employees and matching user accounts from the Nobel S Data CSV';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');
        $companyId = $this->option('company');

        if (!file_exists($file)) {
            $this->error("File not found at: {$file}");
            return;
        }

        if (!$companyId) {
            $company = User::where('type', 'company')->first();
            if (!$company) {
                $this->error("No company user found to attach employees to. Please specify --company=ID");
                return;
            }
            $companyId = $company->id;
            $this->info("No company specified, defaulting to company ID: {$companyId}");
        }

        $handle = fopen($file, "r");
        if ($handle === FALSE) {
            $this->error("Could not read file.");
            return;
        }

        $headers = fgetcsv($handle);
        $headerMap = array_flip($headers);

        $this->info("Importing records...");

        DB::beginTransaction();
        try {
            $count = 0;
            while (($data = fgetcsv($handle, 4000, ",")) !== FALSE) {
                if (!isset($data[0]) || trim($data[0]) === '') continue;

                $applicationId = $this->getVal($data, $headerMap, 'Application ID') ?: Str::uuid();
                $name = $this->getVal($data, $headerMap, 'Name') ?: 'Unknown';
                $nameAr = $this->getVal($data, $headerMap, 'Name (Ar)');
                $email = $this->getVal($data, $headerMap, 'Work Email') ?: $this->getVal($data, $headerMap, 'Email Address');
                
                if (empty(trim($email)) || strtolower($email) === 'n/a') {
                    $email = strtolower(str_replace(' ', '.', trim($name))) . mt_rand(100, 9999) . '@noble.local';
                }

                // 1. Create or Find User
                $user = User::where('email', $email)->first();
                if (!$user) {
                    $user = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make('password123'),
                        'type' => 'staff',
                        'mobile_no' => $this->getVal($data, $headerMap, 'Mobile No.'),
                        'created_by' => $companyId,
                        'is_enable_login' => 0
                    ]);
                    
                    if (class_exists(\Spatie\Permission\Models\Role::class)) {
                        $role = \Spatie\Permission\Models\Role::where('name', 'staff')->where('created_by', $companyId)->first();
                        if ($role) $user->assignRole($role);
                    }
                }

                // 2. Format Dates
                $dob = $this->parseDate($this->getVal($data, $headerMap, 'Birthdate'));
                $doj = $this->parseDate($this->getVal($data, $headerMap, 'Joining Date'));

                // 3. Employee ID
                $csvEmpId = $this->getVal($data, $headerMap, 'Employee ID');
                if (empty($csvEmpId)) $csvEmpId = $this->getVal($data, $headerMap, 'Employee  ID'); // Some headers have double spaces
                $empId = !empty($csvEmpId) ? $csvEmpId : Employee::generateEmployeeId();

                // 4. Create or update Employee Record
                $employeeData = [
                    'user_id' => $user->id,
                    'name_ar' => $nameAr,
                    'employee_id' => cloneVal($empId, $applicationId),
                    'nationality' => $this->getVal($data, $headerMap, 'Nationality'),
                    'marital_status' => $this->getVal($data, $headerMap, 'Marital Status'),
                    'place_of_birth' => $this->getVal($data, $headerMap, 'Place of Birth'),
                    'gender' => $this->getVal($data, $headerMap, 'Gender') ?: 'Male',
                    'blood_type' => $this->getVal($data, $headerMap, 'Blood Type'),
                    'mobile_no' => $this->getVal($data, $headerMap, 'Mobile No.'),
                    'email_address' => $email,
                    'address_line_1' => $this->getVal($data, $headerMap, 'Address') ?: $this->getVal($data, $headerMap, 'Place of residence'),
                    'iqama_no' => $this->getVal($data, $headerMap, 'ID/Iqama No.'),
                    'passport_no' => $this->getVal($data, $headerMap, 'Passport No.'),
                    'employee_status' => $this->getVal($data, $headerMap, 'Statue') ?: 'Active',
                    'employer_number' => $this->getVal($data, $headerMap, 'Employer Number'),
                    'job_title' => $this->getVal($data, $headerMap, 'Job Title') ?: $this->getVal($data, $headerMap, 'Occupation'),
                    'job_title_ar' => $this->getVal($data, $headerMap, 'JOP Title Arabic'),
                    'date_of_joining' => $doj,
                    'basic_salary' => (float) $this->getVal($data, $headerMap, 'Total Salary'),
                    'payment_method' => $this->getVal($data, $headerMap, 'Payment Method'),
                    'bank_name' => $this->getVal($data, $headerMap, 'Bank Name'),
                    'bank_iban' => $this->getVal($data, $headerMap, 'Bank IBAN No'),
                    'created_by' => $companyId,
                    'creator_id' => $companyId
                ];

                Employee::updateOrCreate(
                    ['application_id' => cloneVal($applicationId, Str::uuid()), 'created_by' => $companyId],
                    $employeeData
                );

                $count++;
            }
            fclose($handle);
            DB::commit();
            $this->info("Successfully imported {$count} distinct employee records into the Noble Architecture Database!");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Import Failed: " . $e->getMessage() . " at line " . $e->getLine());
        }
    }

    private function getVal($data, $map, $key) {
        if (!isset($map[$key])) return null;
        $index = $map[$key];
        return isset($data[$index]) ? trim($data[$index]) : null;
    }

    private function parseDate($val) {
        if (empty(trim($val))) return null;
        try {
            return Carbon::parse($val)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}

function cloneVal($val, $fallback) {
    return !empty($val) ? (string)$val : (string)$fallback;
}
