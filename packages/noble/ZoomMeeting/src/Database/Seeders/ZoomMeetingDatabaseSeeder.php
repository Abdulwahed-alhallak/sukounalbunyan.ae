<?php

namespace Noble\ZoomMeeting\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class ZoomMeetingDatabaseSeeder extends Seeder
{
    public function run()
    {
        Model::unguard();

        $this->call(PermissionTableSeeder::class);
        $this->call(MarketplaceSettingSeeder::class);

        if(config('app.run_demo_seeder'))
        {
            // Add here your demo data seeders
            $userId = User::resolveDemoCompanyId();
            if (!$userId) {
                return;
            }

        
            (new DemoZoomMeetingSeeder())->run($userId);}
    }
}
