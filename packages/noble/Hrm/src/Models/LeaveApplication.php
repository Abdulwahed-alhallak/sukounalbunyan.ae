<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use Noble\Hrm\Models\LeaveType;
use Noble\Taskly\Traits\InteractsWithMedia;
use Noble\Taskly\Models\TaskAttachment;

class LeaveApplication extends Model
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'attachment',
        'status',
        'manager_status',
        'manager_id',
        'manager_comment',
        'approver_comment',
        'approved_at',
        'employee_id',  
        'leave_type_id',
        'approved_by',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'attachment' => 'string',
            'approved_at' => 'datetime'
        ];
    }



    protected $appends = ['is_line_manager'];

    public function getIsLineManagerAttribute()
    {
        if (auth()->check()) {
            $employee = \Noble\Hrm\Models\Employee::where('user_id', $this->employee_id)->first();
            return $employee && $employee->line_manager == auth()->id();
        }
        return false;
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function leave_type()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function approved_by()
    {
        return $this->belongsTo(User::class,'approved_by','id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id', 'id');
    }

    public function attachments()
    {
        return $this->morphMany(TaskAttachment::class, 'attachable');
    }
}