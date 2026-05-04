<?php

namespace Noble\Rental\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RentalPermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            'manage-rentals',
            'create-rentals',
            'edit-rentals',
            'view-rentals',
            'delete-rentals',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web'],
                [
                    'add_on' => 'Rental',
                    'module' => 'Rental',
                    'label'  => ucwords(str_replace('-', ' ', $permission))
                ]
            );
        }

        // Assign to Company Admin role
        $role = Role::where('name', 'company')->first();
        if ($role) {
            $role->givePermissionTo($permissions);
        }
        
        // Also assign to Super Admin if needed (usually super admin has all)
        $superAdmin = Role::where('name', 'super-admin')->first();
        if ($superAdmin) {
            $superAdmin->givePermissionTo($permissions);
        }
    }
}
