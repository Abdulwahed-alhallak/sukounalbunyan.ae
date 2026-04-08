<?php

namespace DionONE\Hrm\Models;

use Illuminate\Database\Eloquent\Model;

class BiometricLog extends Model
{
    protected $fillable = [
        'emp_id',
        'punch_time',
        'type',
        'is_processed',
        'error_message',
        'created_by'
    ];

    public function employee()
    {
        // emp_id in device matches employee_id in system
        return $this->belongsTo(Employee::class, 'emp_id', 'employee_id');
    }
}
