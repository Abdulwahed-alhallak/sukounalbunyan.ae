<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Noble\Hrm\Models\Branch;
use Noble\Hrm\Models\Department;

use App\Traits\TenantBound;

class Designation extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'designation_name',
        'branch_id',
        'department_id',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [];
    }



    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
