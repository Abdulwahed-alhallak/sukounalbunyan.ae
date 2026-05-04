<?php

namespace Noble\Rental\Services;

use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalReturn;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class RentalBillingService
{
    /**
     * Calculate the total rent accrued for a contract up to a specific date.
     * Logic: For each item, track the quantity over time and multiply by daily/monthly rate.
     */
    public function calculateAccruedRent(RentalContract $contract, $upToDate = null)
    {
        $upToDate = $upToDate ? Carbon::parse($upToDate) : Carbon::now();
        $totalAccrued = 0;

        foreach ($contract->items as $item) {
            $totalAccrued += $this->calculateItemRent($contract, $item, $upToDate);
        }

        // Subtract what has already been invoiced to get the current pending amount
        return max(0, $totalAccrued - (float)$contract->total_invoiced);
    }

    private function calculateItemRent($contract, $item, $upToDate)
    {
        $startDate = Carbon::parse($contract->start_date);
        $minDays = $contract->min_days ?: 0;
        
        $returns = $contract->returns()
            ->where('product_id', $item->product_id)
            ->orderBy('return_date', 'asc')
            ->get();

        $totalItemRent = 0;
        $totalReturned = 0;

        foreach ($returns as $return) {
            $returnDate = Carbon::parse($return->return_date);
            
            // If return is after the target date, it hasn't happened yet for this calculation
            // We treat the quantity as if it's still at site until upToDate
            if ($returnDate->gt($upToDate)) {
                continue; 
            }

            $days = $startDate->diffInDays($returnDate);
            $effectiveDays = max($minDays, $days);
            
            $totalItemRent += $this->calculateAmount($effectiveDays, $return->returned_quantity, $item->price_per_cycle, $contract->billing_cycle);
            $totalReturned += $return->returned_quantity;
        }

        $remainingQuantity = $item->quantity - $totalReturned;
        if ($remainingQuantity > 0) {
            $days = $startDate->diffInDays($upToDate);
            $effectiveDays = max($minDays, $days);
            $totalItemRent += $this->calculateAmount($effectiveDays, $remainingQuantity, $item->price_per_cycle, $contract->billing_cycle);
        }

        return $totalItemRent;
    }

    public function calculateAmount($days, $quantity, $rate, $cycle)
    {
        if ($cycle === 'daily') {
            return $days * $quantity * $rate;
        } elseif ($cycle === 'monthly') {
            // Basic monthly calculation (days / 30 * rate)
            return ($days / 30) * $quantity * $rate;
        }
        return 0;
    }

    /**
     * Calculate what the contract is costing PER DAY right now.
     */
    public function getCurrentDailyRate(RentalContract $contract)
    {
        $dailyRate = 0;
        foreach ($contract->items as $item) {
            $returned = $contract->returns()
                ->where('product_id', $item->product_id)
                ->sum('returned_quantity');
            
            $remaining = $item->quantity - $returned;
            
            if ($contract->billing_cycle === 'daily') {
                $dailyRate += $remaining * $item->price_per_cycle;
            } else {
                // Monthly rate / 30
                $dailyRate += ($remaining * $item->price_per_cycle) / 30;
            }
        }
        return $dailyRate;
    }

    /**
     * Generate an official sales invoice for a rental contract.
     */
    public function createInvoice(RentalContract $contract)
    {
        $contract->load(['items.product', 'customer']);
        
        $lastBilledAt = $contract->last_billed_at ? Carbon::parse($contract->last_billed_at) : Carbon::parse($contract->start_date);
        $now = Carbon::now();
        $minDays = $contract->min_days ?: 0;

        $invoiceItems = [];
        $totalSubtotal = 0;

        // 1. Calculate Rent for each item based on its presence at site during [lastBilledAt, now]
        foreach ($contract->items as $item) {
            $totalItemRentForPeriod = 0;
            
            // Get returns that happened AFTER lastBilledAt
            $returnsInPeriod = $contract->returns()
                ->where('product_id', $item->product_id)
                ->where('return_date', '>', $lastBilledAt)
                ->orderBy('return_date', 'asc')
                ->get();

            $totalReturnedPreviously = $contract->returns()
                ->where('product_id', $item->product_id)
                ->where('return_date', '<=', $lastBilledAt)
                ->sum('returned_quantity');

            $currentQuantityAtSite = $item->quantity - $totalReturnedPreviously;

            if ($currentQuantityAtSite <= 0) continue;

            $periodStart = $lastBilledAt;

            foreach ($returnsInPeriod as $return) {
                $returnDate = Carbon::parse($return->return_date);
                if ($returnDate->gt($now)) $returnDate = $now;

                $days = $periodStart->diffInDays($returnDate);
                // Note: We don't apply minDays here because minDays applies to the WHOLE duration from start_date, 
                // which is already handled in the initial setup of the contract.
                // However, for simplicity in periodic billing, we just bill for the days elapsed.
                
                $amount = $this->calculateAmount($days, $currentQuantityAtSite, $item->price_per_cycle, $contract->billing_cycle);
                $totalItemRentForPeriod += $amount;

                // Subtract returned quantity for the next segment of the period
                $currentQuantityAtSite -= $return->returned_quantity;
                $periodStart = $returnDate;

                if ($currentQuantityAtSite <= 0) break;
            }

            // Remaining quantity until 'now'
            if ($currentQuantityAtSite > 0) {
                $days = $periodStart->diffInDays($now);
                $amount = $this->calculateAmount($days, $currentQuantityAtSite, $item->price_per_cycle, $contract->billing_cycle);
                $totalItemRentForPeriod += $amount;
            }

            if ($totalItemRentForPeriod > 0) {
                $invoiceItems[] = [
                    'product_id'   => $item->product_id,
                    'description'  => __(':product (Rent) - Period: :from to :to', [
                        'product' => $item->product->name,
                        'from'    => $lastBilledAt->toDateString(),
                        'to'      => $now->toDateString()
                    ]),
                    'quantity'     => 1, // Unit price is the total rent for this item in this period
                    'unit_price'   => round($totalItemRentForPeriod, 2),
                    'total_amount' => round($totalItemRentForPeriod, 2),
                ];
                $totalSubtotal += $totalItemRentForPeriod;
            }
        }

        // 2. Damage Fees
        $pendingDamageFees = (float)$contract->total_damage_fees - (float)$contract->invoiced_damage_fees;
        if ($pendingDamageFees > 0) {
            $invoiceItems[] = [
                'description'  => __('Damage Fees / Material Loss Charges'),
                'quantity'     => 1,
                'unit_price'   => $pendingDamageFees,
                'total_amount' => $pendingDamageFees,
            ];
            $totalSubtotal += $pendingDamageFees;
        }

        if ($totalSubtotal <= 0) {
            return null;
        }

        // 3. Create Invoice
        $invoice = SalesInvoice::create([
            'customer_id'    => $contract->customer_id,
            'invoice_date'   => now(),
            'due_date'       => now()->addDays(7),
            'subtotal'       => round($totalSubtotal, 2),
            'tax_amount'     => 0,
            'discount_amount'=> 0,
            'total_amount'   => round($totalSubtotal, 2),
            'paid_amount'    => 0,
            'balance_amount' => round($totalSubtotal, 2),
            'status'         => 'posted',
            'type'           => 'service', // Rentals are treated as services in the ledger
            'notes'          => __('Generated from Rental Contract: ') . $contract->contract_number,
            'rental_contract_id' => $contract->id,
            'created_by'     => Auth::id() ?? $contract->created_by,
        ]);

        foreach ($invoiceItems as $itemData) {
            $itemData['invoice_id'] = $invoice->id;
            SalesInvoiceItem::create($itemData);
        }

        // 4. Update Contract
        $contract->update([
            'last_billed_at'       => $now,
            'total_invoiced'       => (float)$contract->total_invoiced + (float)$invoice->total_amount,
            'invoiced_damage_fees' => (float)$contract->total_damage_fees,
        ]);

        // 5. Trigger DoubleEntry Ledger Posting
        if (class_exists(\App\Events\PostSalesInvoice::class)) {
            \App\Events\PostSalesInvoice::dispatch($invoice);
        }

        return $invoice;
    }
}
