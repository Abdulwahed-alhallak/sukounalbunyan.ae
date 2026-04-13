<?php

namespace Noble\Taskly\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskTimer extends Model
{
    protected $fillable = [
        'project_id',
        'task_id',
        'user_id',
        'start_time',
        'end_time',
        'duration_seconds',
        'is_billable',
        'description',
        'workspace_id',
        'created_by',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_billable' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(ProjectTask::class, 'task_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
