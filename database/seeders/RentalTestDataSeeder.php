<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Warehouse;
use Noble\ProductService\Models\ProductServiceItem;
use Noble\ProductService\Models\ProductServiceCategory;
use Noble\ProductService\Models\WarehouseStock;

class RentalTestDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Create a Test Customer (User)
        $customer = User::firstOrCreate(
            ['email' => 'demo_rental@noble.com'],
            [
                'name' => 'شركة النخبة للمقاولات',
                'password' => bcrypt('password'),
                'type' => 'client',
            ]
        );

        // 2. Create a Warehouse for Rentals
        $warehouse = Warehouse::firstOrCreate(
            ['name' => 'مستودع التأجير - دبي'],
            [
                'address' => 'دبي الصناعية',
                'city' => 'دبي',
                'is_active' => true,
            ]
        );

        // 3. Ensure a Category exists
        $category = ProductServiceCategory::firstOrCreate(
            ['name' => 'معدات التأجير'],
            [
                // Category fields
            ]
        );

        // 4. Create Sample Products
        $products = [
            [
                'name' => 'سقالة معدنية 3 متر',
                'sku' => 'RNT-SCAF-3M',
                'description' => 'سقالة معدنية بارتفاع 3 أمتار',
                'price' => 500,
            ],
            [
                'name' => 'مولد كهربائي 5000 واط',
                'sku' => 'RNT-GEN-5K',
                'description' => 'مولد كهربائي يعمل بالديزل',
                'price' => 3500,
            ],
            [
                'name' => 'حفار صغير (Bobcat)',
                'sku' => 'RNT-EXC-MINI',
                'description' => 'حفار صغير للمساحات الضيقة',
                'price' => 45000,
            ]
        ];

        foreach ($products as $prodData) {
            $product = ProductServiceItem::firstOrCreate(
                ['sku' => $prodData['sku']],
                [
                    'name' => $prodData['name'],
                    'category_id' => $category->id,
                    'type' => 'product',
                    'sale_price' => $prodData['price'],
                    'purchase_price' => $prodData['price'] * 0.8,
                    'description' => $prodData['description'],
                    'is_active' => true,
                ]
            );

            // Ensure WarehouseStock exists
            WarehouseStock::firstOrCreate(
                ['product_id' => $product->id, 'warehouse_id' => $warehouse->id],
                [
                    'quantity' => 100, // Large quantity for testing
                    'rented_quantity' => 0,
                ]
            );
        }

        $this->command->info('Rental test data seeded successfully! Created Customer, Warehouse, and 3 Products with 100 stock each.');
    }
}
