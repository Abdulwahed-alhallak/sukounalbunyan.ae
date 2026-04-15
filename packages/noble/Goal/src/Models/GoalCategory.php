<?php

namespace Noble\Goal\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use App\Traits\TenantBound;

class GoalCategory extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'category_name',
        'category_code',
        'description',
        'is_active',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean'
        ];
    }

    public function goals()
    {
        return $this->hasMany(Goal::class, 'category_id');
    }
}
