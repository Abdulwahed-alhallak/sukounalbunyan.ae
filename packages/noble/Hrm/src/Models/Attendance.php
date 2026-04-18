<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Models\Shift;

use App\Traits\TenantBound;

class Attendance extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'employee_id',
        'shift_id',
        'date',
        'clock_in',
        'clock_out',
        'break_hour',
        'total_hour',
        'overtime_hours',
        'overtime_amount',
        'status',
        'notes',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'employee_id' => 'integer',
            'shift_id' => 'integer',
            'date' => 'date',
            'clock_in' => 'datetime',
            'clock_out' => 'datetime',
            'break_hour' => 'decimal:2',
            'total_hour' => 'decimal:2',
            'overtime_hours' => 'decimal:2',
            'overtime_amount' => 'decimal:2'
        ];
    }



    public function user()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }


    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * Process complete attendance - calculate everything automatically.
     */

}