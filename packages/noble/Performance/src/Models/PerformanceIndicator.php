<?php

namespace Noble\Performance\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

use App\Traits\TenantBound;

class PerformanceIndicator extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'measurement_unit',
        'target_value',
        'status',
        'creator_id',
        'created_by',
    ];

    public function category()
    {
        return $this->belongsTo(PerformanceIndicatorCategory::class, 'category_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}