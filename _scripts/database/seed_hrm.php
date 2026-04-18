<?php
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$companyUser = App\Models\User::where('type', 'company')->where('email', 'admin@noble.dion.sy')->first();
echo "Company User: {$companyUser->id} - {$companyUser->name}" . PHP_EOL;

// 1. Branch (branch_name)
$branch = Noble\Hrm\Models\Branch::updateOrCreate(
    ['created_by' => $companyUser->id, 'branch_name' => 'الفرع الرئيسي'],
    ['created_by' => $companyUser->id, 'branch_name' => 'الفرع الرئيسي']
);
echo "✅ Branch: {$branch->id}" . PHP_EOL;

// 2. Shift (shift_name)
$shift = Noble\Hrm\Models\Shift::updateOrCreate(
    ['created_by' => $companyUser->id, 'shift_name' => 'دوام صباحي'],
    ['created_by' => $companyUser->id, 'shift_name' => 'دوام صباحي', 'start_time' => '08:00', 'end_time' => '17:00']
);
echo "✅ Shift: {$shift->id}" . PHP_EOL;

// 3. Departments (department_name)
$deps = [];
foreach (['تقنية المعلومات', 'الموارد البشرية', 'المحاسبة والمالية'] as $dn) {
    $d = Noble\Hrm\Models\Department::updateOrCreate(
        ['created_by' => $companyUser->id, 'department_name' => $dn],
        ['created_by' => $companyUser->id, 'department_name' => $dn, 'branch_id' => $branch->id]
    );
    $deps[$dn] = $d->id;
    echo "✅ Department: {$d->id} - {$dn}" . PHP_EOL;
}

// 4. Designations (designation_name)
$desNames = ['مدير تقنية المعلومات', 'مطور برمجيات أول', 'مطور برمجيات', 'محلل أنظمة', 'مدير الموارد البشرية', 'محاسب أول'];
$desIds = [];
foreach ($desNames as $dn) {
    $d = Noble\Hrm\Models\Designation::updateOrCreate(
        ['created_by' => $companyUser->id, 'designation_name' => $dn],
        ['created_by' => $companyUser->id, 'designation_name' => $dn, 'department_id' => $deps['تقنية المعلومات'], 'branch_id' => $branch->id]
    );
    $desIds[$dn] = $d->id;
    echo "✅ Designation: {$d->id} - {$dn}" . PHP_EOL;
}

// 5. Leave Types (max_days_per_year)
foreach ([['name'=>'إجازة سنوية','d'=>30], ['name'=>'إجازة مرضية','d'=>15], ['name'=>'إجازة طارئة','d'=>5]] as $lt) {
    $l = Noble\Hrm\Models\LeaveType::updateOrCreate(
        ['created_by' => $companyUser->id, 'name' => $lt['name']],
        ['created_by' => $companyUser->id, 'name' => $lt['name'], 'max_days_per_year' => $lt['d'], 'is_paid' => true]
    );
    echo "✅ Leave Type: {$l->id} - {$lt['name']}" . PHP_EOL;
}

// 6. Staff + Employees
$staff = [
    ['n'=>'أحمد العلي','e'=>'ahmed@noble.test','dep'=>'تقنية المعلومات','des'=>'مطور برمجيات أول','s'=>12000],
    ['n'=>'فاطمة الحسن','e'=>'fatima@noble.test','dep'=>'الموارد البشرية','des'=>'مدير الموارد البشرية','s'=>15000],
    ['n'=>'محمد السالم','e'=>'mohammed@noble.test','dep'=>'المحاسبة والمالية','des'=>'محاسب أول','s'=>10000],
    ['n'=>'سارة الخالد','e'=>'sara@noble.test','dep'=>'تقنية المعلومات','des'=>'محلل أنظمة','s'=>11000],
    ['n'=>'عمر البدر','e'=>'omar@noble.test','dep'=>'تقنية المعلومات','des'=>'مطور برمجيات','s'=>9000],
];

$empIds = [];
foreach ($staff as $s) {
    $u = App\Models\User::updateOrCreate(
        ['email' => $s['e']],
        ['name'=>$s['n'],'email'=>$s['e'],'password'=>bcrypt('123456'),'type'=>'staff','lang'=>'ar','created_by'=>$companyUser->id,'is_enable_login'=>1]
    );
    $emp = Noble\Hrm\Models\Employee::updateOrCreate(
        ['user_id' => $u->id],
        [
            'user_id'=>$u->id, 'employee_id'=>Noble\Hrm\Models\Employee::generateEmployeeId(),
            'name_ar'=>$s['n'], 'gender'=>'Male', 'date_of_birth'=>'1995-01-15',
            'branch_id'=>$branch->id, 'department_id'=>$deps[$s['dep']], 'designation_id'=>$desIds[$s['des']],
            'shift_id'=>$shift->id, 'date_of_joining'=>'2025-01-01', 'created_by'=>$companyUser->id,
            'basic_salary'=>$s['s'], 'nationality'=>'سعودي', 'marital_status'=>'Single',
            'employee_status'=>'Active', 'employment_type'=>'Full-Time',
        ]
    );
    $empIds[] = $emp->id;
    echo "✅ Employee: {$emp->id} - {$s['n']}" . PHP_EOL;
}

// 7. Attendance
echo PHP_EOL . "=== Attendance ===" . PHP_EOL;
foreach ([date('Y-m-d'), date('Y-m-d', strtotime('-1 day')), date('Y-m-d', strtotime('-2 days'))] as $dt) {
    foreach ($empIds as $eid) {
        Noble\Hrm\Models\Attendance::updateOrCreate(
            ['employee_id'=>$eid,'date'=>$dt,'created_by'=>$companyUser->id],
            ['employee_id'=>$eid,'shift_id'=>$shift->id,'date'=>$dt,
             'clock_in'=>'08:'.str_pad(rand(0,15),2,'0',STR_PAD_LEFT),
             'clock_out'=>'17:'.str_pad(rand(0,30),2,'0',STR_PAD_LEFT),
             'status'=>'Present','total_hour'=>rand(8,9),'created_by'=>$companyUser->id]
        );
    }
    echo "✅ Attendance {$dt}: " . count($empIds) . " records" . PHP_EOL;
}

// 8. Holiday (start_date, not date)
Noble\Hrm\Models\Holiday::updateOrCreate(
    ['created_by'=>$companyUser->id, 'name'=>'عيد الفطر'],
    ['created_by'=>$companyUser->id, 'name'=>'عيد الفطر','start_date'=>'2026-04-23','end_date'=>'2026-04-25','is_paid'=>true]
);
echo "✅ Holiday: عيد الفطر" . PHP_EOL;

echo PHP_EOL . "=== ✅ All HRM data created successfully! ===" . PHP_EOL;
