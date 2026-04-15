<?php
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$companyUser = App\Models\User::where('type', 'company')->where('email', 'admin@example.com')->first();
$employees = Noble\Hrm\Models\Employee::where('created_by', $companyUser->id)->get();
$shift = Noble\Hrm\Models\Shift::where('created_by', $companyUser->id)->first();

echo "Found " . $employees->count() . " employees" . PHP_EOL;

// attendance.employee_id references users.id, so use user_id from employee model
foreach ([date('Y-m-d'), date('Y-m-d', strtotime('-1 day')), date('Y-m-d', strtotime('-2 days'))] as $dt) {
    foreach ($employees as $emp) {
        $cin = $dt . ' 08:' . str_pad(rand(0,15),2,'0',STR_PAD_LEFT) . ':00';
        $cout = $dt . ' 17:' . str_pad(rand(0,30),2,'0',STR_PAD_LEFT) . ':00';
        Noble\Hrm\Models\Attendance::updateOrCreate(
            ['employee_id' => $emp->user_id, 'date' => $dt, 'created_by' => $companyUser->id],
            [
                'employee_id' => $emp->user_id,  // user_id not employee.id
                'shift_id' => $shift ? $shift->id : null,
                'date' => $dt,
                'clock_in' => $cin,
                'clock_out' => $cout,
                'status' => 'Present',
                'total_hour' => rand(8, 9),
                'created_by' => $companyUser->id,
            ]
        );
    }
    echo "✅ Attendance {$dt}: " . $employees->count() . " records" . PHP_EOL;
}

echo PHP_EOL . "=== ✅ Done! Refresh browser ===" . PHP_EOL;
