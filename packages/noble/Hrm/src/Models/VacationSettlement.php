<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VacationSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'vacation_start_date',
        'vacation_days',
        'status',
        'basic_salary',
        'allowances_total',
        'total_amount',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'vacation_start_date' => 'date',
            'basic_salary' => 'decimal:2',
            'allowances_total' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(\App\Models\User::class, 'employee_id');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
