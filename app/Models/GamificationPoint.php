<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamificationPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_id',
        'points',
        'level',
        'tier',
        'achievements',
    ];

    protected $casts = [
        'achievements' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
