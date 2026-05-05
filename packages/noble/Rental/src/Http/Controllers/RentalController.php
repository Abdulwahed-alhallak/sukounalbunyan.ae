<?php

namespace Noble\Rental\Http\Controllers;

use App\Http\Controllers\Controller;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\Rental\Models\RentalReturn;
use Noble\Rental\Services\RentalBillingService;
use Noble\ProductService\Models\ProductServiceItem;
use Noble\ProductService\Models\WarehouseStock;
use App\Models\User;
use App\Models\Warehouse;
use App\Models\SalesInvoice;
use App\Models\SalesInvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function create()
    {
        $customers  = User::where('type', 'client')->get(['id', 'name']);
        $products   = ProductServiceItem::where('created_by', creatorId())->get(['id', 'name', 'sale_price']);
        $warehouses = Warehouse::where('created_by', creatorId())->get(['id', 'name']);
        $projects   = \Noble\Taskly\Models\Project::where('created_by', creatorId())->get(['id', 'name', 'contact_name', 'contact_phone', 'calendar_color', 'status', 'start_date', 'end_date']);

        return Inertia::render('Rental/Create', [
            'customers'  => $customers,
            'projects'   => $projects,
            'products'   => $products,
            'warehouses' => $warehouses,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id'                => 'required',
            'project_id'                 => 'nullable',
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
            'customer_id'      => $request->customer_id,
            'project_id'       => $request->project_id,
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
        $contract->load(['customer', 'items.product', 'returns.product', 'warehouse', 'attachments.uploader', 'invoices', 'installments']);

        $accruedRent     = $this->billingService->calculateAccruedRent($contract);
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
            'contract'        => $contract,
            'accruedRent'     => $accruedRent,
            'currentDailyRate' => $currentDailyRate,
            'custodySummary'  => $custodySummary,
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
