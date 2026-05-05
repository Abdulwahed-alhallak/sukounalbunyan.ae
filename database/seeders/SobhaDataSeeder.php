<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Warehouse;
use Noble\Taskly\Models\Project;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\Rental\Models\RentalInstallment;
use Noble\Rental\Models\RentalReturn;
use Noble\Quotation\Models\SalesQuotation;
use Noble\Quotation\Models\SalesQuotationItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SobhaDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get Core Data
        $client = User::where('email', 'sobha@example.ae')->first();
        if (!$client) {
            $client = User::create([
                'name'     => 'شوبا للتطوير العقاري',
                'email'    => 'sobha@example.ae',
                'password' => bcrypt('password'),
                'type'     => 'client',
                'lang'     => 'ar',
            ]);
        }

        $warehouse = Warehouse::first() ?? Warehouse::create(['name' => 'Scaffolding Main Depot', 'created_by' => 1]);
        $creatorId = 1;
        $workspaceId = 1;

        // Clean existing Sobha data to avoid duplicates
        $oldProjects = Project::where('created_by', $creatorId)->where('name', 'like', 'مشروع شوبا%')->get();
        foreach($oldProjects as $p) {
            RentalContract::where('project_id', $p->id)->delete();
            DB::table('project_clients')->where('project_id', $p->id)->delete();
            $p->delete();
        }
        SalesQuotation::where('customer_id', $client->id)->delete();

        // 2. Create 5 Projects with different metadata
        $projectData = [
            'hartland' => [
                'name'            => 'مشروع شوبا هارتلاند - المرحلة الأولى',
                'status'          => 'Ongoing',
                'contact_name'    => 'أحمد خليل',
                'contact_phone'   => '+971 55 123 4001',
                'calendar_color'  => '#3b82f6',
                'start_date'      => Carbon::now()->subMonths(2),
                'created_by'      => $creatorId,
            ],
            'one' => [
                'name'            => 'مشروع شوبا ون - الأبراج السكنية',
                'status'          => 'Ongoing',
                'contact_name'    => 'خالد الرشيدي',
                'contact_phone'   => '+971 55 234 5002',
                'calendar_color'  => '#10b981',
                'start_date'      => Carbon::now()->subMonths(4),
                'created_by'      => $creatorId,
            ],
            'reserve' => [
                'name'            => 'مشروع شوبا ريزيرف - الوحدات التجارية',
                'status'          => 'Ongoing',
                'contact_name'    => 'محمد العمري',
                'contact_phone'   => '+971 55 345 6003',
                'calendar_color'  => '#f59e0b',
                'start_date'      => Carbon::now()->subMonths(1),
                'created_by'      => $creatorId,
            ],
            'civil' => [
                'name'            => 'مشروع شوبا سيفيل - المجمع الصناعي',
                'status'          => 'Ongoing',
                'contact_name'    => 'عبدالله المنصوري',
                'contact_phone'   => '+971 55 456 7004',
                'calendar_color'  => '#8b5cf6',
                'start_date'      => Carbon::now(),
                'created_by'      => $creatorId,
            ],
            'like' => [
                'name'            => 'مشروع شوبا لايك - الواجهة البحرية',
                'status'          => 'Ongoing',
                'contact_name'    => 'سالم الكعبي',
                'contact_phone'   => '+971 55 567 8005',
                'calendar_color'  => '#ef4444',
                'start_date'      => Carbon::now()->subDays(15),
                'created_by'      => $creatorId,
            ],
        ];

        $projects = [];
        foreach ($projectData as $key => $data) {
            $projects[$key] = Project::create($data);
            $projects[$key]->clients()->attach($client->id);
        }

        // --- SCENARIO 1: Hartland (Rental + Partial Returns) ---
        $contract1 = RentalContract::create([
            'contract_number' => 'RC-HART-001',
            'project_id'      => $projects['hartland']->id,
            'customer_id'     => $client->id,
            'warehouse_id'    => $warehouse->id,
            'start_date'      => Carbon::now()->subDays(45),
            'billing_cycle'   => 'monthly',
            'status'          => 'active',
            'created_by'      => $creatorId,
            'workspace'       => $workspaceId,
        ]);

        RentalContractItem::create([
            'contract_id'     => $contract1->id,
            'product_id'      => 1, // Steel Scaffolding Pipe
            'quantity'        => 500,
            'price_per_cycle' => 10.00,
        ]);

        RentalContractItem::create([
            'contract_id'     => $contract1->id,
            'product_id'      => 3, // Base Plate
            'quantity'        => 200,
            'price_per_cycle' => 2.50,
        ]);

        RentalReturn::create([
            'contract_id'       => $contract1->id,
            'product_id'        => 3,
            'returned_quantity' => 150,
            'return_date'       => Carbon::now()->subDays(10),
            'condition'         => 'good',
        ]);

        // --- SCENARIO 2: Sobha One (Overdue Installments) ---
        $contract2 = RentalContract::create([
            'contract_number' => 'RC-ONE-202',
            'project_id'      => $projects['one']->id,
            'customer_id'     => $client->id,
            'warehouse_id'    => $warehouse->id,
            'start_date'      => Carbon::now()->subMonths(3),
            'billing_cycle'   => 'monthly',
            'status'          => 'active',
            'created_by'      => $creatorId,
            'workspace'       => $workspaceId,
        ]);

        RentalInstallment::create([
            'contract_id' => $contract2->id,
            'amount'      => 5400.00,
            'due_date'    => Carbon::now()->subMonths(1),
            'status'      => 'unpaid',
            'notes'       => 'قسط متأخر - برج A',
            'created_by'  => $creatorId,
            'workspace'   => $workspaceId,
        ]);

        RentalInstallment::create([
            'contract_id' => $contract2->id,
            'amount'      => 5400.00,
            'due_date'    => Carbon::now()->addDays(5),
            'status'      => 'unpaid',
            'created_by'  => $creatorId,
            'workspace'   => $workspaceId,
        ]);

        // --- SCENARIO 3: Sobha Reserve (Quotation -> Sales) ---
        $quotation = SalesQuotation::create([
            'quotation_number'    => 'QT-RES-999',
            'customer_id'         => $client->id,
            'warehouse_id'        => $warehouse->id,
            'quotation_date'      => Carbon::now()->subDays(20),
            'due_date'            => Carbon::now()->addDays(10),
            'status'              => 'accepted',
            'subtotal'            => 12500.00,
            'total_amount'        => 12500.00,
            'converted_to_invoice' => true,
            'created_by'          => $creatorId,
        ]);

        SalesQuotationItem::create([
            'quotation_id' => $quotation->id,
            'product_id'   => 15, // Heavy Duty Scaffolding
            'quantity'     => 10,
            'unit_price'   => 1250.00,
            'total_amount' => 12500.00,
        ]);

        // --- SCENARIO 4: Sobha Civil (Large Rental + Security Check) ---
        RentalContract::create([
            'contract_number'        => 'RC-CIV-777',
            'project_id'             => $projects['civil']->id,
            'customer_id'            => $client->id,
            'warehouse_id'           => $warehouse->id,
            'start_date'             => Carbon::now(),
            'billing_cycle'          => 'monthly',
            'status'                 => 'active',
            'security_deposit_check' => 'CHQ-MSHRQ-5566',
            'security_deposit_amount'=> 50000.00,
            'security_deposit_notes' => 'شيك ضمان مسترد عند نهاية المشروع - بنك المشرق فرع دبي',
            'created_by'             => $creatorId,
            'workspace'              => $workspaceId,
        ]);

        // --- SCENARIO 5: Sobha Like (Ready for Consolidated Billing) ---
        RentalContract::create([
            'contract_number' => 'RC-LIKE-A',
            'project_id'      => $projects['like']->id,
            'customer_id'     => $client->id,
            'warehouse_id'    => $warehouse->id,
            'start_date'      => Carbon::now()->subDays(10),
            'billing_cycle'   => 'daily',
            'status'          => 'active',
            'created_by'      => $creatorId,
            'workspace'       => $workspaceId,
        ]);

        RentalContract::create([
            'contract_number' => 'RC-LIKE-B',
            'project_id'      => $projects['like']->id,
            'customer_id'     => $client->id,
            'warehouse_id'    => $warehouse->id,
            'start_date'      => Carbon::now()->subDays(5),
            'billing_cycle'   => 'daily',
            'status'          => 'active',
            'created_by'      => $creatorId,
            'workspace'       => $workspaceId,
        ]);

        echo "✅ Sobha Multi-Scenario Data Seeded Successfully!\n";
    }
}
