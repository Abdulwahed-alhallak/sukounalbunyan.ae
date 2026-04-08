<?php

namespace DionONE\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_name',
        'asset_type',
        'serial_number',
        'purchase_date',
        'purchase_cost',
        'status',
        'assigned_to',
        'assigned_date',
        'return_date',
        'condition',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'assigned_date' => 'date',
            'return_date' => 'date',
            'purchase_cost' => 'decimal:2',
        ];
    }

    public function assignedEmployee()
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }
}
