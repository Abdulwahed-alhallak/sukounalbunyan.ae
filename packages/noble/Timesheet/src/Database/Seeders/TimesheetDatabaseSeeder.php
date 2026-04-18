<?php

namespace Noble\Timesheet\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class TimesheetDatabaseSeeder extends Seeder
{
    public function run()
    {
        Model::unguard();

        $this->call(PermissionTableSeeder::class);
        $this->call(MarketplaceSettingSeeder::class);
        

        if(config('app.run_demo_seeder'))
        {
            $userId = User::resolveDemoCompanyId();
            if (!$userId) {
                return;
            }
            (new DemoTimesheetSeeder())->run($userId);
        }
    }
}
