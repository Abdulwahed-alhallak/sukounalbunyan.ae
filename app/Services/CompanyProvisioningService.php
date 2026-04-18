<?php

namespace App\Services;

use App\Models\User;
use Database\Seeders\PackageSeeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Noble\Hrm\Models\Branch;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Designation;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Shift;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CompanyProvisioningService
{
    public function provision(?int $companyId = null): array
    {
        $company = $this->resolveCompany($companyId);

        User::MakeRole($company->id);
        $baseUsers = $this->ensureBaseUsers($company);

        config(['app.run_demo_seeder' => true]);
        (new PackageSeeder())->run($company->id);

        $roles = $this->syncRoleLabelsAndPermissions($company);
        $users = $this->syncOperationalUsers($company, $roles, $baseUsers);
        $this->backfillEmployees($company);
        $this->ensureWarehouseInventory($company);
        $this->ensureTasklyBackfill($company);
        $this->ensureLeadBackfill($company);
        $this->ensureSalesBackfill($company);
        $this->ensureAttendanceBackfill($company);
        $this->normalizeEmployeeIds($company);

        $csvPath = $this->exportEmployeesCsv($company);

        return [
            'company' => $company,
            'roles' => array_keys($roles),
            'users' => $users,
            'csv_path' => $csvPath,
            'audit' => $this->collectAudit($company),
        ];
    }

    public function exportEmployeesCsv(User $company, ?string $relativePath = null): string
    {
        $relativePath = $relativePath ?: 'exports/NOBLE-company-employees.csv';

        $employees = Employee::with(['user:id,name,email,mobile_no', 'branch:id,branch_name', 'department:id,department_name', 'designation:id,designation_name'])
            ->where('created_by', $company->id)
            ->orderBy('employee_id')
            ->get();

        $rows = [
            [
                'Employee ID',
                'Name',
                'Email',
                'Mobile',
                'Branch',
                'Department',
                'Designation',
                'Employment Type',
                'Date of Joining',
                'Basic Salary',
                'Status',
            ],
        ];

        foreach ($employees as $employee) {
            $rows[] = [
                (string) ($employee->employee_id ?? ''),
                (string) ($employee->user?->name ?? ''),
                (string) ($employee->user?->email ?? ''),
                (string) ($employee->user?->mobile_no ?? $employee->mobile_no ?? ''),
                (string) ($employee->branch?->branch_name ?? ''),
                (string) ($employee->department?->department_name ?? ''),
                (string) ($employee->designation?->designation_name ?? ''),
                (string) ($employee->employment_type ?? ''),
                (string) ($employee->date_of_joining ?? ''),
                (string) ($employee->basic_salary ?? ''),
                (string) ($employee->employee_status ?? 'Active'),
            ];
        }

        $csv = "\xEF\xBB\xBF";
        foreach ($rows as $row) {
            $escaped = array_map(function ($value) {
                $value = str_replace('"', '""', (string) $value);
                return '"' . $value . '"';
            }, $row);
            $csv .= implode(',', $escaped) . "\r\n";
        }

        Storage::disk('public')->put($relativePath, $csv);

        return storage_path('app/public/' . str_replace('/', DIRECTORY_SEPARATOR, $relativePath));
    }

    public function resolveCompany(?int $companyId = null): User
    {
        $company = $companyId
            ? User::find($companyId)
            : User::resolveDemoCompany();

        if (!$company) {
            throw new \RuntimeException('No company account is available for provisioning.');
        }

        return $company;
    }

    private function ensureBaseUsers(User $company): array
    {
        $staffRole = $this->findTenantRole($company->id, 'staff');
        $clientRole = $this->findTenantRole($company->id, 'client');
        $vendorRole = $this->findTenantRole($company->id, 'vendor');

        $definitions = [
            ['name' => 'HR Manager', 'email' => 'hr.manager@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Finance Manager', 'email' => 'finance.manager@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Project Manager', 'email' => 'project.manager@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Sales Manager', 'email' => 'sales.manager@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Support Manager', 'email' => 'support.manager@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Recruitment Manager', 'email' => 'recruitment.manager@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Operations Lead', 'email' => 'operations.lead@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Payroll Specialist', 'email' => 'payroll.specialist@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Senior Accountant', 'email' => 'senior.accountant@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Backend Developer', 'email' => 'backend.developer@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Frontend Developer', 'email' => 'frontend.developer@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'QA Engineer', 'email' => 'qa.engineer@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Marketing Specialist', 'email' => 'marketing.specialist@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Business Analyst', 'email' => 'business.analyst@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Office Coordinator', 'email' => 'office.coordinator@noblearchitecture.net', 'type' => 'staff', 'roles' => [$staffRole]],
            ['name' => 'Client Alpha', 'email' => 'client.alpha@noblearchitecture.net', 'type' => 'client', 'roles' => [$clientRole]],
            ['name' => 'Client Beta', 'email' => 'client.beta@noblearchitecture.net', 'type' => 'client', 'roles' => [$clientRole]],
            ['name' => 'Vendor Prime', 'email' => 'vendor.prime@noblearchitecture.net', 'type' => 'vendor', 'roles' => [$vendorRole]],
            ['name' => 'Vendor Nexus', 'email' => 'vendor.nexus@noblearchitecture.net', 'type' => 'vendor', 'roles' => [$vendorRole]],
        ];

        $users = [];
        foreach ($definitions as $definition) {
            $users[] = $this->upsertUser($company, $definition);
        }

        return $users;
    }

    private function syncOperationalUsers(User $company, array $roles, array $users): array
    {
        $assignments = [
            'hr.manager@noblearchitecture.net' => ['hr', 'hr-manager'],
            'finance.manager@noblearchitecture.net' => ['finance-manager'],
            'project.manager@noblearchitecture.net' => ['project-manager'],
            'sales.manager@noblearchitecture.net' => ['sales-manager'],
            'support.manager@noblearchitecture.net' => ['support-manager'],
            'recruitment.manager@noblearchitecture.net' => ['hr', 'recruitment-manager'],
            'operations.lead@noblearchitecture.net' => ['operations-lead'],
            'payroll.specialist@noblearchitecture.net' => ['payroll-specialist'],
            'senior.accountant@noblearchitecture.net' => ['accountant'],
            'backend.developer@noblearchitecture.net' => ['engineer'],
            'frontend.developer@noblearchitecture.net' => ['engineer'],
            'qa.engineer@noblearchitecture.net' => ['engineer'],
            'marketing.specialist@noblearchitecture.net' => ['marketing-specialist'],
            'business.analyst@noblearchitecture.net' => ['business-analyst'],
            'office.coordinator@noblearchitecture.net' => ['office-coordinator'],
            'client.alpha@noblearchitecture.net' => ['client'],
            'client.beta@noblearchitecture.net' => ['client'],
            'vendor.prime@noblearchitecture.net' => ['vendor'],
            'vendor.nexus@noblearchitecture.net' => ['vendor'],
        ];

        foreach ($users as $user) {
            $roleNames = $assignments[$user->email] ?? [];
            $roleModels = collect($roleNames)
                ->map(fn ($roleName) => $roles[$roleName] ?? $this->findTenantRole($company->id, $roleName))
                ->filter()
                ->values()
                ->all();

            if (!empty($roleModels)) {
                $user->syncRoles($roleModels);
            }
        }

        return $users;
    }

    private function syncRoleLabelsAndPermissions(User $company): array
    {
        $superadminRole = Role::where('name', 'superadmin')->first();
        if ($superadminRole) {
            $superadminRole->label = 'Platform Owner';
            $superadminRole->save();
        }

        $companyRole = Role::where('name', 'company')->first();
        if ($companyRole) {
            $companyRole->label = 'Company Buyer';
            $companyRole->save();
        }

        $labelMap = [
            'staff' => 'Staff Member',
            'client' => 'Client Portal User',
            'vendor' => 'Vendor Portal User',
            'hr' => 'HR Manager',
        ];

        foreach ($labelMap as $name => $label) {
            $role = $this->findTenantRole($company->id, $name);
            if ($role) {
                $role->label = $label;
                $role->save();
            }
        }

        $basePermissions = [
            'manage-dashboard',
            'manage-profile',
            'edit-profile',
            'change-password-profile',
            'manage-messenger',
            'send-messages',
            'view-messages',
            'toggle-favorite-messages',
            'toggle-pinned-messages',
            'manage-media',
            'manage-own-media',
            'create-media',
            'download-media',
            'manage-media-directories',
            'manage-own-media-directories',
            'create-media-directories',
            'edit-media-directories',
        ];

        $blueprints = [
            'hr-manager' => [
                'label' => 'HR Manager',
                'addons' => ['Hrm', 'Performance', 'Recruitment', 'Training', 'Calendar', 'ZoomMeeting'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'finance-manager' => [
                'label' => 'Finance Manager',
                'addons' => ['Account', 'DoubleEntry', 'Goal', 'BudgetPlanner', 'ProductService'],
                'modules' => ['sales-invoices', 'sales-return-invoices', 'purchase-invoices', 'purchase-return-invoices', 'sales-proposals', 'warehouses', 'transfers'],
                'permissions' => $basePermissions,
            ],
            'project-manager' => [
                'label' => 'Project Manager',
                'addons' => ['Taskly', 'Timesheet', 'Calendar', 'ZoomMeeting', 'Contract'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'sales-manager' => [
                'label' => 'Sales Manager',
                'addons' => ['Lead', 'Quotation', 'Contract', 'Pos', 'ProductService'],
                'modules' => ['sales-invoices', 'sales-return-invoices', 'sales-proposals'],
                'permissions' => $basePermissions,
            ],
            'support-manager' => [
                'label' => 'Support Manager',
                'addons' => ['SupportTicket', 'FormBuilder', 'Calendar', 'Slack', 'Telegram', 'Twilio', 'Webhook'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'recruitment-manager' => [
                'label' => 'Recruitment Manager',
                'addons' => ['Recruitment', 'Hrm', 'Performance', 'Calendar', 'ZoomMeeting'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'operations-lead' => [
                'label' => 'Operations Lead',
                'addons' => ['Taskly', 'Timesheet', 'Calendar', 'Contract', 'ZoomMeeting'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'payroll-specialist' => [
                'label' => 'Payroll Specialist',
                'addons' => ['Hrm', 'Account', 'Performance', 'Calendar'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'accountant' => [
                'label' => 'Senior Accountant',
                'addons' => ['Account', 'DoubleEntry', 'Goal', 'BudgetPlanner', 'ProductService'],
                'modules' => ['sales-invoices', 'sales-return-invoices', 'purchase-invoices', 'purchase-return-invoices', 'warehouses'],
                'permissions' => $basePermissions,
            ],
            'engineer' => [
                'label' => 'Engineer',
                'addons' => ['Taskly', 'Timesheet', 'Calendar', 'Contract'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'marketing-specialist' => [
                'label' => 'Marketing Specialist',
                'addons' => ['Lead', 'Quotation', 'FormBuilder', 'Calendar'],
                'modules' => ['sales-proposals'],
                'permissions' => $basePermissions,
            ],
            'business-analyst' => [
                'label' => 'Business Analyst',
                'addons' => ['Taskly', 'Lead', 'Timesheet', 'Calendar', 'Contract'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
            'office-coordinator' => [
                'label' => 'Office Coordinator',
                'addons' => ['SupportTicket', 'Calendar', 'ZoomMeeting', 'FormBuilder'],
                'modules' => [],
                'permissions' => $basePermissions,
            ],
        ];

        $roles = [
            'company' => $companyRole,
            'staff' => $this->findTenantRole($company->id, 'staff'),
            'client' => $this->findTenantRole($company->id, 'client'),
            'vendor' => $this->findTenantRole($company->id, 'vendor'),
            'hr' => $this->findTenantRole($company->id, 'hr'),
        ];

        foreach ($blueprints as $name => $blueprint) {
            $role = $this->findTenantRole($company->id, $name);
            if (!$role) {
                $role = new Role();
                $role->name = $name;
                $role->guard_name = 'web';
                $role->created_by = $company->id;
                $role->editable = false;
            }

            $role->label = $blueprint['label'];
            $role->save();

            $permissions = Permission::query()
                ->when(!empty($blueprint['addons']) || !empty($blueprint['modules']) || !empty($blueprint['permissions']), function ($query) use ($blueprint) {
                    $query->where(function ($permissionQuery) use ($blueprint) {
                        if (!empty($blueprint['addons'])) {
                            $permissionQuery->orWhereIn('add_on', $blueprint['addons']);
                        }

                        if (!empty($blueprint['modules'])) {
                            $permissionQuery->orWhereIn('module', $blueprint['modules']);
                        }

                        if (!empty($blueprint['permissions'])) {
                            $permissionQuery->orWhereIn('name', $blueprint['permissions']);
                        }
                    });
                })
                ->get();

            $role->syncPermissions($permissions);
            $roles[$name] = $role;
        }

        return $roles;
    }

    private function backfillEmployees(User $company): void
    {
        if (!class_exists(Employee::class)) {
            return;
        }

        $branchIds = Branch::where('created_by', $company->id)->pluck('id');
        $shiftIds = Shift::where('created_by', $company->id)->pluck('id');

        if ($branchIds->isEmpty() || $shiftIds->isEmpty()) {
            return;
        }

        Employee::where('created_by', $company->id)
            ->whereNull('shift_id')
            ->get()
            ->each(function (Employee $employee) use ($shiftIds) {
                $employee->shift_id = $shiftIds->random();
                if ($employee->user && empty($employee->mobile_no)) {
                    $employee->mobile_no = $employee->user->mobile_no;
                }
                if ($employee->user && empty($employee->email_address)) {
                    $employee->email_address = $employee->user->email;
                }
                $employee->save();
            });

        $staffUsers = User::where('created_by', $company->id)
            ->where('type', 'staff')
            ->whereNotIn('id', Employee::where('created_by', $company->id)->pluck('user_id'))
            ->get();

        foreach ($staffUsers as $user) {
            $branchId = $branchIds->random();
            $department = Department::where('created_by', $company->id)
                ->where('branch_id', $branchId)
                ->inRandomOrder()
                ->first();

            if (!$department) {
                continue;
            }

            $designation = Designation::where('created_by', $company->id)
                ->where('branch_id', $branchId)
                ->where('department_id', $department->id)
                ->inRandomOrder()
                ->first();

            if (!$designation) {
                continue;
            }

            Employee::create([
                'user_id' => $user->id,
                'employee_id' => Employee::generateEmployeeId($company->id),
                'date_of_birth' => now()->subYears(rand(24, 45))->format('Y-m-d'),
                'gender' => ['Male', 'Female'][array_rand(['Male', 'Female'])],
                'shift_id' => $shiftIds->random(),
                'date_of_joining' => now()->subDays(rand(30, 540))->format('Y-m-d'),
                'employment_type' => ['Full Time', 'Contract', 'Part Time'][array_rand(['Full Time', 'Contract', 'Part Time'])],
                'city' => 'Damascus',
                'country' => 'Syria',
                'basic_salary' => rand(700, 2200),
                'hours_per_day' => 8,
                'days_per_week' => 5,
                'rate_per_hour' => rand(6, 18),
                'branch_id' => $branchId,
                'department_id' => $department->id,
                'designation_id' => $designation->id,
                'mobile_no' => $user->mobile_no,
                'email_address' => $user->email,
                'employee_status' => 'Active',
                'creator_id' => $company->id,
                'created_by' => $company->id,
            ]);
        }
    }

    private function normalizeEmployeeIds(User $company): void
    {
        $employees = Employee::where('created_by', $company->id)
            ->orderBy('id')
            ->get();

        foreach ($employees as $index => $employee) {
            $employee->employee_id = 'EMP' . date('Y') . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT);
            $employee->save();
        }
    }

    private function ensureWarehouseInventory(User $company): void
    {
        $warehouses = \App\Models\Warehouse::where('created_by', $company->id)->get();
        if ($warehouses->isEmpty()) {
            $warehouses = collect([
                \App\Models\Warehouse::create([
                    'name' => 'Main Warehouse',
                    'address' => 'Mazzeh Highway',
                    'city' => 'Damascus',
                    'zip_code' => '10001',
                    'phone' => '+96311000001',
                    'email' => 'warehouse.main@noblearchitecture.net',
                    'is_active' => true,
                    'creator_id' => $company->id,
                    'created_by' => $company->id,
                ]),
                \App\Models\Warehouse::create([
                    'name' => 'Operations Warehouse',
                    'address' => 'Kafar Sousa',
                    'city' => 'Damascus',
                    'zip_code' => '10002',
                    'phone' => '+96311000002',
                    'email' => 'warehouse.ops@noblearchitecture.net',
                    'is_active' => true,
                    'creator_id' => $company->id,
                    'created_by' => $company->id,
                ]),
            ]);
        }

        $categories = \Noble\ProductService\Models\ProductServiceCategory::where('created_by', $company->id)->get();
        $tax = \Noble\ProductService\Models\ProductServiceTax::where('created_by', $company->id)->first();
        $unit = \Noble\ProductService\Models\ProductServiceUnit::where('created_by', $company->id)->first();

        if ($categories->isEmpty() || !$unit) {
            return;
        }

        if (\Noble\ProductService\Models\ProductServiceItem::where('created_by', $company->id)->count() >= 8) {
            return;
        }

        $catalog = [
            ['name' => 'NOBLE ERP License', 'sku' => 'NOBLE-ERP-001', 'type' => 'service', 'sale_price' => 4500, 'purchase_price' => 0],
            ['name' => 'NOBLE HR Suite', 'sku' => 'NOBLE-HR-002', 'type' => 'service', 'sale_price' => 3200, 'purchase_price' => 0],
            ['name' => 'NOBLE Accounting Package', 'sku' => 'NOBLE-ACC-003', 'type' => 'service', 'sale_price' => 3800, 'purchase_price' => 0],
            ['name' => 'Barcode Scanner', 'sku' => 'NOBLE-HW-004', 'type' => 'product', 'sale_price' => 180, 'purchase_price' => 95],
            ['name' => 'Thermal Receipt Printer', 'sku' => 'NOBLE-HW-005', 'type' => 'product', 'sale_price' => 240, 'purchase_price' => 130],
            ['name' => 'Laptop Docking Station', 'sku' => 'NOBLE-HW-006', 'type' => 'product', 'sale_price' => 160, 'purchase_price' => 90],
            ['name' => 'Network Switch 24-Port', 'sku' => 'NOBLE-HW-007', 'type' => 'product', 'sale_price' => 220, 'purchase_price' => 140],
            ['name' => 'Access Card Pack', 'sku' => 'NOBLE-PART-008', 'type' => 'part', 'sale_price' => 35, 'purchase_price' => 12],
        ];

        foreach ($catalog as $index => $itemData) {
            $category = $categories[$index % $categories->count()];
            $item = \Noble\ProductService\Models\ProductServiceItem::updateOrCreate(
                ['sku' => $itemData['sku'], 'created_by' => $company->id],
                [
                    'name' => $itemData['name'],
                    'tax_ids' => $tax ? [$tax->id] : null,
                    'category_id' => $category->id,
                    'description' => $itemData['name'] . ' generated for company demo validation.',
                    'sale_price' => $itemData['sale_price'],
                    'purchase_price' => $itemData['purchase_price'],
                    'unit' => $unit->id,
                    'type' => $itemData['type'],
                    'is_active' => true,
                    'creator_id' => $company->id,
                    'created_by' => $company->id,
                ]
            );

            if ($itemData['type'] !== 'service') {
                foreach ($warehouses as $warehouse) {
                    \Noble\ProductService\Models\WarehouseStock::updateOrCreate(
                        ['product_id' => $item->id, 'warehouse_id' => $warehouse->id],
                        ['quantity' => 40 + ($index * 5)]
                    );
                }
            }
        }
    }

    private function ensureTasklyBackfill(User $company): void
    {
        $projects = \Noble\Taskly\Models\Project::where('created_by', $company->id)->get();
        $staffIds = User::where('created_by', $company->id)->where('type', 'staff')->pluck('id');
        $clientIds = User::where('created_by', $company->id)->where('type', 'client')->pluck('id');

        if ($projects->count() < 3) {
            $seedProjects = [
                ['name' => 'Operations Revamp', 'description' => 'Internal operations improvement project.', 'budget' => 18000, 'status' => 'Ongoing'],
                ['name' => 'Customer Portal Rollout', 'description' => 'Rollout of the customer self-service portal.', 'budget' => 24000, 'status' => 'Ongoing'],
                ['name' => 'Retail POS Expansion', 'description' => 'POS rollout across newly onboarded branches.', 'budget' => 16000, 'status' => 'Onhold'],
            ];

            foreach ($seedProjects as $seedProject) {
                $project = \Noble\Taskly\Models\Project::create([
                    'name' => $seedProject['name'],
                    'description' => $seedProject['description'],
                    'budget' => $seedProject['budget'],
                    'start_date' => now()->subDays(rand(20, 60))->format('Y-m-d'),
                    'end_date' => now()->addDays(rand(30, 90))->format('Y-m-d'),
                    'status' => $seedProject['status'],
                    'creator_id' => $company->id,
                    'created_by' => $company->id,
                ]);

                if ($staffIds->isNotEmpty()) {
                    $project->teamMembers()->sync($staffIds->take(min(4, $staffIds->count()))->all());
                }
                if ($clientIds->isNotEmpty()) {
                    $project->clients()->sync($clientIds->take(1)->all());
                }
            }
        }

        $projects = \Noble\Taskly\Models\Project::where('created_by', $company->id)->get();
        foreach ($projects as $project) {
            if ($staffIds->isNotEmpty() && $project->teamMembers()->count() === 0) {
                $project->teamMembers()->sync($staffIds->take(min(3, $staffIds->count()))->all());
            }
            if ($clientIds->isNotEmpty() && $project->clients()->count() === 0) {
                $project->clients()->sync($clientIds->take(1)->all());
            }
        }

        \Noble\Taskly\Models\TaskStage::defaultdata($company->id);
        \Noble\Taskly\Models\BugStage::defaultdata($company->id);

        if (\Noble\Taskly\Models\ProjectMilestone::whereIn('project_id', $projects->pluck('id'))->count() === 0) {
            (new \Noble\Taskly\Database\Seeders\DemoProjectMilestoneSeeder())->run($company->id);
        }
        if (\Noble\Taskly\Models\ProjectTask::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Taskly\Database\Seeders\DemoProjectTaskSeeder())->run($company->id);
        }
        if (\Noble\Taskly\Models\ProjectBug::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Taskly\Database\Seeders\DemoProjectBugSeeder())->run($company->id);
        }
        if (\Noble\Taskly\Models\ActivityLog::whereIn('project_id', $projects->pluck('id')->all())->count() === 0) {
            (new \Noble\Taskly\Database\Seeders\DemoActivityLogSeeder())->run($company->id);
        }
    }

    private function ensureLeadBackfill(User $company): void
    {
        $this->ensureLeadScaffolding($company);

        if (\Noble\Lead\Models\Lead::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoLeadSeeder())->run($company->id);
        }

        if (\Noble\Lead\Models\Lead::where('created_by', $company->id)->count() === 0) {
            $this->createLeadFallback($company);
        }

        if (\Noble\Lead\Models\Deal::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoDealSeeder())->run($company->id);
        }

        if (\Noble\Lead\Models\Deal::where('created_by', $company->id)->count() === 0) {
            $this->createDealFallback($company);
        }

        if (\Noble\Lead\Models\LeadTask::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoLeadTaskSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\UserLead::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoUserLeadSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\LeadCall::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoLeadCallSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\LeadEmail::count() === 0 && \Noble\Lead\Models\LeadDiscussion::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoLeadEmailDiscussionSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\DealTask::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoDealTaskSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\UserDeal::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoUserDealSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\ClientDeal::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoClientDealSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\DealCall::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoDealCallSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\DealEmail::count() === 0 && \Noble\Lead\Models\DealDiscussion::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoDealEmailDiscussionSeeder())->run($company->id);
        }
        if (\Noble\Lead\Models\LeadActivityLog::count() === 0 && \Noble\Lead\Models\DealActivityLog::count() === 0) {
            (new \Noble\Lead\Database\Seeders\DemoCallActivitySeeder())->run($company->id);
        }
    }

    private function ensureSalesBackfill(User $company): void
    {
        if (\Noble\Quotation\Models\SalesQuotation::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Quotation\Database\Seeders\DemoQuotationSeeder())->run($company->id);
        }

        if (\Noble\Pos\Models\Pos::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Pos\Database\Seeders\DemoPosSeeder())->run($company->id);
        }
    }

    private function ensureAttendanceBackfill(User $company): void
    {
        if (\Noble\Hrm\Models\Attendance::where('created_by', $company->id)->count() === 0) {
            (new \Noble\Hrm\Database\Seeders\DemoAttendanceSeeder())->run($company->id);
        }
    }

    private function collectAudit(User $company): array
    {
        return [
            'users' => [
                'company_owner' => User::where('id', $company->id)->count(),
                'staff' => User::where('created_by', $company->id)->where('type', 'staff')->count(),
                'clients' => User::where('created_by', $company->id)->where('type', 'client')->count(),
                'vendors' => User::where('created_by', $company->id)->where('type', 'vendor')->count(),
            ],
            'hrm' => [
                'branches' => Branch::where('created_by', $company->id)->count(),
                'departments' => Department::where('created_by', $company->id)->count(),
                'designations' => Designation::where('created_by', $company->id)->count(),
                'employees' => Employee::where('created_by', $company->id)->count(),
            ],
            'modules' => [
                'active' => \App\Models\UserActiveModule::where('user_id', $company->id)->count(),
            ],
        ];
    }

    private function upsertUser(User $company, array $definition): User
    {
        $user = User::updateOrCreate(
            ['email' => $definition['email']],
            [
                'name' => $definition['name'],
                'password' => Hash::make('Nn@!23456'),
                'type' => $definition['type'],
                'lang' => 'en',
                'mobile_no' => $definition['mobile_no'] ?? '9639' . rand(10000000, 99999999),
                'created_by' => $company->id,
                'creator_id' => $company->id,
                'email_verified_at' => now(),
                'is_disable' => 0,
                'is_enable_login' => 1,
            ]
        );

        $roleModels = collect($definition['roles'] ?? [])->filter()->values()->all();
        if (!empty($roleModels)) {
            $user->syncRoles($roleModels);
        }

        return $user;
    }

    private function findTenantRole(int $companyId, string $name): ?Role
    {
        if (in_array($name, ['company', 'superadmin'], true)) {
            return Role::where('name', $name)->first();
        }

        return Role::where('name', $name)
            ->where('created_by', $companyId)
            ->where('guard_name', 'web')
            ->first();
    }

    private function ensureLeadScaffolding(User $company): void
    {
        $sourcesCount = \Noble\Lead\Models\Source::where('created_by', $company->id)->count();
        if ($sourcesCount === 0) {
            (new \Noble\Lead\Database\Seeders\DemoSourceSeeder())->run($company->id);
        }

        $pipelineDefinitions = [
            'Marketing' => [
                'lead_stages' => ['Prospect', 'Contacted', 'Engaged', 'Qualified', 'Converted'],
                'deal_stages' => ['Campaign Launch', 'Lead Generation', 'Nurturing', 'Qualification', 'Handoff'],
                'labels' => [
                    ['name' => 'First Visit', 'color' => '#EF4444'],
                    ['name' => 'Return Visitor', 'color' => '#F97316'],
                    ['name' => 'Content Downloaded', 'color' => '#3B82F6'],
                    ['name' => 'Form Submitted', 'color' => '#10b77f'],
                    ['name' => 'MQL Ready', 'color' => '#8B5CF6'],
                ],
            ],
            'Lead Qualification' => [
                'lead_stages' => ['Unqualified', 'In Review', 'Qualified', 'Approved', 'Rejected'],
                'deal_stages' => ['Initial Contact', 'Needs Assessment', 'Solution Fit', 'Proposal Sent', 'Decision'],
                'labels' => [
                    ['name' => 'High Priority', 'color' => '#EF4444'],
                    ['name' => 'Medium Priority', 'color' => '#F97316'],
                    ['name' => 'Low Priority', 'color' => '#3B82F6'],
                    ['name' => 'Follow Up', 'color' => '#10b77f'],
                    ['name' => 'Not Interested', 'color' => '#6B7280'],
                ],
            ],
        ];

        foreach ($pipelineDefinitions as $pipelineName => $definition) {
            $pipeline = \Noble\Lead\Models\Pipeline::updateOrCreate(
                ['name' => $pipelineName, 'created_by' => $company->id],
                ['creator_id' => $company->id]
            );

            foreach ($definition['lead_stages'] as $index => $stageName) {
                \Noble\Lead\Models\LeadStage::updateOrCreate(
                    ['pipeline_id' => $pipeline->id, 'name' => $stageName],
                    ['order' => $index + 1, 'creator_id' => $company->id, 'created_by' => $company->id]
                );
            }

            foreach ($definition['deal_stages'] as $index => $stageName) {
                \Noble\Lead\Models\DealStage::updateOrCreate(
                    ['pipeline_id' => $pipeline->id, 'name' => $stageName],
                    ['order' => $index + 1, 'creator_id' => $company->id, 'created_by' => $company->id]
                );
            }

            foreach ($definition['labels'] as $label) {
                \Noble\Lead\Models\Label::updateOrCreate(
                    ['pipeline_id' => $pipeline->id, 'name' => $label['name']],
                    ['color' => $label['color'], 'creator_id' => $company->id, 'created_by' => $company->id]
                );
            }
        }
    }

    private function createLeadFallback(User $company): void
    {
        $pipelines = \Noble\Lead\Models\Pipeline::where('created_by', $company->id)
            ->whereIn('name', ['Marketing', 'Lead Qualification'])
            ->get()
            ->keyBy('name');
        $userIds = User::where('created_by', $company->id)
            ->whereIn('type', ['staff', 'company'])
            ->pluck('id');
        $sourceIds = \Noble\Lead\Models\Source::where('created_by', $company->id)->pluck('id');
        $productIds = class_exists(\Noble\ProductService\Models\ProductServiceItem::class)
            ? \Noble\ProductService\Models\ProductServiceItem::where('created_by', $company->id)->pluck('id')
            : collect();

        if ($pipelines->isEmpty() || $userIds->isEmpty()) {
            return;
        }

        $leadDefinitions = [
            ['pipeline' => 'Marketing', 'name' => 'Al Noor Trading', 'email' => 'contact@alnoortrading.example', 'subject' => 'ERP discovery session', 'date' => now()->subDays(12)],
            ['pipeline' => 'Marketing', 'name' => 'Damascus Health Group', 'email' => 'ops@damascushealth.example', 'subject' => 'Clinic workflow automation', 'date' => now()->subDays(9)],
            ['pipeline' => 'Marketing', 'name' => 'Syrian Retail Hub', 'email' => 'hello@syrianretail.example', 'subject' => 'POS rollout consultation', 'date' => now()->subDays(6)],
            ['pipeline' => 'Lead Qualification', 'name' => 'Levant Logistics', 'email' => 'procurement@levantlogistics.example', 'subject' => 'Warehouse digitization review', 'date' => now()->subDays(5)],
            ['pipeline' => 'Lead Qualification', 'name' => 'Nour Schools Network', 'email' => 'it@nourschools.example', 'subject' => 'Campus management assessment', 'date' => now()->subDays(3)],
            ['pipeline' => 'Lead Qualification', 'name' => 'Aleppo Foods Co', 'email' => 'projects@aleppofoods.example', 'subject' => 'Manufacturing operations audit', 'date' => now()->subDay()],
        ];

        foreach ($leadDefinitions as $index => $definition) {
            $pipeline = $pipelines->get($definition['pipeline']);
            $stage = $pipeline
                ? \Noble\Lead\Models\LeadStage::where('pipeline_id', $pipeline->id)->orderBy('order')->first()
                : null;

            if (!$pipeline || !$stage) {
                continue;
            }

            \Noble\Lead\Models\Lead::updateOrCreate(
                ['email' => $definition['email'], 'created_by' => $company->id],
                [
                    'name' => $definition['name'],
                    'subject' => $definition['subject'],
                    'user_id' => $userIds[$index % $userIds->count()],
                    'pipeline_id' => $pipeline->id,
                    'stage_id' => $stage->id,
                    'sources' => $sourceIds->isNotEmpty() ? $sourceIds[$index % $sourceIds->count()] : null,
                    'products' => $productIds->isNotEmpty() ? $productIds[$index % $productIds->count()] : null,
                    'notes' => 'Fallback CRM lead generated during company provisioning validation.',
                    'labels' => null,
                    'order' => $index,
                    'phone' => '+963944000' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                    'is_active' => true,
                    'date' => $definition['date']->format('Y-m-d'),
                    'creator_id' => $company->id,
                    'created_by' => $company->id,
                    'created_at' => $definition['date']->copy()->setTime(10 + $index, 15, 0),
                ]
            );
        }
    }

    private function createDealFallback(User $company): void
    {
        $pipelines = \Noble\Lead\Models\Pipeline::where('created_by', $company->id)
            ->whereIn('name', ['Marketing', 'Lead Qualification'])
            ->get()
            ->keyBy('name');
        $leads = \Noble\Lead\Models\Lead::where('created_by', $company->id)
            ->whereIn('pipeline_id', $pipelines->pluck('id'))
            ->orderBy('id')
            ->get();
        $clientIds = User::where('created_by', $company->id)->where('type', 'client')->pluck('id');

        if ($pipelines->isEmpty() || $leads->isEmpty()) {
            return;
        }

        foreach ($leads->take(6) as $index => $lead) {
            $stage = \Noble\Lead\Models\DealStage::where('pipeline_id', $lead->pipeline_id)->orderBy('order')->first();

            if (!$stage) {
                continue;
            }

            $deal = \Noble\Lead\Models\Deal::create([
                'name' => $lead->subject . ' Opportunity',
                'price' => 25000 + ($index * 4500),
                'pipeline_id' => $lead->pipeline_id,
                'stage_id' => $stage->id,
                'sources' => $lead->sources ? [$lead->sources] : null,
                'products' => $lead->products ? [$lead->products] : null,
                'notes' => 'Fallback CRM deal generated from live lead provisioning.',
                'labels' => [],
                'phone' => $lead->phone,
                'status' => $index < 4 ? 'Active' : 'Won',
                'is_active' => $index < 4,
                'order' => $index,
                'creator_id' => $company->id,
                'created_by' => $company->id,
                'created_at' => now()->subDays(max(1, 6 - $index))->setTime(12, 0, 0),
            ]);

            if ($clientIds->isNotEmpty()) {
                \Noble\Lead\Models\ClientDeal::firstOrCreate([
                    'deal_id' => $deal->id,
                    'client_id' => $clientIds[$index % $clientIds->count()],
                ]);
            }

            $lead->is_converted = $deal->id;
            $lead->save();
        }
    }
}
