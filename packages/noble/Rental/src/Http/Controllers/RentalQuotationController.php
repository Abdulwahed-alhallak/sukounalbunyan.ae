<?php

namespace Noble\Rental\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Noble\Quotation\Models\SalesQuotation;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\ProductService\Models\WarehouseStock;
use Carbon\Carbon;

class RentalQuotationController extends Controller
{
    /**
     * Convert an approved quotation into a Rental Contract + Sales Invoice.
     * The quotation items drive the contract: rent items → RentalContractItem,
     * sell/service items → SalesInvoiceItem attached to the generated invoice.
     */
    public function convertToRentalContract(Request $request, SalesQuotation $quotation)
    {
        if ($quotation->converted_to_rental) {
            return back()->with('error', __('This quotation has already been converted to a rental contract.'));
        }

        if (!in_array($quotation->status, ['approved', 'accepted', 'sent'])) {
            return back()->with('error', __('Only approved or accepted quotations can be converted.'));
        }

        $request->validate([
            'start_date'     => 'required|date',
            'billing_cycle'  => 'required|in:daily,weekly,monthly',
            'rental_project_id' => 'nullable|exists:rental_projects,id',
            'warehouse_id'   => 'nullable|exists:warehouses,id',
        ]);

        $quotation->load('items.product');

        DB::transaction(function () use ($quotation, $request) {
            // 1. Create the Rental Contract
            $contract = RentalContract::create([
                'customer_id'       => $quotation->customer_id,
                'warehouse_id'      => $request->warehouse_id ?? $quotation->warehouse_id,
                'rental_project_id' => $request->rental_project_id,
                'quotation_id'      => $quotation->id,
                'start_date'        => Carbon::parse($request->start_date),
                'billing_cycle'     => $request->billing_cycle,
                'status'            => 'draft',
                'payment_status'    => 'unpaid',
                'notes'             => $quotation->notes,
                'terms'             => $quotation->payment_terms,
                'created_by'        => Auth::id(),
                'workspace'         => creatorId(),
            ]);

            // 2. Process quotation items by line_type
            $saleItems = [];

            foreach ($quotation->items as $item) {
                $lineType = $item->line_type ?? 'rent';

                if ($lineType === 'rent') {
                    // Add to rental contract items
                    RentalContractItem::create([
                        'contract_id'    => $contract->id,
                        'product_id'     => $item->product_id,
                        'quantity'       => $item->quantity,
                        'price_per_cycle'=> $item->daily_rate ?? $item->unit_price,
                        'created_by'     => Auth::id(),
                    ]);

                    // Deduct from warehouse stock
                    if ($contract->warehouse_id) {
                        WarehouseStock::where('product_id', $item->product_id)
                            ->where('warehouse_id', $contract->warehouse_id)
                            ->decrement('quantity', $item->quantity);
                    }
                } else {
                    // sell or service — collect for invoice
                    $saleItems[] = $item;
                }
            }

            // 3. If there are sell/service items, create a sales invoice immediately
            if (!empty($saleItems)) {
                $invoiceSubtotal = collect($saleItems)->sum(fn($i) => $i->quantity * $i->unit_price);
                $invoice = \App\Models\SalesInvoice::create([
                    'customer_id'        => $quotation->customer_id,
                    'invoice_date'       => now(),
                    'due_date'           => now()->addDays(30),
                    'subtotal'           => $invoiceSubtotal,
                    'tax_amount'         => 0,
                    'discount_amount'    => 0,
                    'total_amount'       => $invoiceSubtotal,
                    'balance_amount'     => $invoiceSubtotal,
                    'status'             => 'posted',
                    'type'               => 'service',
                    'notes'              => __('From Quotation: :num', ['num' => $quotation->quotation_number]),
                    'rental_contract_id' => $contract->id,
                    'created_by'         => Auth::id(),
                ]);

                foreach ($saleItems as $item) {
                    \App\Models\SalesInvoiceItem::create([
                        'invoice_id'   => $invoice->id,
                        'product_id'   => $item->product_id,
                        'description'  => $item->description ?? $item->product?->name ?? '—',
                        'quantity'     => $item->quantity,
                        'unit_price'   => $item->unit_price,
                        'total_amount' => $item->quantity * $item->unit_price,
                        'created_by'   => Auth::id(),
                    ]);
                }
            }

            // 4. Mark quotation as converted
            $quotation->update([
                'converted_to_rental' => true,
                'status'              => 'converted',
            ]);

            // 5. Log creation event
            $contract->logEvent('created', [
                'from_quotation' => $quotation->quotation_number,
                'billing_cycle'  => $request->billing_cycle,
            ]);
        });

        return redirect()
            ->route('rental.index')
            ->with('success', __('Quotation converted to rental contract successfully.'));
    }
}
