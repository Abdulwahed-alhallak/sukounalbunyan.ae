<?php

namespace Noble\Rental\Observers;

use Noble\Rental\Models\RentalContract;
use Noble\ProductService\Models\WarehouseStock;
use App\Models\ProjectTask;
use App\Models\Project;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RentalContractObserver
{
    /**
     * Handle the RentalContract "updated" event.
     */
    public function updated(RentalContract $contract): void
    {
        // 1. If contract changed to Active (Started) -> Handle Inventory Out & Generate Delivery Task
        if ($contract->isDirty('status') && $contract->status === 'active') {
            
            DB::transaction(function () use ($contract) {
                // Generate Delivery & Installation Task if Project is linked
                if ($contract->project_id) {
                    ProjectTask::create([
                        'project_id' => $contract->project_id,
                        'title' => 'Delivery and Installation - ' . $contract->contract_number,
                        'description' => "Deliver equipment to {$contract->site_name}.\\nAddress: {$contract->site_address}\\nContact: {$contract->site_contact_person} - {$contract->site_contact_phone}",
                        'status' => 'pending',
                        'priority' => 'high',
                        'start_date' => $contract->start_date,
                        'start_date' => $contract->start_date,
                        'end_date' => $contract->start_date,
                        'created_by' => auth()->id() ?? $contract->created_by,
                    ]);
                }

                // Update Warehouse Inventory (Reduce quantity, increase rented_quantity)
                foreach ($contract->items as $item) {
                    $stock = WarehouseStock::where('product_id', $item->product_id)
                        ->where('warehouse_id', $contract->warehouse_id)
                        ->first();
                    
                    if ($stock) {
                        $stock->quantity -= $item->quantity;
                        $stock->rented_quantity += $item->quantity;
                        $stock->save();
                    }
                }
            });
        }

        // 2. If contract changed to Completed/Returned -> Handle Inventory In, Tasks & Final Accounting
        if ($contract->isDirty('status') && in_array($contract->status, ['completed', 'returned'])) {
            
            DB::transaction(function () use ($contract) {
                // Generate Pickup Task if Project is linked
                if ($contract->project_id) {
                    ProjectTask::create([
                        'project_id' => $contract->project_id,
                        'title' => 'Dismantle and Pickup - ' . $contract->contract_number,
                        'description' => "Pickup equipment from {$contract->site_name}.\\nAddress: {$contract->site_address}\\nContact: {$contract->site_contact_person} - {$contract->site_contact_phone}",
                        'status' => 'pending',
                        'priority' => 'high',
                        'start_date' => Carbon::now(),
                        'start_date' => Carbon::now(),
                        'end_date' => Carbon::now()->addDays(1),
                        'created_by' => auth()->id() ?? $contract->created_by,
                    ]);
                }

                // Restore Warehouse Inventory
                foreach ($contract->items as $item) {
                    $stock = WarehouseStock::where('product_id', $item->product_id)
                        ->where('warehouse_id', $contract->warehouse_id)
                        ->first();
                    
                    if ($stock) {
                        $stock->quantity += $item->quantity; // Restored to available
                        // Prevent rented_quantity from going negative
                        $stock->rented_quantity = max(0, $stock->rented_quantity - $item->quantity);
                        $stock->save();
                    }
                }

                // Smart Accounting: Settle Security Deposit and Generate Final Invoice if there is an unpaid balance
                $balanceDue = max(0, $contract->total_invoiced - $contract->paid_amount);
                
                // If there are damage fees, auto-deduct them from security deposit
                if ($contract->total_damage_fees > 0 && $contract->deposit_status === 'held') {
                    $deductible = min($contract->total_damage_fees, $contract->security_deposit);
                    $contract->deposit_settled_amount = $deductible;
                    $contract->deposit_status = 'settled';
                    $contract->saveQuietly();
                    
                    // Reduce balance due since damage was paid via deposit
                    $balanceDue = max(0, $balanceDue - $deductible);
                }

                // If still a positive balance, auto-generate Final Settlement Invoice
                if ($balanceDue > 0) {
                    $invoice = SalesInvoice::create([
                        'invoice_number' => SalesInvoice::generateInvoiceNumber(),
                        'customer_id' => $contract->customer_id,
                        'project_id' => $contract->project_id,
                        'rental_contract_id' => $contract->id,
                        'invoice_date' => Carbon::now()->toDateString(),
                        'due_date' => Carbon::now()->addDays(7)->toDateString(),
                        'status' => 'unpaid',
                        'subtotal' => $balanceDue,
                        'total_amount' => $balanceDue,
                        'balance_amount' => $balanceDue,
                        'created_by' => auth()->id() ?? $contract->created_by,
                    ]);

                    SalesInvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'product_id' => $contract->items->first()->product_id ?? 1,
                        'description' => 'Final Settlement Balance for Rental: ' . $contract->contract_number . ' - Unpaid balance and damage fees settlement',
                        'quantity' => 1,
                        'unit_price' => $balanceDue,
                        'total_amount' => $balanceDue,
                    ]);
                }
            });
        }
    }
}
