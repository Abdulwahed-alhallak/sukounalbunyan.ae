<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;
use Noble\ProductService\Models\Warehouse;
use Noble\ProductService\Models\Product;
use Noble\ProductService\Models\WarehouseStock;
use App\Models\Category;

class RentalTestDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Create a Test Customer
        $customer = Customer::firstOrCreate(
            ['email' => 'demo_rental@noble.com'],
            [
                'name' => 'شركة النخبة للمقاولات',
                'phone' => '0501234567',
                'address' => 'دبي، شارع الشيخ زايد',
                'type' => 'company',
            ]
        );

        // 2. Create a Warehouse for Rentals
        $warehouse = Warehouse::firstOrCreate(
            ['code' => 'WRH-RENTAL-01'],
            [
                'name' => 'مستودع دبي للمعدات (التأجير)',
                'location' => 'دبي الصناعية',
                'type' => 'physical',
                'is_active' => true,
            ]
        );

        // 3. Ensure a Category exists
        $category = Category::firstOrCreate(
            ['slug' => 'rental-equipment'],
            [
                'name' => 'معدات التأجير',
                'type' => 'product',
                'is_active' => true,
            ]
        );

        // 4. Create Sample Products (Scaffolding, Tools)
        $products = [
            [
                'name' => 'سقالة معدنية 3 متر',
                'sku' => 'RNT-SCAF-3M',
                'description' => 'سقالة معدنية شديدة التحمل بارتفاع 3 أمتار',
                'unit' => 'قطعة',
                'price' => 500,
            ],
            [
                'name' => 'مولد كهربائي 5000 واط',
                'sku' => 'RNT-GEN-5K',
                'description' => 'مولد كهربائي يعمل بالديزل',
                'unit' => 'جهاز',
                'price' => 3500,
            ],
            [
                'name' => 'حفار صغير (Bobcat)',
                'sku' => 'RNT-EXC-MINI',
                'description' => 'حفار صغير للمساحات الضيقة',
                'unit' => 'معدة',
                'price' => 45000,
            ]
        ];

        foreach ($products as $prodData) {
            $product = Product::firstOrCreate(
                ['sku' => $prodData['sku']],
                [
                    'name' => $prodData['name'],
                    'category_id' => $category->id,
                    'type' => 'standard',
                    'base_price' => $prodData['price'],
                    'description' => $prodData['description'],
                    'unit_of_measure' => $prodData['unit'],
                    'is_active' => true,
                    'is_rentable' => true,
                ]
            );

            // Ensure WarehouseStock exists
            WarehouseStock::firstOrCreate(
                ['product_id' => $product->id, 'warehouse_id' => $warehouse->id],
                [
                    'quantity' => 100, // Large quantity for testing
                    'rented_quantity' => 0,
                    'damaged_quantity' => 0,
                    'last_counted_at' => now(),
                ]
            );
        }

        $this->command->info('Rental test data seeded successfully! Created Customer, Warehouse, and 3 Products with 100 stock each.');
    }
}
