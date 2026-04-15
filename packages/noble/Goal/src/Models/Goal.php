<?php

namespace Noble\Goal\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Noble\Account\Models\ChartOfAccount;

use App\Traits\TenantBound;

class Goal extends Model
{
    use HasFactory, TenantBound;

    protected $fillable = [
        'goal_name',
        'goal_description',
        'category_id',
        'goal_type',
        'target_amount',
        'current_amount',
        'start_date',
        'target_date',
        'priority',
        'status',
        'account_id',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'current_amount' => 'decimal:2',
            'start_date' => 'date',
            'target_date' => 'date',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(GoalCategory::class, 'category_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'account_id');
    }

    public function milestones()
    {
        return $this->hasMany(GoalMilestone::class, 'goal_id');
    }

    public function contributions()
    {
        return $this->hasMany(GoalContribution::class, 'goal_id');
    }

    public function tracking()
    {
        return $this->hasMany(GoalTracking::class, 'goal_id');
    }
}
