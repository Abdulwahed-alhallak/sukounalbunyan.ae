<?php

namespace Noble\Taskly\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Noble\Taskly\Models\BugStage;
use Noble\Taskly\Models\TaskStage;

class TasklyDatabaseSeeder extends Seeder
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

            TaskStage::defaultdata($userId);
            BugStage::defaultdata($userId);

            (new DemoProjectSeeder())->run($userId);
            (new DemoProjectMilestoneSeeder())->run($userId);
            (new DemoProjectTaskSeeder())->run($userId);
            (new DemoProjectBugSeeder())->run($userId);
            (new DemoActivityLogSeeder())->run($userId);
        }
    }
}
