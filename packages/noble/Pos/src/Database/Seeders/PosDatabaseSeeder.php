<?php

namespace Noble\Pos\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class PosDatabaseSeeder extends Seeder
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
            (new DemoPosSeeder())->run($userId);

        }
    }
}
