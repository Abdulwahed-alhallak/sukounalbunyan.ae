<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamificationRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_name',
        'description',
        'points_reward',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
