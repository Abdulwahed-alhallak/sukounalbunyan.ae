<?php

namespace DionONE\Hrm\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolationType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'severity',
        'default_deduction_amount',
        'created_by',
    ];
}
