const { Client } = require('ssh2');
const CONFIG = require('../deployment/secureConfig.cjs');

const phpPayload = `<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();

use Noble\\Hrm\\Models\\Employee;
use Noble\\Hrm\\Models\\Attendance;
use Noble\\Hrm\\Models\\LeaveApplication;
use Noble\\Hrm\\Models\\Award;
use Noble\\Hrm\\Models\\Event;
use Noble\\Hrm\\Models\\Warning;
use Noble\\Hrm\\Models\\Payroll;
use Noble\\Hrm\\Models\\PayrollEntry;
use Noble\\Hrm\\Models\\Department;
use Noble\\Hrm\\Models\\Branch;
use Noble\\Hrm\\Models\\Shift;
use Carbon\\Carbon;
use Illuminate\\Support\\Facades\\DB;

    try {
        $creatorId = Employee::first()?->created_by ?? 1;
    } catch (\\Exception $e) {
        $creatorId = 1;
    }

    $employees = Employee::get();
    echo "Targeting " . $employees->count() . " Platinum Corporate accounts.\\n";

    $currentTime = Carbon::now();
    $monthStart = $currentTime->copy()->subDays(30);

    echo "Clearing previous simulations...\\n";
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    Attendance::truncate();
    LeaveApplication::truncate();
    Award::truncate();
    Event::truncate();
    Warning::truncate();
    Payroll::truncate();
    PayrollEntry::truncate();
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');

    try {
        DB::beginTransaction();

    $branch = Branch::first() ?? Branch::create(['name' => 'Main Headquarter', 'created_by' => $creatorId]);
    $shift = Shift::first() ?? Shift::create([
        'shift_name' => 'Standard Morning',
        'start_time' => '08:00:00',
        'end_time' => '17:00:00',
        'created_by' => $creatorId
    ]);

    $leaveType = Noble\\Hrm\\Models\\LeaveType::first() ?? Noble\\Hrm\\Models\\LeaveType::create(['name' => 'Annual Leave', 'max_days_per_year' => 30, 'is_paid' => true, 'color' => '#10b77f', 'created_by' => $creatorId]);
    $awardType = Noble\\Hrm\\Models\\AwardType::first() ?? Noble\\Hrm\\Models\\AwardType::create(['name' => 'Performance Bonus', 'description' => 'Bonus for good performance', 'created_by' => $creatorId]);
    $warningType = Noble\\Hrm\\Models\\WarningType::first() ?? Noble\\Hrm\\Models\\WarningType::create(['warning_type_name' => 'Tardiness', 'created_by' => $creatorId]);

    Event::create([
        'title' => 'Monthly General Meeting',
        'start_date' => $currentTime->copy()->subDays(10)->format('Y-m-d'),
        'end_date' => $currentTime->copy()->subDays(10)->format('Y-m-d'),
        'color' => '#4D44B5',
        'description' => 'Mandatory meeting for all departments regarding quarterly goals.',
        'created_by' => $creatorId,
    ]);
    Event::create([
        'title' => 'Project Target Deadline',
        'start_date' => $currentTime->copy()->addDays(5)->format('Y-m-d'),
        'end_date' => $currentTime->copy()->addDays(5)->format('Y-m-d'),
        'color' => '#FF4560',
        'description' => 'Final submission for enterprise goals.',
        'created_by' => $creatorId,
    ]);

    $attendanceCreated = 0;
    $leavesCreated = 0;
    $awardsCreated = 0;
    $warningsCreated = 0;
    $payrollsCreated = 0;

    $lastMonth = $currentTime->copy()->subMonth();
    $payroll = Payroll::firstOrCreate(
        [
            'title' => $lastMonth->format('F Y') . ' Payroll',
            'created_by' => $creatorId
        ],
        [
            'payroll_frequency' => 'monthly',
            'pay_period_start' => $lastMonth->copy()->startOfMonth()->format('Y-m-d'),
            'pay_period_end' => $lastMonth->copy()->endOfMonth()->format('Y-m-d'),
            'pay_date' => $currentTime->copy()->format('Y-m-d'),
            'notes' => "Simulated payroll for " . $lastMonth->format('F Y'),
            'status' => 'completed',
            'is_payroll_paid' => 'paid',
            'creator_id' => $creatorId,
            'created_by' => $creatorId,
        ]
    );

    foreach ($employees as $employee) {
        if (!$employee->user_id) continue;

        $basicSalary = (float)($employee->salary ?? 4500);

        for ($i = 0; $i <= 30; $i++) {
            $date = $monthStart->copy()->addDays($i);

            if ($date->isFriday() || $date->isSaturday()) {
                continue;
            }

            $rand = rand(1, 100);
            $status = 'Present';
            $clockIn = $date->format('Y-m-d') . ' 08:00:00';
            $clockOut = $date->format('Y-m-d') . ' 17:00:00';
            $lateTime = '00:00:00';

            if ($rand <= 5) {
                $status = 'Absent';
                $clockIn = $date->format('Y-m-d') . ' 00:00:00';
                $clockOut = $date->format('Y-m-d') . ' 00:00:00';
            } elseif ($rand <= 15) {
                $lateMinutes = rand(15, 120);
                $clockIn = Carbon::parse($date->format('Y-m-d') . ' 08:00:00')->addMinutes($lateMinutes)->format('Y-m-d H:i:s');
                $lateTime = gmdate('H:i:s', $lateMinutes * 60);
            }

            Attendance::create([
                'employee_id' => $employee->user_id,
                'shift_id' => $shift->id,
                'date' => $date->format('Y-m-d'),
                'status' => $status,
                'clock_in' => $clockIn,
                'clock_out' => $clockOut,
                'late' => $lateTime,
                'early_leaving' => '00:00:00',
                'overtime' => '00:00:00',
                'total_rest' => '01:00:00',
                'created_by' => $creatorId,
            ]);
            $attendanceCreated++;
        }

        if (rand(1, 100) <= 10) {
            LeaveApplication::create([
                'employee_id' => $employee->user_id,
                'leave_type_id' => $leaveType->id,
                'applied_on' => $currentTime->copy()->subDays(rand(5, 15))->format('Y-m-d'),
                'start_date' => $currentTime->copy()->addDays(rand(1, 10))->format('Y-m-d'),
                'end_date' => $currentTime->copy()->addDays(rand(3, 12))->format('Y-m-d'),
                'total_days' => rand(2, 5),
                'reason' => 'Personal emergency / family matters.',
                'status' => 'Pending',
                'created_by' => $creatorId,
            ]);
            $leavesCreated++;
        }

        if (rand(1, 100) <= 5) {
            Award::create([
                'employee_id' => $employee->user_id,
                'award_type_id' => $awardType->id,
                'award_date' => $currentTime->copy()->subDays(rand(1, 20))->format('Y-m-d'),
                'gift' => 'Monthly recognition bonus',
                'description' => 'Exceptional performance.',
                'created_by' => $creatorId,
            ]);
            $awardsCreated++;
        }

        if (rand(1, 100) <= 3) {
            Warning::create([
                'employee_id' => $employee->user_id,
                'warning_type_id' => $warningType->id,
                'subject' => 'Repeated Tardiness',
                'warning_date' => $currentTime->copy()->subDays(rand(1, 20))->format('Y-m-d'),
                'description' => 'Official notice regarding arriving late.',
                'severity' => 'low',
                'created_by' => $creatorId,
            ]);
            $warningsCreated++;
        }

        $deductions = ($basicSalary * 0.05); 
        $allowances = ($basicSalary * 0.10);

        PayrollEntry::updateOrCreate(
             ['employee_id' => $employee->user_id, 'payroll_id' => $payroll->id],
             [
                'basic_salary' => $basicSalary,
                'allowance' => $allowances,
                'commission' => 0,
                'loan' => 0,
                'saturation_deduction' => 0,
                'other_payment' => 0,
                'overtime' => 0,
                'net_salary' => ($basicSalary + $allowances) - $deductions,
                'status' => 'paid',
                'created_by' => $creatorId,
            ]
        );
        $payrollsCreated++;
    }

    DB::commit();
    echo "LIFECYCLE GENERATION COMPLETE!\\n";
    echo "==============================\\n";
    echo "-> Attendances Generated: $attendanceCreated\\n";
    echo "-> Leaves Dispatched: $leavesCreated\\n";
    echo "-> Awards Given: $awardsCreated\\n";
    echo "-> Warnings Issued: $warningsCreated\\n";
    echo "-> Payroll Slips Processed: $payrollsCreated\\n";

} catch (\\Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\\n" . $e->getFile() . " on line " . $e->getLine();
}
`;

const conn = new Client();
conn.on('ready', () => {
    console.log('✅ SSH Connected. Deploying simulation...');
    
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        const remotePath = `${CONFIG.APP_DIR}/public/simulate.php`;
        sftp.writeFile(remotePath, phpPayload, 'utf8', (err) => {
            if (err) throw err;
            console.log('✅ simulate.php uploaded.');

            conn.exec(`/opt/alt/php82/usr/bin/php ${remotePath}`, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log('🧹 Cleaning up...');
                    sftp.unlink(remotePath, (err) => {
                        conn.end();
                    });
                }).on('data', (data) => {
                    console.log('📡 ' + data);
                }).stderr.on('data', (data) => {
                    console.error('⚠️ ' + data);
                });
            });
        });
    });
}).on('error', (err) => {
    console.error('❌ Connection :: error :: ' + err);
}).connect(CONFIG.SSH);
