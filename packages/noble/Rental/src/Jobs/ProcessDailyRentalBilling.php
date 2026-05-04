<?php

namespace Noble\Rental\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Noble\Rental\Models\RentalContract;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessDailyRentalBilling implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        Log::info('Starting ProcessDailyRentalBilling job...');

        $activeContracts = RentalContract::with(['items', 'customer', 'warehouse'])
            ->where('status', 'Active')
            ->get();

        $processedCount = 0;

        foreach ($activeContracts as $contract) {
            if ($this->shouldBill($contract)) {
                $this->generateInvoice($contract);
                $processedCount++;
            }
        }

        Log::info("ProcessDailyRentalBilling completed. Generated $processedCount invoices.");
    }

    protected function shouldBill(RentalContract $contract): bool
    {
        $lastBilledDate = $contract->last_billed_at ? Carbon::parse($contract->last_billed_at) : Carbon::parse($contract->start_date);
        $today = Carbon::today();

        if ($contract->billing_cycle === 'daily') {
            return $lastBilledDate->addDay()->isPast() || $lastBilledDate->addDay()->isToday();
        }

        if ($contract->billing_cycle === 'weekly') {
            return $lastBilledDate->addWeek()->isPast() || $lastBilledDate->addWeek()->isToday();
        }

        if ($contract->billing_cycle === 'monthly') {
            return $lastBilledDate->addMonth()->isPast() || $lastBilledDate->addMonth()->isToday();
        }

        return false;
    }

    protected function generateInvoice(RentalContract $contract)
    {
        DB::beginTransaction();

        try {
            $subtotal = 0;
            $taxAmount = 0;
            $invoiceItemsData = [];

            // Determine the multiplier based on the billing cycle
            $daysMultiplier = 1;
            if ($contract->billing_cycle === 'weekly') $daysMultiplier = 7;
            if ($contract->billing_cycle === 'monthly') $daysMultiplier = 30; // Approximation or exact days in month

            foreach ($contract->items as $item) {
                // Calculate line total: unit_price * quantity * cycle multiplier
                // e.g. If the unit price is per day, and cycle is weekly, it's 7 * daily_price
                // Wait, typically unit_price in rental items is already the price for the chosen cycle.
                // Assuming unit_price is per cycle:
                $lineSubtotal = $item->unit_price * $item->quantity;
                $lineTax = $lineSubtotal * ($item->tax_rate / 100);

                $subtotal += $lineSubtotal;
                $taxAmount += $lineTax;

                $invoiceItemsData[] = [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'tax_rate' => $item->tax_rate,
                    'tax_amount' => $lineTax,
                    'subtotal' => $lineSubtotal,
                    'total' => $lineSubtotal + $lineTax,
                    'description' => 'Rental cycle billing for ' . $contract->billing_cycle,
                    'workspace' => $contract->workspace,
                ];
            }

            $totalAmount = $subtotal + $taxAmount;

            $invoice = SalesInvoice::create([
                'invoice_date' => now()->toDateString(),
                'due_date' => now()->addDays(7)->toDateString(), // Due in 7 days
                'customer_id' => $contract->customer_id,
                'warehouse_id' => $contract->warehouse_id,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'paid_amount' => 0,
                'balance_amount' => $totalAmount,
                'status' => 'draft', // User requested draft or approved, we default to draft for safety
                'type' => 'invoice',
                'payment_terms' => '7 Days',
                'notes' => 'Automated rental billing for contract #' . $contract->contract_number,
                'rental_contract_id' => $contract->id,
                'creator_id' => $contract->created_by,
                'created_by' => $contract->created_by,
                'workspace' => $contract->workspace,
            ]);

            foreach ($invoiceItemsData as $itemData) {
                $itemData['invoice_id'] = $invoice->id;
                SalesInvoiceItem::create($itemData);
            }

            $contract->update([
                'last_billed_at' => now()->toDateString(),
                'total_invoiced' => $contract->total_invoiced + $totalAmount,
            ]);

            DB::commit();
            Log::info("Generated invoice {$invoice->invoice_number} for contract {$contract->contract_number}");

            // Optionally, we could dispatch an event here to notify via N8N.
            // event(new \Noble\Rental\Events\RentalInvoiceGenerated($invoice));

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to generate invoice for contract {$contract->contract_number}: " . $e->getMessage());
        }
    }
}
