<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

/** @psalm-suppress UndefinedClass */
use Noble\Account\Models\Invoice;
/** @psalm-suppress UndefinedClass */
use Noble\Account\Models\Bill;
/** @psalm-suppress UndefinedClass */
use Noble\Taskly\Models\Project;
/** @psalm-suppress UndefinedClass */
use Noble\Contract\Models\Contract;
/** @psalm-suppress UndefinedClass */
use Noble\Rental\Models\RentalContract;

/**
 * ClientPortalController
 *
 * Self-service portal for clients and vendors to:
 * - View their invoices/bills
 * - View project status
 * - View contracts
 * - Submit support tickets
 * - View payment history
 */
class ClientPortalController extends Controller
{
    /**
     * Portal dashboard — overview for client or vendor
     */
    public function dashboard()
    {
        $user = Auth::user();
        $companyId = $user->created_by;
        $type = $user->type; // 'client' or 'vendor'

        $data = [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'type' => $type,
                'company' => User::find($companyId)?->name ?? '',
            ],
            'stats' => [],
            'recentInvoices' => [],
            'recentPayments' => [],
        ];

        // Client-specific data
        if ($type === 'client') {
            $data = array_merge($data, $this->clientData($user, $companyId));
        }
        // Vendor-specific data
        elseif ($type === 'vendor') {
            $data = array_merge($data, $this->vendorData($user, $companyId));
        }

