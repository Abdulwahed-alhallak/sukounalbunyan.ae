<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowLog extends Model
{
    protected $fillable = [
        'workflow_rule_id', 'company_id', 'trigger_module', 'trigger_event',
        'triggerable_type', 'triggerable_id', 'status',
        'actions_executed', 'error_message', 'duration_ms',
    ];

    protected $casts = [
        'actions_executed' => 'array',
    ];

    public function rule(): BelongsTo
    {
        return $this->belongsTo(WorkflowRule::class, 'workflow_rule_id');
    }

    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }
}
