<?php
namespace App\Traits;

trait ProjectReportingTrait
{
    private function projectStatusReport(): array
    {
        if (!class_exists(\Noble\Taskly\Models\Project::class)) return $this->emptyReport('Project Status');

        $projects = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->get(['id', 'name', 'status', 'start_date', 'end_date']);

        $rows = $projects->map(function ($p) {
            $taskTotal = 0;
            $taskDone = 0;
            if (class_exists(\Noble\Taskly\Models\ProjectTask::class)) {
                $taskTotal = \Noble\Taskly\Models\ProjectTask::where('project_id', $p->id)->count();
                $taskDone = 0; // is_complete column doesn't exist
            }
            return [
                'name' => $p->name,
                'status' => $p->status,
                'tasks' => $taskTotal,
                'completed' => $taskDone,
                'progress' => $taskTotal > 0 ? round(($taskDone / $taskTotal) * 100, 1) : 0,
                'start_date' => $p->start_date?->format('Y-m-d') ?? '—',
                'end_date' => $p->end_date?->format('Y-m-d') ?? '—',
            ];
        })->toArray();

        return [
            'title' => 'Project Status Report',
            'columns' => [
                ['key' => 'name', 'label' => 'Project', 'type' => 'text'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'badge'],
                ['key' => 'tasks', 'label' => 'Tasks', 'type' => 'number'],
                ['key' => 'completed', 'label' => 'Completed', 'type' => 'number'],
                ['key' => 'progress', 'label' => 'Progress %', 'type' => 'percentage'],
                ['key' => 'end_date', 'label' => 'Deadline', 'type' => 'date'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Projects', 'value' => count($rows), 'type' => 'number'],
                ['label' => 'Avg Progress', 'value' => count($rows) > 0 ? round(collect($rows)->avg('progress'), 1) : 0, 'type' => 'percentage', 'highlight' => true],
            ],
        ];
    }

    private function taskProductivityReport(string $dateFrom, string $dateTo): array
    {
        return $this->emptyReport('Task Productivity', 'Requires Taskly module data');
    }

    private function overdueTasksReport(): array
    {
        if (!class_exists(\Noble\Taskly\Models\ProjectTask::class)) return $this->emptyReport('Overdue Tasks');

        $projectIds = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id');
        $tasks = collect([]); // Cannot query overdue tasks natively without end_date in project_tasks schema

        return [
            'title' => 'Overdue Tasks Report',
            'columns' => [
                ['key' => 'title', 'label' => 'Task', 'type' => 'text'],
                ['key' => 'project_name', 'label' => 'Project', 'type' => 'text'],
                ['key' => 'priority', 'label' => 'Priority', 'type' => 'badge'],
                ['key' => 'end_date', 'label' => 'Due Date', 'type' => 'date'],
                ['key' => 'days_overdue', 'label' => 'Days Overdue', 'type' => 'number'],
            ],
            'rows' => $tasks->map(fn($t) => [
                'title' => $t->title,
                'project_name' => $t->project_name,
                'priority' => $t->priority ?? 'medium',
                'end_date' => $t->end_date->format('Y-m-d'),
                'days_overdue' => now()->diffInDays($t->end_date),
            ])->toArray(),
            'summary' => [
                ['label' => 'Overdue Tasks', 'value' => $tasks->count(), 'type' => 'number', 'highlight' => true],
            ],
        ];
    }
}
