<?php

namespace Noble\Taskly\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Noble\Taskly\Models\TaskStage;
use App\Models\User;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia as SpatieInteractsWithMedia;
use Noble\Taskly\Traits\InteractsWithMedia;

class ProjectTask extends Model implements HasMedia
{
    use HasFactory, SpatieInteractsWithMedia, InteractsWithMedia;

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->created_by) && auth()->check()) {
                $model->created_by = creatorId();
            }
            if (empty($model->creator_id) && auth()->check()) {
                $model->creator_id = auth()->id();
            }
        });
    }

    protected $fillable = [
        'project_id',
        'milestone_id',
        'title',
        'priority',
        'assigned_to',
        'duration',
        'description',
        'stage_id',
        'creator_id',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function milestone()
    {
        return $this->belongsTo(ProjectMilestone::class, 'milestone_id');
    }

    public function taskStage()
    {
        return $this->belongsTo(TaskStage::class, 'stage_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assignedUsers()
    {
        $userIds = $this->assigned_to ? explode(',', $this->assigned_to) : [];
        return User::whereIn('id', $userIds)->get();
    }

    public function getAssignedUserIdsAttribute()
    {
        return $this->assigned_to ? explode(',', $this->assigned_to) : [];
    }

    public function comments()
    {
        return $this->hasMany(TaskComment::class, 'task_id');
    }

    public function subtasks()
    {
        return $this->hasMany(TaskSubtask::class, 'task_id');
    }

    public function timers()
    {
        return $this->hasMany(TaskTimer::class, 'task_id');
    }

    public function getTotalTimeLoggedAttribute()
    {
        return $this->timers()->sum('duration_seconds') ?? 0;
    }

}
