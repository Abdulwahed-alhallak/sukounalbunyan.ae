<?php
namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait HrmDashboardTrait
{
    private function getHrmKPIs(): ?array
    {
        if (!$this->moduleActive('Hrm')) return null;
        if (!class_exists(\Noble\Hrm\Models\Employee::class)) return null;

        $today = now()->toDateString();
        $totalEmployees = \Noble\Hrm\Models\Employee::where('created_by', $this->companyId)->count();

        $presentToday = 0;
        $absentToday = 0;
        if (class_exists(\Noble\Hrm\Models\Attendance::class) && Schema::hasTable('attendances')) {
            $presentToday = \Noble\Hrm\Models\Attendance::where('created_by', $this->companyId)
                ->where('date', $today)
                ->where('status', 'Present')
                ->count();
            $absentToday = $totalEmployees - $presentToday;
        }

        $pendingLeaves = 0;
        if (class_exists(\Noble\Hrm\Models\LeaveApplication::class) && Schema::hasTable('leave_applications')) {
            $pendingLeaves = \Noble\Hrm\Models\LeaveApplication::where('created_by', $this->companyId)
                ->where('status', 'Pending')
                ->count();
        }

        $departmentStats = [];
        if (class_exists(\Noble\Hrm\Models\Department::class) && Schema::hasTable('departments')) {
            $departmentStats = \Noble\Hrm\Models\Employee::where('employees.created_by', $this->companyId)
                ->join('departments', 'employees.department_id', '=', 'departments.id')
                ->select('departments.department_name as name', DB::raw('COUNT(employees.id) as count'))
                ->groupBy('departments.department_name')
                ->orderByDesc('count')
                ->limit(8)->get()->toArray();
        }

        $upcomingBirthdays = [];
        if (Schema::hasColumn('employees', 'date_of_birth')) {
            $thirtyDaysFromNow = now()->addDays(30);
            $upcomingBirthdays = \Noble\Hrm\Models\Employee::where('created_by', $this->companyId)
                ->whereNotNull('date_of_birth')
                ->with('user:id,name')
                ->get(['id', 'user_id', 'date_of_birth'])
                ->filter(function($emp) use ($thirtyDaysFromNow) {
                    try {
                        $dob = \Carbon\Carbon::parse($emp->date_of_birth);
                        $dobThisYear = $dob->copy()->year(now()->year);
                        if ($dobThisYear->isPast()) $dobThisYear->addYear();
                        return $dobThisYear->between(now(), $thirtyDaysFromNow);
                    } catch (\Exception $e) { return false; }
                })->take(5)->toArray();
        }

        return [
            'total_employees' => $totalEmployees,
            'present_today' => $presentToday,
            'absent_today' => $absentToday,
            'attendance_rate' => $totalEmployees > 0 ? round(($presentToday / $totalEmployees) * 100, 1) : 0,
            'pending_leaves' => $pendingLeaves,
            'departments' => $departmentStats,
            'upcoming_birthdays' => $upcomingBirthdays,
        ];
    }
}
