<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinalSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'last_working_day',
        'status',
        'basic_salary',
        'leave_encashment',
        'gratuity',
        'other_earnings',
        'deductions',
        'total_amount',
        'separation_reason',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'last_working_day' => 'date',
            'basic_salary' => 'decimal:2',
            'leave_encashment' => 'decimal:2',
            'gratuity' => 'decimal:2',
            'other_earnings' => 'decimal:2',
            'deductions' => 'decimal:2',
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
