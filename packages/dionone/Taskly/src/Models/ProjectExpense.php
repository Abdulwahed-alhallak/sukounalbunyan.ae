<?php

namespace DionONE\Taskly\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia as SpatieInteractsWithMedia;
use DionONE\Taskly\Traits\InteractsWithMedia;

class ProjectExpense extends Model implements HasMedia
{
    use SpatieInteractsWithMedia, InteractsWithMedia;

    protected $fillable = [
        'project_id',
        'name',
        'amount',
        'date',
        'description',
        'attachment',
        'workspace_id',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
