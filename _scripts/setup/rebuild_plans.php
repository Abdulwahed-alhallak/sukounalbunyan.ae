<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Delete old plans
\App\Models\Plan::query()->delete();

// 2. Re-seed the Master Plan
(new \Database\Seeders\PlanSeeder())->run();
$masterPlan = \App\Models\Plan::where('name', 'Noble Enterprise Master')->first();

if (!$masterPlan) {
    echo "❌ Failed to create Master Plan.\n";
    exit;
}

// 3. Force all AddOns to be enabled globally
\App\Models\AddOn::query()->update(['is_enable' => 1]);

// 4. Update the Company
$company = \App\Models\User::where('email', 'admin@noblearchitecture.net')->first();

if ($company) {
    $company->active_plan = $masterPlan->id;
    $company->plan_expire_date = null;
    $company->storage_limit = 999999999;
    $company->total_user = -1;
    $company->is_trial_done = 1;
    
    // Assign modules
    $modulesStr = is_array($masterPlan->modules) ? implode(',', $masterPlan->modules) : $masterPlan->modules;
    if (\Schema::hasColumn('users', 'active_module')) {
        $company->active_module = $modulesStr;
    }
    $company->save();

    // 5. Build relations for UserActiveModule
    \App\Models\UserActiveModule::where('user_id', $company->id)->delete();
    $moduleArray = explode(',', $modulesStr);
    foreach ($moduleArray as $mod) {
        \App\Models\UserActiveModule::create([
            'user_id' => $company->id,
            'module' => $mod
        ]);
    }
    
    // Sync roles for the Company
    event(new \App\Events\DefaultData($company->id, $modulesStr));
    
    try {
        $client_role = \Spatie\Permission\Models\Role::where('name', 'client')->where('created_by', $company->id)->first();
        if ($client_role) {
            event(new \App\Events\GivePermissionToRole($client_role->id, 'client', $modulesStr));
        }
        
        $staff_role = \Spatie\Permission\Models\Role::where('name', 'staff')->where('created_by', $company->id)->first();
        if ($staff_role) {
            event(new \App\Events\GivePermissionToRole($staff_role->id, 'staff', $modulesStr));
        }
    } catch (\Exception $e) {
        echo "Warning: Error applying permissions: " . $e->getMessage() . "\n";
    }

    // 6. Bind Users to HRM
    $users = \App\Models\User::where('created_by', $company->id)->get();
    foreach ($users as $u) {
        if ($u->type === 'staff') {
            // Give staff the active modules visually
            if (\Schema::hasColumn('users', 'active_module')) {
                $u->active_module = $modulesStr;
                $u->save();
            }

            // Sync UserActiveModule for staff
            \App\Models\UserActiveModule::where('user_id', $u->id)->delete();
            foreach ($moduleArray as $mod) {
                \App\Models\UserActiveModule::create([
                    'user_id' => $u->id,
                    'module' => $mod
                ]);
            }

            // Bind to Employee Table for HRM
            if (class_exists(\Noble\Hrm\Models\Employee::class)) {
                $emp = \Noble\Hrm\Models\Employee::where('user_id', $u->id)->first();
                if (!$emp) {
                    \Noble\Hrm\Models\Employee::create([
                        'user_id' => $u->id,
                        'name_ar' => $u->name,
                        'email_address' => $u->email,
                        'employee_id' => 'EMP2026' . str_pad($u->id, 4, '0', STR_PAD_LEFT),
                        'created_by' => $company->id,
                        'creator_id' => $company->id,
                        'employee_status' => 'Active'
                    ]);
                    echo "-> Linked Staff '{$u->name}' into HRM Employees.\n";
                }
            }
        }
    }
}

// Global Superadmin Bypass
$superadmin = \App\Models\User::where('type', 'superadmin')->first();
if ($superadmin) {
    if (\Schema::hasColumn('users', 'active_module')) {
        $superadmin->active_module = $modulesStr ?? implode(',', \App\Models\AddOn::pluck('module')->toArray());
        $superadmin->save();
    }
}

\Illuminate\Support\Facades\Artisan::call('cache:clear');
echo "✅ SUCCESS! Old plans deleted. Noble Enterprise Master mapped. Employees synchronized to HRM perfectly.\n";
