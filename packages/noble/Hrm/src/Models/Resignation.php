<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use App\Traits\TenantBound;

class Resignation extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'employee_id',
        'last_working_date',
        'reason',
        'description',
        'status',
        'manager_status',
        'manager_comment',
        'manager_id',
        'document',
        'approved_by',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'last_working_date' => 'date',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(\App\Models\User::class, 'employee_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by');
    }

    public function manager()
    {
        return $this->belongsTo(\App\Models\User::class, 'manager_id');
    }
}