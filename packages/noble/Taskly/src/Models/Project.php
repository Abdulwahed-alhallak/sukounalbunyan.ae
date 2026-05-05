<?php

namespace Noble\Taskly\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

use Noble\Taskly\Traits\InteractsWithMedia;

use App\Traits\TenantBound;

class Project extends Model
{
    use HasFactory, InteractsWithMedia, TenantBound;

    protected static function booted()
    {
        // Add any project-specific boot logic here if needed
    }

    protected $fillable = [
        'name',
        'description',
        'budget',
        'start_date',
        'end_date',
        'status',
        'contract_id',
        'deal_id',
        'job_location_id',
        'creator_id',
        'created_by',
        'contact_name',
        'contact_phone',
        'calendar_color',
    ];

    public function teamMembers()
    {
        return $this->belongsToMany(User::class, 'project_users');
    }

    public function clients()
    {
        return $this->belongsToMany(User::class, 'project_clients', 'project_id', 'client_id');
    }

    public function milestones()
    {
        return $this->hasMany(\Noble\Taskly\Models\ProjectMilestone::class);
    }

    public function tasks()
    {
        return $this->hasMany(\Noble\Taskly\Models\ProjectTask::class);
    }

    public function bugs()
    {
        return $this->hasMany(\Noble\Taskly\Models\ProjectBug::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(\Noble\Taskly\Models\ActivityLog::class);
    }

    public function files()
    {
        return $this->hasMany(\Noble\Taskly\Models\ProjectFile::class);
    }

    public function contract()
    {
        return $this->belongsTo(\Noble\Contract\Models\Contract::class, 'contract_id');
    }

    public function deal()
    {
        return $this->belongsTo(\Noble\Lead\Models\Deal::class, 'deal_id');
    }

    public function salesInvoices()
    {
        return $this->hasMany(\App\Models\SalesInvoice::class, 'project_id');
    }

    public function purchaseInvoiceItems()
    {
        return $this->hasMany(\App\Models\PurchaseInvoiceItem::class, 'project_id');
    }

    public function expenses()
    {
        return $this->hasMany(\Noble\Account\Models\Expense::class, 'project_id');
    }

    public function revenues()
    {
        return $this->hasMany(\Noble\Account\Models\Revenue::class, 'project_id');
    }

    protected function casts(): array
    {
        return [
            'budget' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public static function GivePermissionToRoles($role_id = null, $rolename = null)
    {
        $permissions = [
            'manage-project',
            'view-project',
            'manage-own-project',
            'manage-project-task',
            'manage-own-project-task',
            'manage-project-bug',
            'manage-own-project-bug'
        ];

        // Retrieve role dynamically without hardcoding role names in multiple if blocks
        if ($rolename) {
            $query = Role::where('name', $rolename);
            if ($role_id) {
                $query->where('id', $role_id);
            }
            $role = $query->first();

            if ($role) {
                foreach ($permissions as $permission_name) {
                    $permission = Permission::firstOrCreate(
                        ['name' => $permission_name],
                        [
                            'add_on' => 'Taskly',
                            'module' => 'Project',
                            'label' => ucwords(str_replace('-', ' ', $permission_name)),
                            'guard_name' => 'web'
                        ]
                    );
                    if (!$role->hasPermissionTo($permission_name)) {
                        $role->givePermissionTo($permission);
                    }
                }
            }
        }
    }
}
