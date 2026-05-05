<?php

namespace Noble\Rental\Http\Controllers;

use App\Http\Controllers\Controller;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\Rental\Models\RentalReturn;
use Noble\Rental\Models\RentalAddon;
use Noble\Rental\Models\RentalContractEvent;
use Noble\Rental\Services\RentalBillingService;
use Noble\ProductService\Models\ProductServiceItem;
use Noble\ProductService\Models\WarehouseStock;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class RentalController extends Controller
{
    protected $billingService;

    public function __construct(RentalBillingService $billingService)
    {
        $this->billingService = $billingService;
    }

    public function index(Request $request)
    {
        // TenantBound scope already handles workspace isolation — no manual where needed
        $query = RentalContract::with(['customer', 'items.product']);

        if ($request->search) {
            $query->where('contract_number', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $contracts = $query->latest()->paginate(10)->withQueryString();

        $contracts->getCollection()->transform(function ($contract) {
            $contract->accrued_rent = $this->billingService->calculateAccruedRent($contract);
            return $contract;
        });

        // Summary stats
        $stats = [
            'total'             => RentalContract::count(),
            'active'            => RentalContract::where('status', 'active')->count(),
            'closed'            => RentalContract::where('status', 'closed')->count(),
            'total_deposits'    => RentalContract::where('status', 'active')->sum('security_deposit'),
            'total_accrued'     => RentalContract::where('status', 'active')->get()->sum(fn($c) => $this->billingService->calculateAccruedRent($c)),
            'total_balance_due' => RentalContract::get()->sum(fn($c) => $c->balance_due),
            'total_damage_fees' => RentalContract::sum('total_damage_fees'),
            'expiring_soon'     => RentalContract::where('status', 'active')->where('end_date', '<=', now()->addDays(7))->count(),
        ];

        return Inertia::render('Rental/Index', [
            'contracts' => $contracts,
            'filters'   => $request->only(['search', 'status']),
            'stats'     => $stats,
        ]);
    }

    public function create(Request $request)
    {
        $customers  = User::where('type', 'client')
            ->where('created_by', creatorId())
            ->get(['id', 'name', 'color']);
        $products   = ProductServiceItem::where('created_by', creatorId())->get(['id', 'name', 'sale_price']);
        $warehouses = Warehouse::where('created_by', creatorId())->get(['id', 'name']);

        // Use new RentalProject model — filter by customer if provided
        $projectsQuery = \Noble\Rental\Models\RentalProject::where('created_by', creatorId())
            ->where('status', 'active')
            ->with('customer:id,name,color')
            ->orderBy('name');

        if ($request->filled('customer_id')) {
            $projectsQuery->where('customer_id', $request->customer_id);
        }

        $rentalProjects = $projectsQuery->get(['id', 'name', 'code', 'color', 'customer_id', 'site_name', 'site_address', 'site_contact_person', 'site_contact_phone']);

        return Inertia::render('Rental/Create', [
            'customers'      => $customers,
            'rentalProjects' => $rentalProjects,
            'products'       => $products,
            'warehouses'     => $warehouses,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id'                => 'required',
            'rental_project_id'          => 'nullable|exists:rental_projects,id',
            'start_date'                 => 'required|date',
            'billing_cycle'              => 'required|in:daily,monthly',
            'items'                      => 'required|array|min:1',
            'items.*.product_id'         => 'required',
            'items.*.quantity'           => 'required|numeric|min:0.01',
            'items.*.price_per_cycle'    => 'required|numeric|min:0',
            'payment_method'             => 'required|string|in:cash,on_credit,installments',
            'site_name'                  => 'nullable|string',
            'site_address'               => 'nullable|string',
            'site_contact_person'        => 'nullable|string',
            'site_contact_phone'         => 'nullable|string',
            'delivery_fee'               => 'nullable|numeric|min:0',
            'pickup_fee'                 => 'nullable|numeric|min:0',
            'installments'               => 'required_if:payment_method,installments|array',
            'installments.*.amount'      => 'required_with:installments|numeric|min:0.01',
            'installments.*.due_date'    => 'required_with:installments|date',
            'security_deposit_check'     => 'nullable|string|max:100',
            'security_deposit_amount'    => 'nullable|numeric|min:0',
            'security_deposit_notes'     => 'nullable|string',
        ]);

        $contract = RentalContract::create([
            'customer_id'         => $request->customer_id,
            'rental_project_id'   => $request->rental_project_id ?: null,
            'warehouse_id'     => $request->warehouse_id ?? 1,
            'start_date'       => $request->start_date,
            'billing_cycle'    => $request->billing_cycle,
            'min_days'         => $request->min_days ?? 0,
            'security_deposit' => $request->security_deposit ?? 0,
            'notes'            => $request->notes,
            'status'           => $request->status ?? 'active',
            'payment_method'   => $request->payment_method ?? 'cash',
            'site_name'        => $request->site_name,
            'site_address'     => $request->site_address,
            'site_contact_person' => $request->site_contact_person,
            'site_contact_phone'  => $request->site_contact_phone,
            'delivery_fee'     => $request->delivery_fee ?? 0,
            'pickup_fee'       => $request->pickup_fee ?? 0,
            'security_deposit_check'  => $request->security_deposit_check,
            'security_deposit_amount' => $request->security_deposit_amount ?? 0,
            'security_deposit_notes'  => $request->security_deposit_notes,
            'created_by'       => Auth::id(),
            'workspace'        => creatorId(),
        ]);

        foreach ($request->items as $item) {
            $contract->items()->create([
                'product_id'       => $item['product_id'],
                'quantity'         => $item['quantity'],
                'price_per_cycle'  => $item['price_per_cycle'],
            ]);
        }

        if ($request->payment_method === 'installments' && $request->has('installments')) {
            foreach ($request->installments as $inst) {
                $contract->installments()->create([
                    'amount'     => $inst['amount'],
                    'due_date'   => $inst['due_date'],
                    'status'     => 'pending',
                    'workspace'  => creatorId(),
                    'created_by' => Auth::id(),
                ]);
            }
        }

        if ($request->attachments) {
            $contract->syncAttachments($request->attachments);
        }

        if ($contract->status === 'active') {
            $this->deductStock($contract);
        }

        return redirect()->route('rental.index')->with('success', __('Rental contract created successfully.'));
    }

    private function deductStock(RentalContract $contract)
    {
        foreach ($contract->items as $item) {
            WarehouseStock::where('product_id', $item->product_id)
                ->where('warehouse_id', $contract->warehouse_id)
                ->decrement('quantity', $item->quantity);
        }
    }


    public function edit(RentalContract $contract)
    {
        $contract->load(['customer', 'items.product', 'project']);
        $projects = \Noble\Taskly\Models\Project::where('created_by', creatorId())->get(['id', 'name', 'contact_name', 'contact_phone', 'calendar_color', 'status']);
        
        return Inertia::render('Rental/Edit', [
            'contract' => $contract,
            'projects' => $projects,
        ]);
    }

    public function update(Request $request, RentalContract $contract)
    {
        $request->validate([
            'notes'            => 'nullable|string',
            'project_id'       => 'nullable',
            'security_deposit' => 'nullable|numeric|min:0',
            'min_days'         => 'nullable|numeric|min:0',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'attachments'      => 'nullable|array',
            'payment_method'   => 'nullable|string|in:cash,on_credit,installments',
            'site_name'        => 'nullable|string',
            'site_address'     => 'nullable|string',
            'site_contact_person' => 'nullable|string',
            'site_contact_phone'  => 'nullable|string',
            'delivery_fee'     => 'nullable|numeric|min:0',
            'pickup_fee'       => 'nullable|numeric|min:0',
            'installments'     => 'required_if:payment_method,installments|array',
        ]);

        $contract->update($request->only([
            'notes', 'terms', 'security_deposit', 'min_days', 'end_date', 'project_id',
            'payment_method', 'site_name', 'site_address', 'site_contact_person',
            'site_contact_phone', 'delivery_fee', 'pickup_fee', 'logistics_status',
            'security_deposit_check', 'security_deposit_amount', 'security_deposit_notes'
        ]));

        if ($request->payment_method === 'installments' && $request->has('installments')) {
            // Drop existing pending installments and recreate
            $contract->installments()->where('status', 'pending')->delete();
            foreach ($request->installments as $inst) {
                // If it has an id, it means it's an existing one, but to keep it simple, we recreate the pending ones
                if (!isset($inst['id'])) {
                    $contract->installments()->create([
                        'amount'     => $inst['amount'],
                        'due_date'   => $inst['due_date'],
                        'status'     => 'pending',
                        'workspace'  => creatorId(),
                        'created_by' => Auth::id(),
                    ]);
                }
            }
        }

        if ($request->has('attachments')) {
            $contract->syncAttachments($request->attachments);
        }

        return redirect()->route('rental.show', $contract->id)->with('success', __('Contract updated successfully.'));
    }

    public function show(RentalContract $contract)
    {
        $contract->load([
            'customer',
            'items.product',
            'returns.product',
            'warehouse',
            'attachments.uploader',
            'invoices',
            'installments.invoice',
            'rentalProject',
            'addons.product',
            'events' => fn($q) => $q->with('createdByUser:id,name')->orderBy('occurred_at', 'desc'),
        ]);

        $accruedRent      = $this->billingService->calculateAccruedRent($contract);
        $currentDailyRate = $this->billingService->getCurrentDailyRate($contract);

        // Per-item custody summary for the Show page
        $custodySummary = $contract->items->map(function ($item) use ($contract) {
            $returned = $contract->returns
                ->where('product_id', $item->product_id)
                ->sum('returned_quantity');
            return [
                'id'              => $item->id,
                'product_id'      => $item->product_id,
                'product_name'    => $item->product->name ?? '—',
                'original_qty'    => $item->quantity,
                'returned_qty'    => $returned,
                'remaining_qty'   => $item->quantity - $returned,
                'price_per_cycle' => $item->price_per_cycle,
            ];
        });

        return Inertia::render('Rental/Show', [
            'contract'         => $contract,
            'accruedRent'      => $accruedRent,
            'currentDailyRate' => $currentDailyRate,
            'custodySummary'   => $custodySummary,
        ]);
    }


    public function returnItems(Request $request, RentalContract $contract)
    {
        $request->validate([
            'product_id'        => 'required',
            'returned_quantity'  => 'required|numeric|min:0.01',
            'return_date'        => 'required|date',
            'damage_fee'         => 'nullable|numeric|min:0',
            'damage_notes'       => 'nullable|string',
        ]);

        // Guard: cannot return more than what's in custody
        $item = $contract->items()->where('product_id', $request->product_id)->first();
        if ($item) {
            $alreadyReturned = $contract->returns()
                ->where('product_id', $request->product_id)
                ->sum('returned_quantity');
            $remaining = $item->quantity - $alreadyReturned;
            if ($request->returned_quantity > $remaining) {
                return back()->with('error', __('Return quantity exceeds remaining custody quantity (:qty).', ['qty' => $remaining]));
            }
        }

        $contract->returns()->create([
            'product_id'        => $request->product_id,
            'returned_quantity'  => $request->returned_quantity,
            'condition'          => $request->condition ?? 'good',
            'return_date'        => $request->return_date,
            'damage_fee'         => $request->damage_fee ?? 0,
            'damage_notes'       => $request->damage_notes,
        ]);

        if ($request->damage_fee > 0) {
            $contract->increment('total_damage_fees', $request->damage_fee);
        }

        // Restore warehouse stock ONLY if condition is 'good'
        if (($request->condition ?? 'good') === 'good') {
            WarehouseStock::where('product_id', $request->product_id)
                ->where('warehouse_id', $contract->warehouse_id)
                ->increment('quantity', $request->returned_quantity);
        }

        // Auto-close contract if all items fully returned
        $allReturned = $contract->items->every(function ($item) use ($contract) {
            $returned = $contract->returns()->where('product_id', $item->product_id)->sum('returned_quantity');
            return $returned >= $item->quantity;
        });

        if ($allReturned) {
            $contract->update(['status' => 'closed']);
            return back()->with('success', __('All materials returned. Contract has been closed.'));
        }

        return back()->with('success', __('Items returned successfully. Rent calculation updated.'));
    }

    public function returnAllItems(Request $request, RentalContract $contract)
    {
        $contract->load('items');

        foreach ($contract->items as $item) {
            $alreadyReturned = $contract->returns()
                ->where('product_id', $item->product_id)
                ->sum('returned_quantity');
            $remaining = $item->quantity - $alreadyReturned;

            if ($remaining > 0) {
                $contract->returns()->create([
                    'product_id'        => $item->product_id,
                    'returned_quantity' => $remaining,
                    'return_date'       => now(),
                ]);

                // Restore warehouse stock
                WarehouseStock::where('product_id', $item->product_id)
                    ->where('warehouse_id', $contract->warehouse_id)
                    ->increment('quantity', $remaining);
            }
        }

        $contract->update(['status' => 'closed']);
        return back()->with('success', __('All remaining items returned successfully. Contract closed.'));
    }

    /**
     * Renew (extend) a contract by resetting the billing clock.
     */
    public function renew(Request $request, RentalContract $contract)
    {
        $request->validate([
            'new_end_date' => 'nullable|date|after:today',
        ]);

        $contract->update([
            'status'         => 'active',
            'last_billed_at' => now(),
            'end_date'       => $request->new_end_date ?? null,
        ]);

        return back()->with('success', __('Contract renewed successfully. Billing cycle reset.'));
    }

    /**
     * Record a payment against a rental contract.
     */
    public function recordPayment(Request $request, RentalContract $contract)
    {
        $request->validate([
            'amount'       => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'notes'        => 'nullable|string',
        ]);

        $newPaid = (float)$contract->paid_amount + (float)$request->amount;
        $total   = (float)$contract->total_invoiced;

        $paymentStatus = 'unpaid';
        if ($total > 0 && $newPaid >= $total) {
            $paymentStatus = 'paid';
        } elseif ($newPaid > 0) {
            $paymentStatus = 'partial';
        }

        $contract->update([
            'paid_amount'    => $newPaid,
            'payment_status' => $paymentStatus,
        ]);

        return back()->with('success', __('Payment of :amount recorded. Balance: :balance', [
            'amount'  => number_format($request->amount, 2),
            'balance' => number_format(max(0, $total - $newPaid), 2),
        ]));
    }

    public function activate(RentalContract $contract)
    {
        if ($contract->status !== 'draft') {
            return back()->with('error', __('Only draft contracts can be activated.'));
        }

        $contract->update(['status' => 'active']);
        $this->deductStock($contract);

        return back()->with('success', __('Contract activated and inventory deducted.'));
    }

    /**
     * Settle the security deposit (Refund or Apply to Balance).
     */
    public function settleDeposit(RentalContract $contract, Request $request)
    {
        $request->validate([
            'status' => 'required|in:refunded,applied',
            'amount' => 'required|numeric|min:0',
            'notes'  => 'nullable|string',
        ]);

        if ($contract->deposit_status !== 'held') {
            return back()->with('error', __('Deposit has already been settled.'));
        }

        if ($request->status === 'applied') {
            // If applied to balance, increase paid_amount
            $contract->paid_amount += (float)$request->amount;
        }

        $contract->update([
            'deposit_status'         => $request->status,
            'deposit_settled_amount' => $request->amount,
            'deposit_notes'          => $request->notes,
        ]);

        return back()->with('success', __('Security deposit settled successfully.'));
    }

    /**
     * Manually close a contract.
     */
    public function close(RentalContract $contract)
    {
        $contract->update(['status' => 'closed']);
        return back()->with('success', __('Rental contract closed.'));
    }

    /**
     * Generate a proper sales invoice with one line per material.
     */
    public function convertToInvoice(RentalContract $contract)
    {
        $invoice = $this->billingService->createInvoice($contract);

        if (!$invoice) {
            return back()->with('error', __('Nothing to invoice (Rent: 0, Damage Fees: 0).'));
        }

        return redirect()->route('sales-invoices.show', $invoice->id)
            ->with('success', __('Invoice generated from rental contract. Balance updated.'));
    }

    /**
     * Generate a sales invoice for a specific installment.
     */
    public function invoiceInstallment(RentalContract $rental, \Noble\Rental\Models\RentalInstallment $installment)
    {
        if ($installment->contract_id !== $rental->id) {
            return back()->with('error', __('Installment does not belong to this contract.'));
        }

        if ($installment->status !== 'pending') {
            return back()->with('error', __('This installment has already been invoiced.'));
        }

        $invoice = \App\Models\SalesInvoice::create([
            'customer_id'        => $rental->customer_id,
            'invoice_date'       => now(),
            'due_date'           => $installment->due_date,
            'subtotal'           => $installment->amount,
            'tax_amount'         => 0,
            'discount_amount'    => 0,
            'total_amount'       => $installment->amount,
            'paid_amount'        => 0,
            'balance_amount'     => $installment->amount,
            'status'             => 'posted',
            'type'               => 'service',
            'notes'              => __('Installment invoice for Rental Contract: ') . $rental->contract_number,
            'rental_contract_id' => $rental->id,
            'created_by'         => Auth::id() ?? $rental->created_by,
        ]);

        \App\Models\SalesInvoiceItem::create([
            'invoice_id'   => $invoice->id,
            'description'  => __('Rental Installment — :contract (Due: :date)', [
                'contract' => $rental->contract_number,
                'date'     => $installment->due_date->format('Y-m-d'),
            ]),
            'quantity'     => 1,
            'unit_price'   => $installment->amount,
            'total_amount' => $installment->amount,
            'created_by'   => Auth::id() ?? $rental->created_by,
        ]);

        $installment->update([
            'status'     => 'invoiced',
            'invoice_id' => $invoice->id,
        ]);

        return redirect()->route('sales-invoices.show', $invoice->id)
            ->with('success', __('Invoice generated for installment. Redirect to invoice.'));
    }

    /**
     * Add extra materials to a running contract (billing from effective_date).
     */
    public function addMaterials(Request $request, RentalContract $contract)
    {
        if ($contract->status !== 'active') {
            return back()->with('error', __('Cannot add materials to a non-active contract.'));
        }

        $request->validate([
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|integer',
            'items.*.quantity'       => 'required|numeric|min:0.01',
            'items.*.price_per_cycle'=> 'required|numeric|min:0',
            'effective_date'         => 'required|date|after_or_equal:' . $contract->start_date->format('Y-m-d'),
            'notes'                  => 'nullable|string|max:500',
        ]);

        $effectiveDate = Carbon::parse($request->effective_date);
        $addedItems = [];

        DB::transaction(function () use ($request, $contract, $effectiveDate, &$addedItems) {
            foreach ($request->items as $item) {
                $addon = RentalAddon::create([
                    'contract_id'     => $contract->id,
                    'product_id'      => $item['product_id'],
                    'quantity'        => $item['quantity'],
                    'price_per_cycle' => $item['price_per_cycle'],
                    'effective_date'  => $effectiveDate,
                    'notes'           => $request->notes,
                    'status'          => 'approved',
                    'created_by'      => Auth::id(),
                ]);

                // Deduct from warehouse stock
                WarehouseStock::where('product_id', $item['product_id'])
                    ->where('warehouse_id', $contract->warehouse_id)
                    ->decrement('quantity', $item['quantity']);

                $addedItems[] = [
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                ];
            }

            // Log event
            $contract->logEvent('addon', [
                'items'          => $addedItems,
                'effective_date' => $effectiveDate->format('Y-m-d'),
                'notes'          => $request->notes,
            ]);
        });

        return back()->with('success', __('Materials added to contract from :date.', [
            'date' => $effectiveDate->format('d/m/Y'),
        ]));
    }

    /**
     * Convert a rental contract to a sale (Lease-to-Own).
     * Generates a final invoice: accrued rent + purchase price of items.
     */
    public function leaseToOwn(Request $request, RentalContract $contract)
    {
        if ($contract->status !== 'active') {
            return back()->with('error', __('Only active contracts can be converted to a sale.'));
        }

        $request->validate([
            'purchase_price' => 'required|numeric|min:0',
            'notes'          => 'nullable|string|max:1000',
            'conversion_date'=> 'nullable|date',
        ]);

        $conversionDate = $request->filled('conversion_date')
            ? Carbon::parse($request->conversion_date)
            : now();

        $purchasePrice  = (float) $request->purchase_price;
        $accruedRent    = $this->billingService->calculateAccruedRent($contract);
        $alreadyPaid    = (float) $contract->paid_amount;
        $alreadyInvoiced= (float) $contract->total_invoiced;

        $rentDue     = max(0, $accruedRent - $alreadyInvoiced);
        $totalDue    = $rentDue + $purchasePrice;

        DB::transaction(function () use ($contract, $conversionDate, $purchasePrice, $rentDue, $totalDue, $request) {
            // Build the final consolidated invoice
            $invoice = SalesInvoice::create([
                'customer_id'        => $contract->customer_id,
                'invoice_date'       => $conversionDate,
                'due_date'           => $conversionDate->copy()->addDays(15),
                'subtotal'           => round($totalDue, 2),
                'tax_amount'         => 0,
                'discount_amount'    => 0,
                'total_amount'       => round($totalDue, 2),
                'paid_amount'        => 0,
                'balance_amount'     => round($totalDue, 2),
                'status'             => 'posted',
                'type'               => 'service',
                'notes'              => __('Lease-to-Own Conversion — Contract: :num', ['num' => $contract->contract_number])
                    . ($request->notes ? "\n" . $request->notes : ''),
                'rental_contract_id' => $contract->id,
                'created_by'         => Auth::id(),
            ]);

            // Line 1: Accrued rent (if any outstanding)
            if ($rentDue > 0) {
                SalesInvoiceItem::create([
                    'invoice_id'   => $invoice->id,
                    'description'  => __('Rental Period — :from to :to', [
                        'from' => $contract->start_date->format('d/m/Y'),
                        'to'   => $conversionDate->format('d/m/Y'),
                    ]),
                    'quantity'     => 1,
                    'unit_price'   => round($rentDue, 2),
                    'total_amount' => round($rentDue, 2),
                    'created_by'   => Auth::id(),
                ]);
            }

            // Line 2: Purchase price of scaffolding
            SalesInvoiceItem::create([
                'invoice_id'   => $invoice->id,
                'description'  => __('Purchase of Scaffolding Materials — Contract: :num', ['num' => $contract->contract_number]),
                'quantity'     => 1,
                'unit_price'   => round($purchasePrice, 2),
                'total_amount' => round($purchasePrice, 2),
                'created_by'   => Auth::id(),
            ]);

            // Update contract
            $contract->update([
                'status'         => 'closed',
                'is_lease_to_own'=> true,
                'purchase_price' => $purchasePrice,
                'total_invoiced' => (float) $contract->total_invoiced + $rentDue,
                'last_billed_at' => $conversionDate,
            ]);

            // Log event
            $contract->logEvent('lease_to_own', [
                'purchase_price'  => $purchasePrice,
                'accrued_rent'    => $rentDue,
                'total_invoice'   => $totalDue,
                'invoice_id'      => $invoice->id,
                'conversion_date' => $conversionDate->format('Y-m-d'),
            ], $totalDue);

            // Don't return inventory — it's sold
        });

        return redirect()
            ->route('rental.show', $contract->id)
            ->with('success', __('Contract converted to sale. Final invoice generated.'));
    }

    public function createFromQuotation(Request $request, $quotationId)

    {
        $quotation = \Noble\Quotation\Models\SalesQuotation::with('items')->findOrFail($quotationId);

        $contract = RentalContract::create([
            'customer_id'   => $quotation->customer_id,
            'warehouse_id'  => $quotation->warehouse_id ?? 1,
            'start_date'    => now(),
            'billing_cycle' => $request->billing_cycle ?? 'daily',
            'status'        => 'active',
            'created_by'    => Auth::id(),
            'workspace'     => creatorId(),
            'notes'         => 'Converted from Quotation: ' . $quotation->quotation_number,
        ]);

        foreach ($quotation->items as $item) {
            $contract->items()->create([
                'product_id'      => $item->product_id,
                'quantity'        => $item->quantity,
                'price_per_cycle' => $item->unit_price,
            ]);

            WarehouseStock::where('product_id', $item->product_id)
                ->where('warehouse_id', $contract->warehouse_id)
                ->decrement('quantity', $item->quantity);
        }

        $quotation->update([
            'status'             => 'accepted',
            'converted_to_rental' => true,
        ]);

        return redirect()->route('rental.show', $contract->id)
            ->with('success', __('Quotation converted to rental contract successfully.'));
    }

    public function destroy(RentalContract $contract)
    {
        // Prevent deletion if there are financial records tied to it
        if ($contract->total_invoiced > 0 || $contract->paid_amount > 0) {
            return back()->with('error', __('Cannot delete a contract that has generated invoices or payments. Close it instead.'));
        }

        // Restore warehouse stock for any items that were checked out (Only if status was NOT draft)
        if ($contract->status !== 'draft') {
            foreach ($contract->items as $item) {
                WarehouseStock::where('product_id', $item->product_id)
                    ->where('warehouse_id', $contract->warehouse_id)
                    ->increment('quantity', $item->quantity);
            }
        }

        $contract->delete();

        return redirect()->route('rental.index')->with('success', __('Rental contract deleted successfully.'));
    }

    public function destroyAttachment($attachmentId)
    {
        $attachment = \Noble\Taskly\Models\TaskAttachment::findOrFail($attachmentId);
        $attachment->delete();
        return back()->with('success', __('Attachment deleted successfully.'));
    }

    public function scanQr(RentalContract $contract, $productId = null)
    {
        $contract->load(['customer', 'items.product']);
        
        return Inertia::render('Rental/ScanResult', [
            'contract' => $contract,
            'scanned_product_id' => $productId,
        ]);
    }

    public function processScan(Request $request)
    {
        $qrCode = $request->qr_code;

        // Case 1: Full URL
        if (filter_var($qrCode, FILTER_VALIDATE_URL)) {
            return redirect($qrCode);
        }

        // Case 2: Format CONTRACTID-PRODUCTID (e.g. 7-10)
        if (preg_match('/^(\d+)-(\d+)$/', $qrCode, $matches)) {
            return redirect()->route('rental.scan-qr', ['contract' => $matches[1], 'product' => $matches[2]]);
        }

        // Case 3: Just Contract Number or ID
        $contract = RentalContract::where('contract_number', $qrCode)->first();
        if ($contract) {
            return redirect()->route('rental.scan-qr', $contract->id);
        }

        return back()->with('error', __('Invalid QR code or contract not found.'));
    }

    public function downloadPdf(RentalContract $contract)
    {
        $contract->load(['customer', 'items.product', 'warehouse']);
        $contract->accrued_rent = $this->billingService->calculateAccruedRent($contract);
        
        $pdf = Pdf::loadView('rental::pdf.contract-pdf', [
            'contract' => $contract,
            'company'  => Auth::user()->companyDetail, // Assuming companyDetail trait exists on User
        ]);

        return $pdf->download("Rental_Contract_{$contract->contract_number}.pdf");
    }

    public function downloadReturnPdf(RentalReturn $rentalReturn)
    {
        $rentalReturn->load(['contract.customer', 'product']);
        
        $pdf = Pdf::loadView('rental::pdf.return-pdf', [
            'return'  => $rentalReturn,
            'company' => Auth::user()->companyDetail,
        ]);

        return $pdf->download("Return_Receipt_{$rentalReturn->id}.pdf");
    }

    public function printLabels(RentalContract $contract)
    {
        $contract->load(['items.product']);
        
        $pdf = Pdf::loadView('rental::pdf.labels-pdf', [
            'contract' => $contract,
        ])->setPaper([0, 0, 288, 432]); // Custom label size if needed, or default

        return $pdf->stream("Labels_{$contract->contract_number}.pdf");
    }

    public function downloadLogisticsPdf(RentalContract $contract)
    {
        $contract->load(['customer', 'items.product', 'warehouse']);
        
        $pdf = Pdf::loadView('rental::pdf.logistics-pdf', [
            'contract' => $contract,
            'company'  => Auth::user()->companyDetail,
        ]);

        return $pdf->download("Logistics_Note_{$contract->contract_number}.pdf");
    }
}
