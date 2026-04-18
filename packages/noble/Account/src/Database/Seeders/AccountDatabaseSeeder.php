<?php

namespace Noble\Account\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Noble\Account\Helpers\AccountUtility;
use Noble\Account\Models\BankAccount;
use Noble\Account\Models\Customer;
use Noble\Account\Models\Expense;
use Noble\Account\Models\ExpenseCategories;
use Noble\Account\Models\Revenue;
use Noble\Account\Models\RevenueCategories;
use Noble\Account\Models\Vendor;

class AccountDatabaseSeeder extends Seeder
{
    public function run()
    {
        Model::unguard();

        $this->call(PermissionTableSeeder::class);
        $this->call(MarketplaceSettingSeeder::class);

        if(config('app.run_demo_seeder'))
        {
            $user = User::resolveDemoCompany();
            if($user)
            {
                $userId = $user->id;
                AccountUtility::defaultdata($userId);

                // Check if demo data already exists
                if(Vendor::where('created_by', $userId)->doesntExist()) {
                    (new DemoVendorDatabaseSeeder())->run($userId);
                }
                if(Customer::where('created_by', $userId)->doesntExist()) {
                    (new DemoCustomerDatabaseSeeder())->run($userId);
                }
                if(BankAccount::where('created_by', $userId)->doesntExist()) {
                    (new DemoBankAccountSeeder())->run($userId);
                }
                if(RevenueCategories::where('created_by', $userId)->doesntExist()) {
                    (new DemoRevenueCategoriesSeeder())->run($userId);
                }
                if(Revenue::where('created_by', $userId)->doesntExist()) {
                    (new DemoRevenueSeeder())->run($userId);
                }
                if(ExpenseCategories::where('created_by', $userId)->doesntExist()) {
                    (new DemoExpenseCategoriesSeeder())->run($userId);
                }
                if(Expense::where('created_by', $userId)->doesntExist()) {
                    (new DemoExpenseSeeder())->run($userId);
                }
            }
        }
    }
}
