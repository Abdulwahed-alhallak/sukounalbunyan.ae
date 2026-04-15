<?php

namespace Noble\Training\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Noble\Hrm\Models\Branch;
use Noble\Hrm\Models\Department;

use App\Traits\TenantBound;

class Trainer extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'name',
        'contact',
        'email',
        'experience',
        'branch_id',
        'department_id',
        'expertise',
        'qualification',
        'creator_id',
        'created_by',
    ];   

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}