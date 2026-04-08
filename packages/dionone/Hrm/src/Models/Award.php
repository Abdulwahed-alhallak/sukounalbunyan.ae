<?php

namespace DionONE\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Award extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'award_type_id',
        'award_date',
        'description',
        'certificate',
        'status',
        'manager_status',
        'manager_comment',
        'manager_id',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'award_date' => 'date',
        ];
    }

    public function awardType()
    {
        return $this->belongsTo(AwardType::class);
    }

    public function employee()
    {
        return $this->belongsTo(\App\Models\User::class, 'employee_id');
    }

    public function manager()
    {
        return $this->belongsTo(\App\Models\User::class, 'manager_id');
    }
}