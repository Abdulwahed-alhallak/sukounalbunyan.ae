<?php
namespace App\Traits;

use Illuminate\Support\Facades\collect;

trait HrmReportingTrait
{
    private function attendanceSummaryReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Hrm\Models\Attendance::class)) return $this->emptyReport('Attendance Summary');

        $data = \Noble\Hrm\Models\Attendance::where('created_by', $this->companyId)
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->join('employees', 'attendances.employee_id', '=', 'employees.id')
            ->selectRaw('employees.name, attendances.status, COUNT(*) as count')
            ->groupBy('employees.name', 'attendances.status')
            ->get();

        $employees = $data->groupBy('name')->map(function ($items, $name) {
            $present = $items->firstWhere('status', 'Present');
            $absent = $items->firstWhere('status', 'Absent');
            $total = $items->sum('count');
            return [
                'employee' => $name,
                'present' => $present->count ?? 0,
                'absent' => $absent->count ?? 0,
                'total_days' => $total,
                'rate' => $total > 0 ? round((($present->count ?? 0) / $total) * 100, 1) : 0,
            ];
        })->values()->toArray();

        return [
            'title' => 'Attendance Summary',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'text'],
                ['key' => 'present', 'label' => 'Present', 'type' => 'number'],
                ['key' => 'absent', 'label' => 'Absent', 'type' => 'number'],
                ['key' => 'total_days', 'label' => 'Total Days', 'type' => 'number'],
                ['key' => 'rate', 'label' => 'Attendance %', 'type' => 'percentage'],
            ],
            'rows' => $employees,
            'summary' => [
                ['label' => 'Employees', 'value' => count($employees), 'type' => 'number'],
                ['label' => 'Avg Attendance', 'value' => count($employees) > 0 ? round(collect($employees)->avg('rate'), 1) : 0, 'type' => 'percentage'],
            ],
        ];
    }

    private function leaveBalanceReport(): array
    {
        if (!class_exists(\Noble\Hrm\Models\LeaveApplication::class)) return $this->emptyReport('Leave Balance');

        $data = \Noble\Hrm\Models\LeaveApplication::where('leave_applications.created_by', $this->companyId)
            ->join('employees', 'leave_applications.employee_id', '=', 'employees.id')
            ->selectRaw('employees.name, leave_applications.status, COUNT(*) as count')
            ->groupBy('employees.name', 'leave_applications.status')
            ->get();

        $rows = $data->groupBy('name')->map(function ($items, $name) {
            return [
                'employee' => $name,
                'approved' => $items->firstWhere('status', 'Approved')->count ?? 0,
                'pending' => $items->firstWhere('status', 'Pending')->count ?? 0,
                'rejected' => $items->firstWhere('status', 'Rejected')->count ?? 0,
                'total' => $items->sum('count'),
            ];
        })->values()->toArray();

        return [
            'title' => 'Leave Balance Report',
            'columns' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'text'],
                ['key' => 'approved', 'label' => 'Approved', 'type' => 'number'],
                ['key' => 'pending', 'label' => 'Pending', 'type' => 'number'],
                ['key' => 'rejected', 'label' => 'Rejected', 'type' => 'number'],
                ['key' => 'total', 'label' => 'Total Requests', 'type' => 'number'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Employees', 'value' => count($rows), 'type' => 'number'],
                ['label' => 'Pending Requests', 'value' => collect($rows)->sum('pending'), 'type' => 'number', 'highlight' => true],
            ],
        ];
    }

    private function headcountReport(): array
    {
        if (!class_exists(\Noble\Hrm\Models\Employee::class)) return $this->emptyReport('Headcount');

        $query = \Noble\Hrm\Models\Employee::where('employees.created_by', $this->companyId);

        $byDepartment = (clone $query)
            ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
            ->selectRaw('departments.department_name as department, COUNT(employees.id) as count')
            ->groupBy('departments.department_name')->get();

        return [
            'title' => 'Headcount Report',
            'columns' => [
                ['key' => 'department', 'label' => 'Department', 'type' => 'text'],
                ['key' => 'count', 'label' => 'Employees', 'type' => 'number'],
            ],
            'rows' => $byDepartment->map(fn($d) => ['department' => $d->department ?? 'Unassigned', 'count' => $d->count])->toArray(),
            'summary' => [
                ['label' => 'Total Employees', 'value' => $byDepartment->sum('count'), 'type' => 'number', 'highlight' => true],
                ['label' => 'Departments', 'value' => $byDepartment->count(), 'type' => 'number'],
            ],
            'chartData' => $byDepartment->map(fn($d) => ['name' => $d->department ?? 'Unassigned', 'value' => $d->count])->toArray(),
            'chartType' => 'pie',
        ];
    }

    private function employeeTurnoverReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Hrm\Models\Employee::class)) return $this->emptyReport('Employee Turnover');

        $newHires = \Noble\Hrm\Models\Employee::where('created_by', $this->companyId)
            ->whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $total = \Noble\Hrm\Models\Employee::where('created_by', $this->companyId)->count();

        return [
            'title' => 'Employee Turnover Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'metric', 'label' => 'Metric', 'type' => 'text'],
                ['key' => 'value', 'label' => 'Value', 'type' => 'number'],
            ],
            'rows' => [
                ['metric' => 'New Hires', 'value' => $newHires],
                ['metric' => 'Total Employees', 'value' => $total],
                ['metric' => 'Growth Rate %', 'value' => $total > 0 ? round(($newHires / $total) * 100, 1) : 0],
            ],
            'summary' => [
                ['label' => 'New Hires', 'value' => $newHires, 'type' => 'number', 'highlight' => true],
                ['label' => 'Total Workforce', 'value' => $total, 'type' => 'number'],
            ],
        ];
    }
}
