<?php

namespace Noble\Rental\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\Rental\Models\RentalReturn;
use Noble\ProductService\Models\ProductServiceItem;
use Noble\ProductService\Models\WarehouseStock;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Carbon\Carbon;

class RentalDemoSeeder extends Seeder
{
    private int $workspace;
    
    public function run(): void
    {
        $user = User::where('email', 'admin@sukounalbunyan.net')->first() 
                ?? User::where('type', 'company')->first();
        
        if (!$user) {
            $this->command->error('No company user found to own the demo data.');
            return;
        }

        $this->workspace = $user->id;
        $this->command?->info("🏗️  Seeding Rental Demo Data for: {$user->email} (ID: {$this->workspace})");

        $warehouse   = $this->ensureScaffoldingWarehouse();
        $products    = $this->ensureScaffoldingProducts($warehouse);
        $clients     = $this->createConstructionClients();
        $this->createRentalContracts($clients, $products, $warehouse);

        $this->command?->info('✅  Rental demo data seeded successfully.');
    }

    // ──────────────────────────────────────────────────────────────────────
    // Warehouse
    // ──────────────────────────────────────────────────────────────────────
    private function ensureScaffoldingWarehouse(): Warehouse
    {
        return Warehouse::firstOrCreate(
            ['name' => 'Scaffolding Depot', 'created_by' => $this->workspace],
            [
                'name'       => 'Scaffolding Depot',
                'phone'      => '+963-11-555-0100',
                'email'      => 'depot@noble-arch.sy',
                'city'       => 'Damascus',
                'address'    => 'Al-Mazzeh Industrial Area',
                'zip_code'   => '0000',
                'created_by' => $this->workspace,
            ]
        );
    }

