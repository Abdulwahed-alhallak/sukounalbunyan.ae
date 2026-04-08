<?php

namespace DionONE\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeOnboarding extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'status',
        'start_date',
        'due_date',
        'completed_at',
        'checklist_items',
        'notes',
        'assigned_to',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
            'completed_at' => 'date',
            'checklist_items' => 'array',
        ];
    }

    public function employee()
    {
        return $this->belongsTo(\App\Models\User::class, 'employee_id');
    }

    public function assignee()
    {
        return $this->belongsTo(\App\Models\User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public static function defaultChecklist(): array
    {
        return [
            ['key' => 'welcome_kit', 'label' => 'Welcome Kit Delivered', 'completed' => false],
            ['key' => 'company_tour', 'label' => 'Company Tour', 'completed' => false],
            ['key' => 'it_setup', 'label' => 'IT Equipment & Access Setup', 'completed' => false],
            ['key' => 'hr_documents', 'label' => 'HR Documentation Completed', 'completed' => false],
            ['key' => 'team_introduction', 'label' => 'Team Introduction', 'completed' => false],
            ['key' => 'policy_review', 'label' => 'Company Policy Review', 'completed' => false],
            ['key' => 'system_training', 'label' => 'System Training', 'completed' => false],
            ['key' => 'manager_meeting', 'label' => 'Manager Introduction Meeting', 'completed' => false],
        ];
    }
}
