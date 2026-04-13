<?php

namespace Noble\Taskly\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

use Noble\Taskly\Traits\InteractsWithMedia;

class Project extends Model
{
    use HasFactory, InteractsWithMedia;

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
        $staff_permission = [
            'manage-project',
            'view-project',
            'manage-own-project',
            'manage-project-task',
            'manage-own-project-task',
            'manage-project-bug',
            'manage-own-project-bug'
        ];

        $client_permission = [
            'manage-project',
            'view-project',
            'manage-own-project',
            'manage-project-task',
            'manage-own-project-task',
            'manage-project-bug',
            'manage-own-project-bug'
        ];
        if ($rolename == 'staff') {
            $roles_v = Role::where('name', 'staff')->where('id', $role_id)->first();
            foreach ($staff_permission as $permission_v) {
                $permission = Permission::where('name', $permission_v)->first();
                if (!empty($permission)) {
                    if (!$roles_v->hasPermissionTo($permission_v)) {
                        $roles_v->givePermissionTo($permission);
                    }
                }
            }
        }

        if ($rolename == 'client') {
            $roles_v = Role::where('name', 'client')->where('id', $role_id)->first();
            foreach ($client_permission as $permission_v) {
                $permission = Permission::where('name', $permission_v)->first();
                if (!empty($permission)) {
                    if (!$roles_v->hasPermissionTo($permission_v)) {
                        $roles_v->givePermissionTo($permission);
                    }
                }
            }
        }
    }
}
