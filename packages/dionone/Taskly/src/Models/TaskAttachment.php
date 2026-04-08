<?php

namespace DionONE\Taskly\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class TaskAttachment extends Model
{
    protected $fillable = [
        'task_id',
        'attachable_id',
        'attachable_type',
        'file_name',
        'file_path',
        'uploaded_by',
        'creator_id',
        'created_by',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(ProjectTask::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function attachable()
    {
        return $this->morphTo();
    }
}
