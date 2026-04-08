<?php

namespace DionONE\Training\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DionONE\Hrm\Models\Branch;
use DionONE\Hrm\Models\Department;

class Trainer extends Model
{
    use HasFactory;

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