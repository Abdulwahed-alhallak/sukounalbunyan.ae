<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Designation;
use Noble\Taskly\Models\Project;
use Noble\Taskly\Models\Task;
use Noble\Account\Models\BankAccount;
use Noble\Account\Models\BankTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class QaStressTestSeeder extends Seeder
{
    /**
     * Run the QA Life Cycle Stress Test.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting QA Stress Test & Workflow Lifecycle Seeder (Noble Architecture)...');

        $tenantId = 2; // Assuming Demo Company ID
        $company = User::find($tenantId);
        
        if (!$company) {
            $this->command->error('Company (Tenant ID 2) not found. Aborting.');
            return;
        }

        DB::beginTransaction();
        try {
            // ==========================================
            // 1. Create Core HR Structures
            // ==========================================
            $this->command->info('1️⃣ Creating Departments and Designations...');
            $devDept = Department::firstOrCreate(['department_name' => 'التطوير البرمجي', 'created_by' => $tenantId]);
            $designDept = Department::firstOrCreate(['department_name' => 'التصميم والإبداع', 'created_by' => $tenantId]);
            $financeDept = Department::firstOrCreate(['department_name' => 'الإدارة المالية', 'created_by' => $tenantId]);

            $devDesig = Designation::firstOrCreate(['designation_name' => 'مطور واجهات متقدم', 'department_id' => $devDept->id, 'created_by' => $tenantId]);
            $designDesig = Designation::firstOrCreate(['designation_name' => 'مصمم واجهات وتجربة مستخدم', 'department_id' => $designDept->id, 'created_by' => $tenantId]);
            
            // ==========================================
            // 2. Hire Employees (Lifecycle)
            // ==========================================
            $this->command->info('2️⃣ Hiring QA Stress Test Employees...');
            $employees = [];
            $names = ['أحمد سامي', 'فاطمة الزهراء', 'يوسف كريم', 'ليلى عبدالرحمن', 'عمر الفاروق'];
            
            foreach ($names as $index => $name) {
                // Check if user exists first to prevent duplicate email constraint error
                $email = 'qa_' . $index . '@noble.test';
                $user = User::where('email', $email)->first();
                
                if(!$user){
                     $user = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make('12345678'),
                        'type' => 'employee',
                        'lang' => 'ar',
                        'created_by' => $tenantId,
                        'email_verified_at' => now(),
                    ]);
                }

                $emp = Employee::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'name_ar' => $name,
                        'date_of_birth' => '1990-01-01',
                        'gender' => ($index % 2 == 0) ? 'Male' : 'Female',
                        'mobile_no' => '050000000' . $index,
                        'address_line_1' => 'دبي، الإمارات',
                        'employee_id' => 'EMP-QA-' . rand(1000, 9999),
                        'department_id' => ($index % 2 == 0) ? $devDept->id : $designDept->id,
                        'designation_id' => ($index % 2 == 0) ? $devDesig->id : $designDesig->id,
                        'date_of_joining' => Carbon::now()->subMonths(2)->format('Y-m-d'),
                        'created_by' => $tenantId,
                    ]
                );
                $employees[] = $user;
            }

            // ==========================================
            // 3. Create Massive Projects & Cross-Delegation
            // ==========================================
            $this->command->info('3️⃣ Creating Corporate Projects & Delegating Tasks...');
            $projects = [];
            
            // Need a task stage to assign to.
            $taskStage = \Noble\Taskly\Models\TaskStage::firstOrCreate([
                'name' => 'To Do',
                'created_by' => $tenantId
            ], [
                'order' => 0,
                'color' => '#000000',
                'complete' => 0
            ]);

            for ($i = 1; $i <= 3; $i++) {
                $project = Project::firstOrCreate(
                    ['name' => "مشروع تطوير النواة المعمارية - المرحلة $i", 'created_by' => $tenantId],
                    [
                        'status' => 'Ongoing',
                        'description' => 'مشروع حيوي لاختبار دورة حياة الموظف وتقييم الكفاءات ضمن نظام Noble Architecture.',
                        'start_date' => Carbon::now()->subDays(10)->format('Y-m-d'),
                        'end_date' => Carbon::now()->addDays(30)->format('Y-m-d'),
                        'budget' => rand(50000, 150000),
                    ]
                );
                
                // Assign project to the generated employees using correct relationship
                $project->teamMembers()->sync(collect($employees)->pluck('id')->toArray());
                $projects[] = $project;

                // Create Tasks (Kanban Simulation)
                for ($t = 1; $t <= 5; $t++) {
                   $task = \Noble\Taskly\Models\ProjectTask::firstOrCreate(
                       ['title' => "مهمة تقنية $t - للمشروع $i", 'project_id' => $project->id],
                       [
                           'priority' => ['High', 'Medium', 'Low'][rand(0,2)],
                           'description' => 'وصف المهمة المطلوبة لاختبار جودة النظام وتماسكه.',
                           'stage_id' => $taskStage->id,
                           'duration' => rand(5, 40),
                           'assigned_to' => $employees[rand(0, 4)]->id, // Comma separated IDs in real app, we assign one for now
                           'created_by' => $tenantId,
                       ]
                   );
                }
            }

            // ==========================================
            // 4. Financial Triggers (Double Entry)
            // ==========================================
            $this->command->info('4️⃣ Simulating Financial Impact (Bank Transactions)...');
            
            $bankAccount = BankAccount::where('created_by', $tenantId)->first();
            if (!$bankAccount) {
                 $bankAccount = BankAccount::create([
                    'account_name' => 'حساب الشركة الرئيسي',
                    'bank_name' => 'بنك الإمارات دبي الوطني',
                    'account_number' => '1000' . rand(1111,9999),
                    'opening_balance' => 1000000,
                    'current_balance' => 1000000,
                    'is_active' => 1,
                    'created_by' => $tenantId
                 ]);
            }

            foreach ($projects as $project) {
                BankTransaction::create([
                    'bank_account_id' => $bankAccount->id,
                    'transaction_date' => Carbon::now()->format('Y-m-d'),
                    'transaction_type' => 'credit',
                    'reference_number' => 'PROJ-PAY-' . $project->id . '-' . rand(100,999),
                    'description' => "دفعة مقدمة لمشروع: " . $project->name,
                    'amount' => $project->budget * 0.3, // 30% advance
                    'running_balance' => $bankAccount->opening_balance + ($project->budget * 0.3),
                    'transaction_status' => 'cleared',
                    'reconciliation_status' => 'unreconciled',
                    'created_by' => $tenantId
                ]);
            }

            DB::commit();
            $this->command->info('');
            $this->command->info('🎉 QA STRESS TEST COMPLETED SUCCESSFULLY! 🎉');
            $this->command->info('- 5 Mock Employees created (HRM Lifecycle).');
            $this->command->info('- 3 Massive Projects created with Cross-Department Delegation.');
            $this->command->info('- 15 Kanban Tasks Distributed.');
            $this->command->info('- Financial Revenue logged directly to Bank Transactions.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('❌ Stress Test Failed: ' . $e->getMessage());
        }
    }
}
