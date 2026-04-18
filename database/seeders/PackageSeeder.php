<?php

namespace Database\Seeders;

use App\Classes\Module;
use App\Events\DefaultData;
use App\Events\GivePermissionToRole;
use App\Models\AddOn;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserActiveModule;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Artisan;

class PackageSeeder extends Seeder
{
    public function run($userId = null): void
    {
        $user = $this->resolveTargetCompany($userId);
        if (!$user) {
            $this->command?->error('No company account found to sync packages against.');
            return;
        }

        $userId = $user->id;
        $path = base_path('packages/noble');
        $devPackagePath = \Illuminate\Support\Facades\File::directories($path);

        foreach ($devPackagePath as $package) {
            $filePath = $package.'/module.json';
            if (!file_exists($filePath)) {
                continue;
            }
            $jsonContent = file_get_contents($filePath);
            $data = json_decode($jsonContent, true);

            AddOn::updateOrCreate(
                ['module' => $data['name']],
                [
                    'name' => $data['alias'],
                    'monthly_price' => $data['monthly_price'] ?? 0,
                    'yearly_price' => $data['yearly_price'] ?? 0,
                    'package_name' => $data['package_name'],
                    'is_enable' => true,
                    'for_admin' => $data['for_admin'] ?? false,
                    'priority' => $data['priority'] ?? 0,
                ]
            );

            if (empty($data['for_admin'])) {
                $activePackage = UserActiveModule::where('module', $data['name'])->where('user_id', $userId)->first();
                if(empty($activePackage)){
                    $activePackage = new UserActiveModule();
                    $activePackage->user_id = $userId;
                    $activePackage->module = $data['name'];
                    $activePackage->save();
                }
            }
        }

        $companyModules = AddOn::where('is_enable', 1)->where('for_admin', 0)->pluck('module')->toArray();
        UserActiveModule::where('user_id', $userId)
            ->whereNotIn('module', $companyModules)
            ->delete();

        $allEnabled = (new Module())->allEnabled();
        foreach ($allEnabled as $key => $value) {
            try {
                Artisan::call('package:seed', ['packageName' => $value]);
                $this->command?->info("{$value} Seeder Run Successfully!");
            } catch (\Throwable $th) {
                $this->command?->error("Failed to seed package '{$value}': " . $th->getMessage());
            }
        }

        // static assignPlan
        $plan = Plan::first();
        if ($plan) {
            $user->active_plan = $plan->id;
            $user->plan_expire_date = date('Y-m-d', strtotime('+10 month'));
            $user->total_user = -1;
            $user->storage_limit = 50000000;
            $user->save();
        }

        $modules = UserActiveModule::where('user_id', $user->id)->pluck('module')->toArray();
        $modules =  implode(',',$modules);
        DefaultData::dispatch($user->id, $modules);
        $company_role = $user->roles()->where('name', 'company')->first();
        $client_role = Role::where('name', 'client')->where('created_by', $user->id)->first();
        $staff_role = Role::where('name', 'staff')->where('created_by', $user->id)->first();

        if (!empty($company_role)) {
            GivePermissionToRole::dispatch($company_role->id, 'company', $modules);
        }
        if (!empty($client_role)) {
            GivePermissionToRole::dispatch($client_role->id, 'client', $modules);
        }
        if (!empty($staff_role)) {
            GivePermissionToRole::dispatch($staff_role->id, 'staff', $modules);
        }
    }

    private function resolveTargetCompany(?int $userId): ?User
    {
        if (!empty($userId)) {
            return User::find($userId);
        }

        return User::where('email', 'admin@noblearchitecture.net')->first()
            ?? User::where('type', 'company')->orderBy('id')->first();
    }
}
