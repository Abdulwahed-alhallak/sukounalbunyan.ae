<?php
namespace App\Traits;

use Illuminate\Support\Facades\Schema;

trait ProjectDashboardTrait
{
    private function getProjectKPIs(): ?array
    {
        if (!$this->moduleActive('Taskly')) return null;
        if (!class_exists(\Noble\Taskly\Models\Project::class)) return null;

        $totalProjects = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->count();
        $activeProjects = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->where('status', 'active')->count();
        $completedProjects = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->where('status', 'completed')->count();

        $totalTasks = 0; $totalBugs = 0;
        if (class_exists(\Noble\Taskly\Models\ProjectTask::class) && Schema::hasTable('project_tasks')) {
            $projectIds = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id');
            $totalTasks = \Noble\Taskly\Models\ProjectTask::whereIn('project_id', $projectIds)->count();
        }
        if (class_exists(\Noble\Taskly\Models\ProjectBug::class) && Schema::hasTable('project_bugs')) {
            $totalBugs = \Noble\Taskly\Models\ProjectBug::whereIn('project_id',
                \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id')
            )->count();
        }

        return [
            'total_projects' => $totalProjects,
            'active_projects' => $activeProjects,
            'completed_projects' => $completedProjects,
            'total_tasks' => $totalTasks,
            'completed_tasks' => 0,
            'overdue_tasks' => 0,
            'total_bugs' => $totalBugs,
            'task_completion_rate' => 0,
        ];
    }
}
