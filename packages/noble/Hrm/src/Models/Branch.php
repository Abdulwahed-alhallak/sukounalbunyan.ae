<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


use App\Traits\TenantBound;

class Branch extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'branch_name',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            
        ];
    }




}