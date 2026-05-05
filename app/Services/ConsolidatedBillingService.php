<?php

namespace App\Services;

use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use App\Models\User;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ConsolidatedBillingService
{
    /**
     * Generate a single consolidated invoice for all projects of a customer.
     */
    public function generateForCustomer(int $customerId, Carbon $billingDate = null)
    {
        $billingDate = $billingDate ?? Carbon::now();
        $customer = User::findOrFail($customerId);

        // 1. Find all active rental contracts for this customer that are due for billing
        $contracts = RentalContract::where('customer_id', $customerId)
            ->where('status', 'active')
            ->with(['items', 'project'])
            ->get();

        if ($contracts->isEmpty()) {
            return null;
        }

        return DB::transaction(function () use ($customer, $contracts, $billingDate) {
            // 2. Initialize the Master Invoice
            $invoice = SalesInvoice::create([
                'invoice_date' => $billingDate,
                'due_date'     => $billingDate->copy()->addDays(15), // Default 15 days
                'customer_id'  => $customer->id,
                'warehouse_id' => $contracts->first()->warehouse_id ?? 1,
                'status'       => 'unpaid',
                'type'         => 'rental_consolidated',
                'created_by'   => $contracts->first()->created_by,
            ]);

            $totalSubtotal = 0;
            $totalTax = 0;

            foreach ($contracts as $contract) {
                // Calculate billing period (dummy logic for now, should use contract terms)
                $durationLabel = $this->calculateBillingPeriod($contract, $billingDate);

                foreach ($contract->items as $item) {
                    $itemTotal = $item->quantity * $item->price_per_cycle;
                    $productName = $item->product->name ?? 'Scaffolding Item';
                    
                    SalesInvoiceItem::create([
                        'invoice_id'         => $invoice->id,
                        'project_id'         => $contract->project_id,
                        'rental_contract_id' => $contract->id,
                        'product_id'         => $item->product_id,
                        'description'        => "Rental: " . ($contract->project->name ?? 'Project') . " - {$productName} ({$durationLabel})",
                        'quantity'           => $item->quantity,
                        'unit_price'         => $item->price_per_cycle,
                        'tax_percentage'     => 15, // Standard VAT
                        'created_by'         => $invoice->created_by,
                    ]);

                    $totalSubtotal += $itemTotal;
                }
                
                // Update contract last billed at
                $contract->update(['last_billed_at' => $billingDate]);
            }

            // 3. Update Invoice totals
            $totalTax = ($totalSubtotal * 15) / 100;
            $invoice->update([
                'subtotal'       => $totalSubtotal,
                'tax_amount'     => $totalTax,
                'total_amount'   => $totalSubtotal + $totalTax,
                'balance_amount' => $totalSubtotal + $totalTax,
            ]);

            return $invoice;
        });
    }

    private function calculateBillingPeriod(RentalContract $contract, Carbon $billingDate)
    {
        $start = $contract->last_billed_at ?? $contract->start_date;
        return $start->format('d/m/Y') . " to " . $billingDate->format('d/m/Y');
    }
}
