<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use App\Models\Warehouse;
use Noble\ProductService\Models\ProductServiceItem;
use Noble\ProductService\Models\ProductServiceCategory;
use Noble\ProductService\Models\ProductServiceUnit;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\Account\Models\Customer;
use Noble\Taskly\Models\Project;
use Noble\Lead\Models\Pipeline;
use Noble\Lead\Models\LeadStage;
use Noble\Lead\Models\DealStage;
use Noble\Lead\Models\Lead;
use Noble\Lead\Models\Deal;
use Noble\Lead\Models\UserLead;
use Noble\Lead\Models\UserDeal;
use Noble\Lead\Models\ClientDeal;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DemoRentalDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Find or Create Company User (Sukoun Commander)
        $admin = User::where('name', 'Sukoun Commander')->first() ?? User::where('type', 'company')->first();
        if (!$admin) {
             echo "Company user not found. Falling back to superadmin...\n";
             $admin = User::where('type', 'superadmin')->first() ?? User::first();
        }

        $workspaceId = $admin->workspace ?? 1; 
        $createdBy = $admin->id;

        echo "Using Admin: {$admin->name} (ID: {$admin->id}, Workspace: {$workspaceId})\n";

        // 2. Global System Settings (UAE Context)
        echo "Updating System Settings (UAE)...\n";
        $settings = [
            'defaultLanguage' => 'ar',
            'defaultCurrency' => 'AED',
            'currencySymbol' => 'ط¯.ط¥',
            'companyName' => 'ط´ط±ظƒط© ط³ظƒظˆظ† ط§ظ„ط¨ظ†ظٹط§ظ† (Sukoun Albunyan)',
            'companyAddress' => 'ظ…ظ†ط·ظ‚ط© ط§ظ„طµط¬ط¹ط© ط§ظ„طµظ†ط§ط¹ظٹط© - ط§ظ„ط´ط§ط±ظ‚ط© - ط§ظ„ط¥ظ…ط§ط±ط§طھ ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ظ…طھط­ط¯ط©',
            'companyCity' => 'ط§ظ„ط´ط§ط±ظ‚ط©',
            'companyState' => 'ط§ظ„ط´ط§ط±ظ‚ط©',
            'companyZipCode' => '00000',
            'companyCountry' => 'ط§ظ„ط¥ظ…ط§ط±ط§طھ ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ظ…طھط­ط¯ط©',
            'companyTelephone' => '+971 6 000 0000',
            'companyEmail' => 'info@sukounalbunyan.ae',
            'timezone' => 'Asia/Dubai',
        ];

        foreach ($settings as $key => $value) {
            Setting::withoutGlobalScopes()->updateOrCreate(
                ['key' => $key, 'created_by' => $createdBy],
                ['value' => $value]
            );
        }

        // 3. Units & Categories
        echo "Ensuring Units & Categories...\n";
        $unitSet = ProductServiceUnit::withoutGlobalScopes()->firstOrCreate(
            ['unit_name' => 'ظ…ط¬ظ…ظˆط¹ط© (Set)'],
            ['created_by' => $createdBy]
        );
        
        $unitMeter = ProductServiceUnit::withoutGlobalScopes()->firstOrCreate(
            ['unit_name' => 'ظ…طھط± ط·ظˆظ„ظٹ (Meter)'],
            ['created_by' => $createdBy]
        );

        $catScaffolding = ProductServiceCategory::withoutGlobalScopes()->firstOrCreate(
            ['name' => 'ط³ظ‚ط§ظ„ط§طھ (Scaffolding)'],
            ['created_by' => $createdBy, 'color' => '#10b77f']
        );

        $catAccessories = ProductServiceCategory::withoutGlobalScopes()->firstOrCreate(
            ['name' => 'ط¥ظƒط³ط³ظˆط§ط±ط§طھ ط³ظ‚ط§ظ„ط§طھ (Accessories)'],
            ['created_by' => $createdBy, 'color' => '#3498db']
        );

        // 4. Warehouse
        echo "Creating UAE Warehouse...\n";
        $warehouse = Warehouse::withoutGlobalScopes()->updateOrCreate(
            ['name' => 'ظ…ط³طھظˆط¯ط¹ ط§ظ„طµط¬ط¹ط© ط§ظ„ط±ط¦ظٹط³ظٹ (Sajaa Main Warehouse)'],
            [
                'address' => 'ظ…ظ†ط·ظ‚ط© ط§ظ„طµط¬ط¹ط© ط§ظ„طµظ†ط§ط¹ظٹط©طŒ ط§ظ„ط´ط§ط±ظ‚ط©طŒ ط§ظ„ط¥ظ…ط§ط±ط§طھ',
                'city' => 'ط§ظ„ط´ط§ط±ظ‚ط©',
                'zip_code' => '00000',
                'email' => 'warehouse@sukounalbunyan.ae',
                'phone' => '+971 50 000 0000',
                'created_by' => $createdBy,
            ]
        );

        // 5. Products (UAE Scaffolding Inventory)
        echo "Creating Scaffolding Products...\n";
        $products = [
            [
                'name' => 'ط³ظ‚ط§ظ„ط§طھ ظ…ط¹ط¯ظ†ظٹط© ط«ظ‚ظٹظ„ط© (Heavy Duty Cup-Lock)',
                'sku' => 'SCAF-CL-01',
                'sale_price' => 45.00,
                'category_id' => $catScaffolding->id,
                'unit' => $unitSet->id,
            ],
            [
                'name' => 'ظ…ظ†طµط© ط¹ظ…ظ„ ط£ظ„ظ…ظ†ظٹظˆظ… (Aluminum Working Platform)',
                'sku' => 'SCAF-AL-02',
                'sale_price' => 75.00,
                'category_id' => $catScaffolding->id,
                'unit' => $unitSet->id,
            ],
            [
                'name' => 'ط£ظ†ط§ط¨ظٹط¨ ظپظˆظ„ط§ط°ظٹط© 6 ظ…طھط± (Steel Tubes 6m)',
                'sku' => 'SCAF-TB-06',
                'sale_price' => 15.00,
                'category_id' => $catAccessories->id,
                'unit' => $unitMeter->id,
            ]
        ];

        $productModels = [];
        foreach ($products as $pData) {
            $productModels[] = ProductServiceItem::withoutGlobalScopes()->updateOrCreate(
                ['sku' => $pData['sku']],
                array_merge($pData, [
                    'type' => 'product',
                    'purchase_price' => $pData['sale_price'] * 0.6,
                    'created_by' => $createdBy,
                    'is_active' => true,
                    'description' => 'ظ…ط¹ط¯ط§طھ ط¹ط§ظ„ظٹط© ط§ظ„ط¬ظˆط¯ط© ظ…طھظˆط§ظپظ‚ط© ظ…ط¹ ظ…ط¹ط§ظٹظٹط± ط§ظ„ط³ظ„ط§ظ…ط© ط§ظ„ط¥ظ…ط§ط±ط§طھظٹط©.'
                ])
            );
        }

        // 6. UAE Client Companies
                // CRM Pipeline Setup
        $pipeline = Pipeline::updateOrCreate(
            ['name' => 'خط مبيعات التأجير', 'created_by' => $createdBy],
            ['created_by' => $createdBy]
        );

        $leadStage = LeadStage::updateOrCreate(
            ['name' => 'مرحلة التأهيل', 'pipeline_id' => $pipeline->id, 'created_by' => $createdBy],
            ['order' => 1, 'created_by' => $createdBy]
        );

        $dealStage = DealStage::updateOrCreate(
            ['name' => 'عقد مبدئي', 'pipeline_id' => $pipeline->id, 'created_by' => $createdBy],
            ['order' => 1, 'created_by' => $createdBy]
        );

        echo "Creating UAE Client Companies...\n";
        $clients = [
            [
                'name' => 'ط´ط±ظƒط© ط§ظ„ط´ط§ط±ظ‚ط© ظ„ظ„ظ…ظ‚ط§ظˆظ„ط§طھ (Sharjah Construction Co)',
                'email' => 'contact@shj-const.ae',
                'site' => 'ظ…ط´ط±ظˆط¹ ط§ظ„طµط¬ط¹ط© ط§ظ„ط³ظƒظ†ظٹ',
            ],
            [
                'name' => 'ظ…ط¬ظ…ظˆط¹ط© ط§ظ„ط­ط¨طھظˆط± - ط¯ط¨ظٹ (Al Habtoor Group)',
                'email' => 'info@alhabtoor.ae',
                'site' => 'ظ…ط´ط±ظˆط¹ ظ†ط®ظ„ط© ط¬ظ…ظٹط±ط§',
            ],
            [
                'name' => 'ط­ط¯ظٹط¯ ط§ظ„ط¥ظ…ط§ط±ط§طھ (Emirates Steel)',
                'email' => 'procurement@emiratessteel.com',
                'site' => 'طھظˆط³ط¹ط© ظ…طµظ†ط¹ ظ…طµظپط­',
            ]
        ];

        foreach ($clients as $cData) {
            $user = User::withoutGlobalScopes()->updateOrCreate(
                ['email' => $cData['email']],
                [
                    'name' => $cData['name'],
                    'password' => Hash::make('client@123'),
                    'type' => 'client',
                    'created_by' => $createdBy,
                    'lang' => 'ar',
                ]
            );

            // Create corresponding Customer in Account module
            Customer::withoutGlobalScopes()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $cData['name'],
                    'contact_person_name' => $cData['name'],
                    'contact_person_email' => $cData['email'],
                    'billing_address' => 'ط§ظ„ط¥ظ…ط§ط±ط§طھ ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ظ…طھط­ط¯ط©',
                    'shipping_address' => 'ط§ظ„ط¥ظ…ط§ط±ط§طھ ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ظ…طھط­ط¯ط©',
                    'creator_id' => $createdBy,
                    'created_by' => $createdBy,
                ]
            );

            // Create corresponding Project in Taskly module
            $project = Project::withoutGlobalScopes()->updateOrCreate(
                ['name' => $cData['site']],
                [
                    'description' => 'مشروع مرتبط بعقد تأجير السقالات',
                    'status' => 'Ongoing',
                    'start_date' => now()->subDays(rand(1, 30)),
                    'end_date' => now()->addMonths(rand(2, 6)),
                    'budget' => rand(100000, 500000),
                    'creator_id' => $createdBy,
                    'created_by' => $createdBy,
                ]
            );

            // Create CRM Lead
            $lead = Lead::create([
                'name' => 'طلب تأجير من ' . $cData['name'],
                'email' => $cData['email'],
                'subject' => 'تأجير سقالات لمشروع',
                'user_id' => $createdBy,
                'pipeline_id' => $pipeline->id,
                'stage_id' => $leadStage->id,
                'creator_id' => $createdBy,
                'created_by' => $createdBy,
                'is_active' => true,
                'date' => now()->subDays(rand(5, 20)),
            ]);
            UserLead::create(['user_id' => $createdBy, 'lead_id' => $lead->id]);

            // Create CRM Deal
            $deal = Deal::create([
                'name' => 'صفقة ' . $cData['name'],
                'price' => rand(50000, 150000),
                'pipeline_id' => $pipeline->id,
                'stage_id' => $dealStage->id,
                'status' => 'Won',
                'creator_id' => $createdBy,
                'created_by' => $createdBy,
                'is_active' => true,
            ]);
            UserDeal::create(['user_id' => $createdBy, 'deal_id' => $deal->id]);
            ClientDeal::create(['client_id' => $user->id, 'deal_id' => $deal->id]);

            // Create a contract for each
            echo "Creating Contract for {$cData['name']}...\n";
            $contract = RentalContract::withoutGlobalScopes()->create([
                'contract_number' => RentalContract::generateContractNumber(),
                'customer_id' => $user->id,
                'project_id' => $project->id,
                'warehouse_id' => $warehouse->id,
                'start_date' => now()->subDays(rand(1, 30)),
                'end_date' => now()->addMonths(rand(2, 6)),
                'billing_cycle' => 'monthly',
                'status' => 'active',
                'payment_status' => 'unpaid',
                'security_deposit' => 10000.00,
                'min_days' => 30,
                'created_by' => $createdBy,
                'workspace' => $workspaceId,
                'notes' => 'طھط£ط¬ظٹط± ظ…ط¹ط¯ط§طھ ظ„ظ…ط´ط±ظˆط¹ ' . $cData['site'],
                'site_name' => $cData['site'],
                'site_address' => 'ظ…ظˆظ‚ط¹ ط§ظ„ط¹ظ…ظ„ - ط§ظ„ط¥ظ…ط§ط±ط§طھ',
            ]);

            // Add 1-2 random products to each contract
            $selectedProducts = array_rand($productModels, rand(1, 2));
            if (!is_array($selectedProducts)) $selectedProducts = [$selectedProducts];

            foreach ($selectedProducts as $idx) {
                RentalContractItem::withoutGlobalScopes()->create([
                    'contract_id' => $contract->id,
                    'product_id' => $productModels[$idx]->id,
                    'quantity' => rand(50, 200),
                    'price_per_cycle' => $productModels[$idx]->sale_price,
                ]);
            }
        }

        echo "\nUAE Demo Data & Settings Sync Complete!\n";
    }
}

