<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\TenantBound;

class WorkflowRule extends Model
{
    use TenantBound;
    protected $fillable = [
        'company_id', 'name', 'description', 'is_active', 'priority',
        'trigger_module', 'trigger_event', 'trigger_conditions',
        'actions', 'schedule_type', 'delay_minutes', 'cron_expression',
        'created_by', 'execution_count', 'last_executed_at',
    ];

    protected $casts = [
        'trigger_conditions' => 'array',
        'actions' => 'array',
        'is_active' => 'boolean',
        'last_executed_at' => 'datetime',
    ];

    // ── Relationships ──
    public function logs(): HasMany
    {
        return $this->hasMany(WorkflowLog::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ── Scopes ──
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeForTrigger($query, string $module, string $event)
    {
        return $query->where('trigger_module', $module)->where('trigger_event', $event);
    }

    // ── Constants ──
    public const MODULES = [
        'invoice' => 'Sales Invoice',
        'purchase' => 'Purchase Invoice',
        'hrm' => 'HR Management',
        'crm' => 'CRM / Leads',
        'project' => 'Projects',
        'pos' => 'Point of Sale',
        'contract' => 'Contracts',
        'support' => 'Support Tickets',
    ];

    public const EVENTS = [
        'created' => 'Record Created',
        'updated' => 'Record Updated',
        'deleted' => 'Record Deleted',
        'status_changed' => 'Status Changed',
        'overdue' => 'Overdue',
        'amount_exceeded' => 'Amount Exceeded Threshold',
    ];

    public const ACTION_TYPES = [
        'notification' => 'Send In-App Notification',
        'email' => 'Send Email',
        'whatsapp' => 'Send WhatsApp Message',
        'create_task' => 'Create Task',
        'change_status' => 'Change Status',
        'generate_pdf_invoice' => 'Generate PDF Invoice',
        'webhook' => 'Call Webhook URL',
    ];

    public const OPERATORS = [
        '=' => 'Equals',
        '!=' => 'Not Equals',
        '>' => 'Greater Than',
        '<' => 'Less Than',
        '>=' => 'Greater or Equal',
        '<=' => 'Less or Equal',
        'contains' => 'Contains',
    ];

    /**
     * Check if trigger conditions match the model data
     */
    public function conditionsMatch($model): bool
    {
        $conditions = $this->trigger_conditions;
        if (empty($conditions)) return true;

        foreach ($conditions as $condition) {
            $field = $condition['field'] ?? null;
            $operator = $condition['operator'] ?? '=';
            $value = $condition['value'] ?? null;

            if (!$field || !$model->offsetExists($field)) continue;

            $modelValue = $model->{$field};

            $match = match ($operator) {
                '=' => $modelValue == $value,
                '!=' => $modelValue != $value,
                '>' => $modelValue > $value,
                '<' => $modelValue < $value,
                '>=' => $modelValue >= $value,
                '<=' => $modelValue <= $value,
                'contains' => str_contains((string) $modelValue, (string) $value),
                default => true,
            };

            if (!$match) return false;
        }

        return true;
    }

    /**
     * Record execution
     */
    public function recordExecution(): void
    {
        $this->increment('execution_count');
        $this->update(['last_executed_at' => now()]);
    }
}
