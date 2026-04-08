<?php

namespace DionONE\Hrm\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class EmployeeViolation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'violation_type_id',
        'violation_date',
        'incident_date',
        'status',
        'action_taken',
        'deduction_amount',
        'description',
        'created_by',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function violationType()
    {
        return $this->belongsTo(ViolationType::class, 'violation_type_id');
    }
}
