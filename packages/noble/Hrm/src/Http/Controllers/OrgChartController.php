<?php

namespace Noble\Hrm\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Branch;
use App\Models\User;

class OrgChartController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-employees')) {
            $creatorId = creatorId();

            $employees = Employee::with(['user', 'department', 'designation', 'branch'])
                ->where('created_by', $creatorId)
                ->whereNotIn('employee_status', ['RESIGNED', 'TERMINATED'])
                ->get();

            // Get departments referenced by employees (may have different created_by)
            $deptIds = $employees->pluck('department_id')->filter()->unique()->values();
            $departments = Department::whereIn('id', $deptIds)
                ->with('branch')
                ->withCount(['employees' => function ($q) use ($creatorId) {
                    $q->where('created_by', $creatorId)->whereNotIn('employee_status', ['RESIGNED', 'TERMINATED']);
                }])
                ->get();

            $branchIds = $employees->pluck('branch_id')->filter()->unique()
                ->merge($departments->pluck('branch_id')->filter()->unique())
                ->unique()->values();
            $branches = Branch::whereIn('id', $branchIds)->get();

            // Build tree structure based on line_manager relationships
            $orgTree = $this->buildOrgTree($employees, $departments);

            // Stats for the header (line_manager can be empty string or null)
            $stats = [
                'total_employees' => $employees->count(),
                'total_departments' => $departments->count(),
                'total_branches' => $branches->count(),
                'with_manager' => $employees->filter(fn ($e) => !empty($e->line_manager))->count(),
                'without_manager' => $employees->filter(fn ($e) => empty($e->line_manager))->count(),
            ];

            return Inertia::render('Hrm/OrgChart/Index', [
                'orgTree' => $orgTree,
                'employees' => $employees->map(fn ($emp) => [
                    'id' => $emp->id,
                    'user_id' => $emp->user_id,
                    'employee_id' => $emp->employee_id,
                    'name' => $emp->user->name ?? $emp->name_ar ?? 'Unknown',
                    'name_ar' => $emp->name_ar,
                    'avatar' => $emp->user->avatar ?? null,
                    'department' => $emp->department->department_name ?? null,
                    'designation' => $emp->designation->designation_name ?? null,
                    'branch' => $emp->branch->branch_name ?? null,
                    'line_manager' => $emp->line_manager,
                    'job_title' => $emp->job_title,
                ]),
                'departments' => $departments->map(fn ($dept) => [
                    'id' => $dept->id,
                    'name' => $dept->department_name,
                    'branch' => $dept->branch->branch_name ?? null,
                    'employee_count' => $dept->employees_count,
                ]),
                'stats' => $stats,
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    private function buildOrgTree($employees, $departments)
    {
        $employeeMap = [];
        foreach ($employees as $emp) {
            $employeeMap[$emp->user_id] = [
                'id' => $emp->id,
                'user_id' => $emp->user_id,
                'employee_id' => $emp->employee_id,
                'name' => $emp->user->name ?? $emp->name_ar ?? 'Unknown',
                'name_ar' => $emp->name_ar,
                'avatar' => $emp->user->avatar ?? null,
                'department' => $emp->department->department_name ?? null,
                'department_id' => $emp->department_id,
                'designation' => $emp->designation->designation_name ?? null,
                'branch' => $emp->branch->branch_name ?? null,
                'line_manager' => $emp->line_manager,
                'job_title' => $emp->job_title,
                'children' => [],
            ];
        }

        $roots = [];

        foreach ($employeeMap as $userId => &$node) {
            if (!empty($node['line_manager']) && isset($employeeMap[$node['line_manager']])) {
                $employeeMap[$node['line_manager']]['children'][] = &$node;
            } else {
                $roots[] = &$node;
            }
        }
        unset($node);

        // If no tree structure (no line_managers set), group by department
        if (empty($roots) || count($roots) === count($employeeMap)) {
            return $this->buildDepartmentTree($employees, $departments);
        }

        return $roots;
    }

    private function buildDepartmentTree($employees, $departments)
    {
        $tree = [];

        foreach ($departments as $dept) {
            $deptEmployees = $employees->where('department_id', $dept->id);
            if ($deptEmployees->isEmpty()) continue;

            $tree[] = [
                'id' => 'dept_' . $dept->id,
                'name' => $dept->department_name,
                'isDepartment' => true,
                'branch' => $dept->branch->branch_name ?? null,
                'employee_count' => $deptEmployees->count(),
                'children' => $deptEmployees->map(fn ($emp) => [
                    'id' => $emp->id,
                    'user_id' => $emp->user_id,
                    'employee_id' => $emp->employee_id,
                    'name' => $emp->user->name ?? $emp->name_ar ?? 'Unknown',
                    'name_ar' => $emp->name_ar,
                    'avatar' => $emp->user->avatar ?? null,
                    'department' => $dept->department_name,
                    'designation' => $emp->designation->designation_name ?? null,
                    'branch' => $dept->branch->branch_name ?? null,
                    'job_title' => $emp->job_title,
                    'children' => [],
                ])->values()->all(),
            ];
        }

        // Add unassigned employees (no department) as a separate group
        $unassigned = $employees->whereNull('department_id')->merge(
            $employees->where('department_id', 0)
        );
        if ($unassigned->isNotEmpty()) {
            $tree[] = [
                'id' => 'dept_unassigned',
                'name' => __('Unassigned Personnel'),
                'isDepartment' => true,
                'branch' => null,
                'employee_count' => $unassigned->count(),
                'children' => $unassigned->map(fn ($emp) => [
                    'id' => $emp->id,
                    'user_id' => $emp->user_id,
                    'employee_id' => $emp->employee_id,
                    'name' => $emp->user->name ?? $emp->name_ar ?? 'Unknown',
                    'name_ar' => $emp->name_ar,
                    'avatar' => $emp->user->avatar ?? null,
                    'department' => null,
                    'designation' => $emp->designation->designation_name ?? null,
                    'branch' => $emp->branch->branch_name ?? null,
                    'job_title' => $emp->job_title,
                    'children' => [],
                ])->values()->all(),
            ];
        }

        return $tree;
    }
}
