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
            'companyCity' => 'الشارقة',
            'companyState' => 'الشارقة',
            'companyZipCode' => '00000',
            'companyCountry' => 'الإمارات العربية المتحدة',
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
            ['unit_name' => 'مجموعة (Set)'],
            ['created_by' => $createdBy]
        );
        
        $unitMeter = ProductServiceUnit::withoutGlobalScopes()->firstOrCreate(
            ['unit_name' => 'متر طولي (Meter)'],
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
            ]
        );

        // 5. Products (UAE Scaffolding Inventory)
        echo "Creating Scaffolding Products...\n";
        $products = [
            [
                'name' => 'سقالات معدنية ثقيلة (Heavy Duty Cup-Lock)',
                'sku' => 'SCAF-CL-01',
                'sale_price' => 45.00,
                'category_id' => $catScaffolding->id,
                'unit' => $unitSet->id,
            ],
            [
                'name' => 'منصة عمل ألمنيوم (Aluminum Working Platform)',
                'sku' => 'SCAF-AL-02',
                'sale_price' => 75.00,
                'category_id' => $catScaffolding->id,
                'unit' => $unitSet->id,
            ],
            [
                'name' => 'أنابيب فولاذية 6 متر (Steel Tubes 6m)',
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
                    'description' => 'معدات عالية الجودة متوافقة مع معايير السلامة الإماراتية.'
                ])
            );
        }

        // 6. UAE Client Companies
        echo "Creating UAE Client Companies...\n";
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
                    'billing_address' => 'الإمارات العربية المتحدة',
                    'shipping_address' => 'الإمارات العربية المتحدة',
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
