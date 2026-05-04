<?php

namespace Noble\Rental\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Noble\Rental\Models\RentalInstallment;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessRentalInstallments implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        Log::info('Starting ProcessRentalInstallments job...');

        $dueInstallments = RentalInstallment::with(['contract.customer', 'contract.warehouse'])
            ->where('status', 'pending')
            ->where('due_date', '<=', Carbon::today())
            ->get();

        $processedCount = 0;

        foreach ($dueInstallments as $installment) {
            $this->generateInstallmentInvoice($installment);
            $processedCount++;
        }

        Log::info("ProcessRentalInstallments completed. Generated $processedCount invoices for due installments.");
    }

    protected function generateInstallmentInvoice(RentalInstallment $installment)
    {
        $contract = $installment->contract;

        if (!$contract) {
            Log::warning("Installment {$installment->id} has no valid contract.");
            return;
        }

        DB::beginTransaction();

        try {
            $totalAmount = $installment->amount;

            $invoice = SalesInvoice::create([
                'invoice_date' => now()->toDateString(),
                'due_date' => $installment->due_date->toDateString(),
                'customer_id' => $contract->customer_id,
                'warehouse_id' => $contract->warehouse_id,
                'subtotal' => $totalAmount,
                'tax_amount' => 0, // Assuming installments are inclusive or tax is handled differently
                'discount_amount' => 0,
                'total_amount' => $totalAmount,
                'paid_amount' => 0,
                'balance_amount' => $totalAmount,
                'status' => 'draft',
                'type' => 'invoice',
                'payment_terms' => 'Due on Receipt',
                'notes' => 'Automated installment billing for rental contract #' . $contract->contract_number,
                'rental_contract_id' => $contract->id,
                'creator_id' => $contract->created_by,
                'created_by' => $contract->created_by,
                'workspace' => $contract->workspace,
            ]);

            SalesInvoiceItem::create([
                'invoice_id' => $invoice->id,
                'product_id' => null, // Generic line item
                'quantity' => 1,
                'unit_price' => $totalAmount,
                'tax_rate' => 0,
                'tax_amount' => 0,
                'subtotal' => $totalAmount,
                'total' => $totalAmount,
                'description' => 'Installment payment due for ' . $installment->due_date->format('Y-m-d'),
                'workspace' => $contract->workspace,
            ]);

            // Mark installment as invoiced
            $installment->update([
                'status' => 'invoiced',
                'invoice_id' => $invoice->id,
            ]);

            // Update contract invoiced total
            $contract->update([
                'total_invoiced' => $contract->total_invoiced + $totalAmount,
            ]);

            DB::commit();
            Log::info("Generated invoice {$invoice->invoice_number} for installment {$installment->id}");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to generate invoice for installment {$installment->id}: " . $e->getMessage());
        }
    }
}
