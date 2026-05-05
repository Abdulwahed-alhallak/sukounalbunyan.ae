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
            'currencySymbol' => 'د.إ',
            'companyName' => 'شركة سكون البنيان (Sukoun Albunyan)',
            'companyAddress' => 'منطقة الصجعة الصناعية - الشارقة - الإمارات العربية المتحدة',
            'companyCountry' => 'الإمارات العربية المتحدة',
            'companyTelephone' => '+971 6 000 0000',
            'companyEmail' => 'info@sukounalbunyan.ae',
            'timezone' => 'Asia/Dubai',
        ];

        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(
                ['key' => $key, 'workspace' => $workspaceId, 'created_by' => $createdBy],
                ['value' => $val]
            );
        }

        // 3. Units & Categories
        echo "Ensuring Units & Categories...\n";
        $unitSet = ProductServiceUnit::withoutGlobalScopes()->firstOrCreate(
            ['name' => 'مجموعة (Set)'],
            ['created_by' => $createdBy]
        );
        
        $unitMeter = ProductServiceUnit::withoutGlobalScopes()->firstOrCreate(
            ['name' => 'متر طولي (Meter)'],
            ['created_by' => $createdBy]
        );

        $catScaffolding = ProductServiceCategory::withoutGlobalScopes()->firstOrCreate(
            ['name' => 'سقالات (Scaffolding)'],
            ['created_by' => $createdBy, 'color' => '#10b77f']
        );

        $catAccessories = ProductServiceCategory::withoutGlobalScopes()->firstOrCreate(
            ['name' => 'إكسسوارات سقالات (Accessories)'],
            ['created_by' => $createdBy, 'color' => '#3498db']
        );

        // 4. Warehouse
        echo "Creating UAE Warehouse...\n";
        $warehouse = Warehouse::withoutGlobalScopes()->updateOrCreate(
            ['name' => 'مستودع الصجعة الرئيسي (Sajaa Main Warehouse)'],
            [
                'address' => 'منطقة الصجعة الصناعية، الشارقة، الإمارات',
                'city' => 'الشارقة',
                'zip_code' => '00000',
                'email' => 'warehouse@sukounalbunyan.ae',
                'phone' => '+971 50 000 0000',
                'created_by' => $createdBy,
                'workspace' => $workspaceId,
            ]
        );

        // 5. Products (Scaffolding Components)
        echo "Creating Scaffolding Products...\n";
        $products = [
            [
                'name' => 'سقالات معدنية ثقيلة (Heavy Duty Cup-Lock)',
                'sku' => 'SCAF-CL-01',
                'sale_price' => 45.00,
                'category_id' => $catScaffolding->id,
                'unit_id' => $unitSet->id,
            ],
            [
                'name' => 'منصة عمل ألمنيوم (Aluminum Working Platform)',
                'sku' => 'SCAF-AL-02',
                'sale_price' => 75.00,
                'category_id' => $catScaffolding->id,
                'unit_id' => $unitSet->id,
            ],
            [
                'name' => 'أنابيب فولاذية 6 متر (Steel Tubes 6m)',
                'sku' => 'SCAF-TB-06',
                'sale_price' => 15.00,
                'category_id' => $catAccessories->id,
                'unit_id' => $unitMeter->id,
            ]
        ];

        $productModels = [];
        foreach ($products as $pData) {
            $productModels[] = ProductServiceItem::withoutGlobalScopes()->updateOrCreate(
                ['sku' => $pData['sku']],
                array_merge($pData, [
                    'type' => 'product',
                    'tax_id' => null,
                    'purchase_price' => $pData['sale_price'] * 0.6,
                    'created_by' => $createdBy,
                    'workspace_id' => $workspaceId,
                    'is_active' => true,
                    'description' => 'معدات عالية الجودة متوافقة مع معايير السلامة الإماراتية.'
                ])
            );
        }

        // 6. UAE Client Companies
        echo "Creating UAE Client Companies...\n";

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
        $clients = [
            [
                'name' => 'شركة الشارقة للمقاولات (Sharjah Construction Co)',
                'email' => 'contact@shj-const.ae',
                'site' => 'مشروع الصجعة السكني',
            ],
            [
                'name' => 'مجموعة الحبتور - دبي (Al Habtoor Group)',
                'email' => 'info@alhabtoor.ae',
                'site' => 'مشروع نخلة جميرا',
            ],
            [
                'name' => 'حديد الإمارات (Emirates Steel)',
                'email' => 'procurement@emiratessteel.com',
                'site' => 'توسعة مصنع مصفح',
            ]
        ];

        foreach ($clients as $cData) {
            // Find or Create User for Client
            $user = User::withoutGlobalScopes()->firstOrCreate(
                ['email' => $cData['email']],
                [
                    'name' => $cData['name'],
                    'password' => Hash::make('Client@2024'),
                    'type' => 'client',
                    'lang' => 'ar',
                    'created_by' => $createdBy,
                ]
            );

            // Create corresponding Customer in Account module
            Customer::withoutGlobalScopes()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $cData['name'],
                    'email' => $cData['email'],
                    'billing_address' => 'الإمارات العربية المتحدة',
                    'shipping_address' => 'الإمارات العربية المتحدة',
                    'creator_id' => $createdBy,
                    'created_by' => $createdBy,
                    'workspace' => $workspaceId,
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
                    'workspace' => $workspaceId,
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
                'workspace' => $workspaceId,
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
                'workspace' => $workspaceId,
                'is_active' => true,
            ]);
            UserDeal::create(['user_id' => $createdBy, 'deal_id' => $deal->id]);
            ClientDeal::create(['client_id' => $user->id, 'deal_id' => $deal->id]);

            // Create a contract for each
            echo "Creating Contract for {$cData['name']}...\n";
            $contract = RentalContract::withoutGlobalScopes()->create([
                'contract_number' => 'RENT-' . date('Y-m-') . str_pad(rand(1, 999), 4, '0', STR_PAD_LEFT),
                'client_name' => $cData['name'],
                'start_date' => now()->subDays(rand(1, 30)),
                'end_date' => now()->addMonths(rand(2, 6)),
                'billing_cycle' => 'monthly',
                'status' => 'active',
                'payment_status' => 'unpaid',
                'security_deposit' => 10000.00,
                'min_days' => 30,
                'created_by' => $createdBy,
                'workspace' => $workspaceId,
                'notes' => 'تأجير معدات لمشروع ' . $cData['site'],
                'site_name' => $cData['site'],
                'site_address' => 'موقع العمل - الإمارات',
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