        return Inertia::render('portal/Dashboard', $data);
    }

    /**
     * Client invoices listing
     */
    public function invoices(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->created_by;

        $invoices = [];

        if ($user->type === 'client' && class_exists(\Noble\Account\Models\Invoice::class)) {
            $invoices = \Noble\Account\Models\Invoice::where('created_by', $companyId)
                ->where('customer_id', $user->id)
                ->when($request->status, fn($q, $s) => $q->where('status', $s))
                ->orderByDesc('invoice_date')
                ->paginate(15);
        } elseif ($user->type === 'vendor' && class_exists(\Noble\Account\Models\Bill::class)) {
            $invoices = \Noble\Account\Models\Bill::where('created_by', $companyId)
                ->where('vendor_id', $user->id)
                ->when($request->status, fn($q, $s) => $q->where('status', $s))
                ->orderByDesc('bill_date')
                ->paginate(15);
        }

        return Inertia::render('portal/Invoices', [
            'invoices' => $invoices,
            'type' => $user->type,
        ]);
    }

    /**
     * Portal projects view
     */
    public function projects()
    {
        $user = Auth::user();
        $companyId = $user->created_by;

        $projects = [];
        if (class_exists(\Noble\Taskly\Models\Project::class)) {
            $projects = \Noble\Taskly\Models\Project::where('created_by', $companyId)
                ->whereJsonContains('client_id', $user->id)
                ->withCount('tasks')
                ->orderByDesc('created_at')
                ->paginate(10);
        }

        return Inertia::render('portal/Projects', [
            'projects' => $projects,
        ]);
    }

    /**
     * Portal contracts
     */
    public function contracts()
    {
        $user = Auth::user();
        $companyId = $user->created_by;

        $contracts = [];
        if (class_exists(\Noble\Contract\Models\Contract::class)) {
            $contracts = \Noble\Contract\Models\Contract::where('created_by', $companyId)
                ->where('client_id', $user->id)
                ->orderByDesc('created_at')
                ->paginate(10);
        }

        return Inertia::render('portal/Contracts', [
            'contracts' => $contracts,
        ]);
    }

    // ══════════════════════════════════════
    // DATA ASSEMBLERS
    // ══════════════════════════════════════

    private function clientData(User $user, int $companyId): array
    {
        $data = ['stats' => []];

        // Invoices
        if (class_exists(\Noble\Account\Models\Invoice::class)) {
            $invoices = \Noble\Account\Models\Invoice::where('created_by', $companyId)
                ->where('customer_id', $user->id)
                ->get();

            $totalAmount = $invoices->sum('total');
            $paidAmount = $invoices->where('status', 'Paid')->sum('total');
            $unpaidCount = $invoices->whereNotIn('status', ['Paid'])->count();
            $overdueCount = $invoices->filter(fn($i) => $i->due_date && $i->due_date < now() && $i->status !== 'Paid')->count();

            $data['stats'] = [
                'total_invoices' => $invoices->count(),
                'total_amount' => (float) $totalAmount,
                'paid_amount' => (float) $paidAmount,
                'outstanding' => (float) ($totalAmount - $paidAmount),
                'unpaid_count' => $unpaidCount,
                'overdue_count' => $overdueCount,
            ];

            $data['recentInvoices'] = $invoices->sortByDesc('invoice_date')
                ->take(5)
                ->map(fn($i) => [
                    'id' => $i->id,
                    'number' => $i->invoice_id ?? "INV-{$i->id}",
                    'amount' => (float) $i->total,
                    'status' => $i->status,
                    'date' => optional($i->invoice_date)->format('M d, Y'),
                    'due_date' => optional($i->due_date)->format('M d, Y'),
                ])->values()->toArray();
        }

        // Projects
        if (class_exists(\Noble\Taskly\Models\Project::class)) {
            $data['stats']['active_projects'] = \Noble\Taskly\Models\Project::where('created_by', $companyId)
                ->whereJsonContains('client_id', $user->id)
                ->where('status', 'active')
                ->count();
        }

        // Contracts
        if (class_exists(\Noble\Contract\Models\Contract::class)) {
            $data['stats']['active_contracts'] = \Noble\Contract\Models\Contract::where('created_by', $companyId)
                ->where('client_id', $user->id)
                ->where('status', 'active')
                ->count();
        }

        // Rental Contracts & Assets (Scaffolding Specific)
        if (class_exists(\Noble\Rental\Models\RentalContract::class)) {
            $rentalContracts = \Noble\Rental\Models\RentalContract::where('customer_id', $user->id)
                ->where('status', 'active')
                ->with(['items'])
                ->get();

            $data['stats']['active_rental_contracts'] = $rentalContracts->count();
            $data['stats']['security_deposits_total'] = (float) $rentalContracts->sum('security_deposit_amount');
            
            // Calculate current scaffolding units on site (Quantity - Returned)
            $totalUnits = 0;
            foreach ($rentalContracts as $rc) {
                foreach ($rc->items as $item) {
                    $returnedCount = \Noble\Rental\Models\RentalReturn::where('contract_id', $rc->id)
                        ->where('product_id', $item->product_id)
                        ->sum('returned_quantity');
                    
                    $totalUnits += max(0, $item->quantity - $returnedCount);
                }
            }
            $data['stats']['scaffolding_units_on_site'] = (float) $totalUnits;

            $data['recentRentalActivity'] = $rentalContracts->sortByDesc('created_at')
                ->take(3)
                ->map(fn($rc) => [
                    'id' => $rc->id,
                    'number' => $rc->contract_number,
                    'project' => $rc->project?->name ?? 'Direct Rental',
                    'start_date' => $rc->start_date,
                    'status' => $rc->status,
                ])->values()->toArray();
        }

        return $data;
    }

    private function vendorData(User $user, int $companyId): array
    {
        $data = ['stats' => []];

        // Bills
        if (class_exists(\Noble\Account\Models\Bill::class)) {
            $bills = \Noble\Account\Models\Bill::where('created_by', $companyId)
                ->where('vendor_id', $user->id)
                ->get();

            $totalAmount = $bills->sum('total');
            $paidAmount = $bills->where('status', 'Paid')->sum('total');

            $data['stats'] = [
                'total_bills' => $bills->count(),
                'total_amount' => (float) $totalAmount,
                'paid_amount' => (float) $paidAmount,
                'outstanding' => (float) ($totalAmount - $paidAmount),
                'unpaid_count' => $bills->whereNotIn('status', ['Paid'])->count(),
            ];

            $data['recentInvoices'] = $bills->sortByDesc('bill_date')
                ->take(5)
                ->map(fn($b) => [
                    'id' => $b->id,
                    'number' => $b->bill_id ?? "BILL-{$b->id}",
                    'amount' => (float) $b->total,
                    'status' => $b->status,
                    'date' => optional($b->bill_date)->format('M d, Y'),
                ])->values()->toArray();
        }

        return $data;
    }
}