    // ──────────────────────────────────────────────────────────────────────
    // Scaffolding Products
    // ──────────────────────────────────────────────────────────────────────
    private function ensureScaffoldingProducts(Warehouse $warehouse): array
    {
        $items = [
            ['name' => 'Scaffolding H-Frame 2.0m (AED)',   'sku' => 'SCF-FRAME-2M',  'sale_price' => 15.00, 'qty' => 500],
            ['name' => 'Scaffolding H-Frame 1.5m (AED)',   'sku' => 'SCF-FRAME-15M', 'sale_price' => 12.00, 'qty' => 300],
            ['name' => 'Steel Walk Board 3.0m (AED)',      'sku' => 'SCF-BOARD-3M',  'sale_price' => 8.00,  'qty' => 800],
            ['name' => 'Swivel Coupler (AED)',             'sku' => 'SCF-CUP-SW',    'sale_price' => 2.50,  'qty' => 2000],
            ['name' => 'Fixed Right Coupler (AED)',        'sku' => 'SCF-CUP-FX',    'sale_price' => 2.00,  'qty' => 2000],
            ['name' => 'Safety Mesh Net 10m (AED)',        'sku' => 'SCF-NET-10',    'sale_price' => 25.00, 'qty' => 200],
            ['name' => 'Adjustable Base Jack (AED)',       'sku' => 'SCF-BASE-150',  'sale_price' => 4.00,  'qty' => 1000],
            ['name' => 'Adjustable Screw Jack (AED)',      'sku' => 'SCF-JACK-ADJ',  'sale_price' => 6.00,  'qty' => 600],
            ['name' => 'Ledger Tube 3.0m (AED)',           'sku' => 'SCF-LED-3M',    'sale_price' => 5.50,  'qty' => 1000],
            ['name' => 'Diagonal Brace 2.5m (AED)',        'sku' => 'SCF-BRACE-25',  'sale_price' => 4.50,  'qty' => 800],
        ];

        $created = [];
        foreach ($items as $item) {
            $product = ProductServiceItem::firstOrCreate(
                ['sku' => $item['sku'], 'created_by' => $this->workspace],
                [
                    'name'        => $item['name'],
                    'sku'         => $item['sku'],
                    'type'        => 'product',
                    'sale_price'  => $item['sale_price'],
                    'purchase_price' => $item['sale_price'] * 0.6,
                    'unit'        => 'pcs',
                    'created_by'  => $this->workspace,
                ]
            );

            // Stock the warehouse
            WarehouseStock::firstOrCreate(
                ['product_id' => $product->id, 'warehouse_id' => $warehouse->id],
                ['product_id' => $product->id, 'warehouse_id' => $warehouse->id, 'quantity' => $item['qty']]
            );

            $created[] = array_merge(['id' => $product->id], $item);
        }

        $this->command?->info("  → {$warehouse->name} stocked with " . count($created) . " scaffolding products.");
        return $created;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Construction Company Clients
    // ──────────────────────────────────────────────────────────────────────
    private function createConstructionClients(): array
    {
        $companies = [
            ['name' => 'Emaar Properties PJSC',         'email' => 'contracts@emaar.ae',   'phone' => '+971-4-367-3333'],
            ['name' => 'Arabtec Construction LLC',     'email' => 'ops@arabtecuae.com',   'phone' => '+971-4-340-0700'],
            ['name' => 'Damac Properties Dubai',        'email' => 'rental@damac.com',     'phone' => '+971-4-373-1000'],
            ['name' => 'Sobha Realty Group',            'email' => 'info@sobha.com',       'phone' => '+971-800-999-999'],
        ];

        $created = [];
        foreach ($companies as $co) {
            $user = User::firstOrCreate(
                ['email' => $co['email']],
                [
                    'name'       => $co['name'],
                    'email'      => $co['email'],
                    'mobile_no'  => $co['phone'],
                    'type'       => 'client',
                    'password'   => Hash::make('password'),
                    'created_by' => $this->workspace,
                ]
            );
            $created[] = $user;
        }

        $this->command?->info('  → ' . count($created) . ' construction company clients ensured.');
        return $created;
    }

    // ──────────────────────────────────────────────────────────────────────
    // Rental Contracts with Items, Returns, Invoices
    // ──────────────────────────────────────────────────────────────────────
    private function createRentalContracts(array $clients, array $products, Warehouse $warehouse): void
    {
        $productMap = collect($products)->keyBy('sku');

        // ── Contract 1: Al-Tameer, active, daily, 45 days, partial return ──
        $c1 = $this->makeContract($clients[0], [
            'billing_cycle'   => 'daily',
            'start_date'      => Carbon::now()->subDays(45),
            'payment_status'  => 'partial',
            'paid_amount'     => 1500.00,
            'total_invoiced'  => 3200.00,
            'status'          => 'active',
            'warehouse_id'    => $warehouse->id,
            'terms'           => "1. All materials remain property of Sukoun Albunyan.\n2. Customer is liable for any damage or loss.\n3. 30-day notice required for contract termination.\n4. Rental calculated daily from the delivery date.\n5. Payment due within 15 days of invoice.",
            'notes'           => 'High-rise residential project, floors 1-20. Site: Al-Mazzeh District.',
        ]);

        $this->addContractItem($c1, $productMap['SCF-FRAME-2M']['id'],  100, 15.00, $warehouse->id);
        $this->addContractItem($c1, $productMap['SCF-BOARD-3M']['id'],  200, 8.00,  $warehouse->id);
        $this->addContractItem($c1, $productMap['SCF-CUP-SW']['id'],    400, 2.50,  $warehouse->id);
        $this->addContractItem($c1, $productMap['SCF-BASE-150']['id'],  100, 4.00,  $warehouse->id);
        $this->addContractItem($c1, $productMap['SCF-NET-10']['id'],     20, 25.00, $warehouse->id);

        // Partial return: 30 frames + 80 boards returned after 30 days
        $this->addReturn($c1, $productMap['SCF-FRAME-2M']['id'], 30, Carbon::now()->subDays(15));
        $this->addReturn($c1, $productMap['SCF-BOARD-3M']['id'], 80, Carbon::now()->subDays(15));

        // ── Contract 2: Bina & Tashyeed, active, monthly, 3 months, unpaid ──
        $c2 = $this->makeContract($clients[1], [
            'billing_cycle'   => 'monthly',
            'start_date'      => Carbon::now()->subMonths(3),
            'payment_status'  => 'unpaid',
            'paid_amount'     => 0.00,
            'total_invoiced'  => 0.00,
            'status'          => 'active',
            'warehouse_id'    => $warehouse->id,
            'terms'           => "1. Monthly billing — invoice generated on the 1st of each month.\n2. Late payment incurs 2% monthly interest.\n3. Contract auto-renews unless 30 days notice is given.\n4. Damaged goods billed at replacement cost.",
            'notes'           => 'Commercial tower, 8 floors. Site: Kafr Sousa area.',
        ]);

        $this->addContractItem($c2, $productMap['SCF-FRAME-15M']['id'], 80, 12.00, $warehouse->id);
        $this->addContractItem($c2, $productMap['SCF-LED-3M']['id'],   160, 5.50,  $warehouse->id);
        $this->addContractItem($c2, $productMap['SCF-BRACE-25']['id'], 120, 4.50,  $warehouse->id);
        $this->addContractItem($c2, $productMap['SCF-JACK-ADJ']['id'],  80, 6.00,  $warehouse->id);
        $this->addContractItem($c2, $productMap['SCF-CUP-FX']['id'],   300, 2.00,  $warehouse->id);

        // ── Contract 3: Damascus Builders, closed (fully returned, invoice paid) ──
        $c3 = $this->makeContract($clients[2], [
            'billing_cycle'   => 'daily',
            'start_date'      => Carbon::now()->subDays(90),
            'payment_status'  => 'paid',
            'paid_amount'     => 4860.00,
            'total_invoiced'  => 4860.00,
            'status'          => 'closed',
            'warehouse_id'    => $warehouse->id,
            'last_billed_at'  => Carbon::now()->subDays(2),
            'terms'           => "1. Standard daily rental terms apply.\n2. Full payment required before material release.\n3. Insurance certificate required for projects above 10 floors.",
            'notes'           => 'Bridge construction project — completed. All materials returned.',
        ]);

        $this->addContractItem($c3, $productMap['SCF-FRAME-2M']['id'],  150, 15.00, $warehouse->id);
        $this->addContractItem($c3, $productMap['SCF-BOARD-3M']['id'],  300, 8.00,  $warehouse->id);
        $this->addContractItem($c3, $productMap['SCF-NET-10']['id'],     30, 25.00, $warehouse->id);
        $this->addContractItem($c3, $productMap['SCF-BASE-150']['id'],  150, 4.00,  $warehouse->id);

        // All items returned (contract is closed)
        $this->addReturn($c3, $productMap['SCF-FRAME-2M']['id'],  150, Carbon::now()->subDays(2));
        $this->addReturn($c3, $productMap['SCF-BOARD-3M']['id'],  300, Carbon::now()->subDays(2));
        $this->addReturn($c3, $productMap['SCF-NET-10']['id'],      30, Carbon::now()->subDays(2));
        $this->addReturn($c3, $productMap['SCF-BASE-150']['id'],   150, Carbon::now()->subDays(2));

        // Generate a paid invoice for contract 3
        $this->generatePaidInvoice($c3, 4860.00);

        // ── Contract 4: Al-Wasl, active, quotation stage (short term) ──
        $c4 = $this->makeContract($clients[3], [
            'billing_cycle'   => 'daily',
            'start_date'      => Carbon::now()->subDays(10),
            'payment_status'  => 'unpaid',
            'paid_amount'     => 0.00,
            'total_invoiced'  => 0.00,
            'status'          => 'active',
            'warehouse_id'    => $warehouse->id,
            'terms'           => "1. Short-term rental — max 30 days.\n2. Immediate return required on expiry.\n3. Deposit of 500 USD held until full return.",
            'notes'           => 'Villa renovation project. Estimated 30-day rental.',
        ]);

        $this->addContractItem($c4, $productMap['SCF-FRAME-2M']['id'],  40, 15.00, $warehouse->id);
        $this->addContractItem($c4, $productMap['SCF-BOARD-3M']['id'],  80, 8.00,  $warehouse->id);
        $this->addContractItem($c4, $productMap['SCF-CUP-SW']['id'],   160, 2.50,  $warehouse->id);
        $this->addContractItem($c4, $productMap['SCF-JACK-ADJ']['id'],  40, 6.00,  $warehouse->id);

        // Partial return after 5 days
        $this->addReturn($c4, $productMap['SCF-FRAME-2M']['id'], 10, Carbon::now()->subDays(5));

        $this->command?->info('  → 4 rental contracts created with items, returns, and invoices.');
    }

    // ──────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────
    private function makeContract(User $client, array $data): RentalContract
    {
        return RentalContract::create([
            'customer_id'    => $client->id,
            'warehouse_id'   => $data['warehouse_id'],
            'start_date'     => $data['start_date'],
            'billing_cycle'  => $data['billing_cycle'],
            'status'         => $data['status'],
            'payment_status' => $data['payment_status'],
            'paid_amount'    => $data['paid_amount'],
            'total_invoiced' => $data['total_invoiced'],
            'terms'          => $data['terms'] ?? null,
            'notes'          => $data['notes'] ?? null,
            'last_billed_at' => $data['last_billed_at'] ?? null,
            'created_by'     => $this->workspace,
            'workspace'      => $this->workspace,
        ]);
    }

    private function addContractItem(RentalContract $contract, int $productId, float $qty, float $price, int $warehouseId): void
    {
        RentalContractItem::create([
            'contract_id'     => $contract->id,
            'product_id'      => $productId,
            'quantity'        => $qty,
            'price_per_cycle' => $price,
        ]);

        WarehouseStock::where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->decrement('quantity', $qty);
    }

    private function addReturn(RentalContract $contract, int $productId, float $qty, Carbon $date): void
    {
        RentalReturn::create([
            'contract_id'       => $contract->id,
            'product_id'        => $productId,
            'returned_quantity'  => $qty,
            'return_date'        => $date->toDateString(),
        ]);
    }

    private function generatePaidInvoice(RentalContract $contract, float $total): void
    {
        $contract->load('items.product');

        $invoice = SalesInvoice::create([
            'customer_id'    => $contract->customer_id,
            'invoice_date'   => Carbon::now()->subDays(5),
            'due_date'       => Carbon::now()->addDays(2),
            'subtotal'       => $total,
            'tax_amount'     => 0,
            'discount_amount'=> 0,
            'total_amount'   => $total,
            'paid_amount'    => $total,
            'balance_amount' => 0,
            'status'         => 'paid',
            'payment_terms'  => 'Net 15',
            'type'           => 'service',
            'notes'          => 'Final invoice — Rental Contract: ' . $contract->contract_number,
            'created_by'     => $this->workspace,
        ]);

        foreach ($contract->items as $item) {
            $days = 88; // ~90 day contract - 2 days
            SalesInvoiceItem::create([
                'invoice_id'   => $invoice->id,
                'product_id'   => $item->product_id,
                'quantity'     => $item->quantity,
                'unit_price'   => $item->price_per_cycle,
                'total_amount' => round($item->quantity * $item->price_per_cycle * $days, 2),
            ]);
        }
    }
}
