<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use Noble\Taskly\Traits\InteractsWithMedia;

class EmployeeContract extends Model
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'employee_id',
        'contract_type',
        'start_date',
        'end_date',
        'probation_end_date',
        'basic_salary',
        'status',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'probation_end_date' => 'date',
            'basic_salary' => 'decimal:2',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
