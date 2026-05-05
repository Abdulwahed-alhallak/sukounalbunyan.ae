<?php

namespace Noble\Rental\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Noble\Rental\Models\RentalProject;
use App\Models\User;

class RentalProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = RentalProject::with(['customer'])
            ->withCount(['contracts', 'contracts as active_contracts_count' => fn($q) => $q->where('status', 'active')])
            ->with(['contracts' => fn($q) => $q->select('id', 'rental_project_id', 'total_invoiced', 'paid_amount')])
            ->orderBy('created_at', 'desc');

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where(fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%")
            );
        }

        $projects = $query->paginate(20)->withQueryString();

        $customers = User::where('type', 'client')
            ->where('created_by', creatorId())
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'color']);

        return Inertia::render('Rental/Projects/Index', [
            'projects'  => $projects,
            'customers' => $customers,
            'filters'   => $request->only(['customer_id', 'status', 'search']),
        ]);
    }

    public function create()
    {
        $customers = User::where('type', 'client')
            ->where('created_by', creatorId())
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'color']);

        return Inertia::render('Rental/Projects/Create', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'code'                 => 'nullable|string|max:50',
            'description'          => 'nullable|string',
            'customer_id'          => 'required|exists:users,id',
            'color'                => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'site_name'            => 'nullable|string|max:255',
            'site_address'         => 'nullable|string',
            'site_contact_person'  => 'nullable|string|max:255',
            'site_contact_phone'   => 'nullable|string|max:50',
            'status'               => 'in:active,completed,on_hold,cancelled',
        ]);

        $project = RentalProject::create([
            ...$validated,
            'color'      => $validated['color'] ?? '#6366F1',
            'created_by' => Auth::id(),
            'workspace'  => creatorId(),
        ]);

        $project->logEvent('created', ['name' => $project->name]);

        return redirect()
            ->route('rental-projects.show', $project->id)
            ->with('success', __('Project created successfully.'));
    }

    public function show(RentalProject $rentalProject)
    {
        $rentalProject->load([
            'customer',
            'contracts.items.product',
            'contracts.returns',
            'contracts.invoices',
            'quotations.items',
        ]);

        // Financial summary across all contracts
        $summary = [
            'total_contracts'     => $rentalProject->contracts->count(),
            'active_contracts'    => $rentalProject->contracts->where('status', 'active')->count(),
            'total_invoiced'      => $rentalProject->contracts->sum('total_invoiced'),
            'total_paid'          => $rentalProject->contracts->sum('paid_amount'),
            'total_damage_fees'   => $rentalProject->contracts->sum('total_damage_fees'),
            'balance_due'         => $rentalProject->contracts->sum('total_invoiced') - $rentalProject->contracts->sum('paid_amount'),
        ];

        // Materials in custody across all active contracts
        $custody = [];
        foreach ($rentalProject->contracts->where('status', 'active') as $contract) {
            foreach ($contract->items as $item) {
                $returned = $contract->returns->where('product_id', $item->product_id)->sum('returned_quantity');
                $remaining = $item->quantity - $returned;
                if ($remaining > 0) {
                    $key = $item->product_id;
                    if (!isset($custody[$key])) {
                        $custody[$key] = [
                            'product_id'   => $item->product_id,
                            'product_name' => $item->product->name ?? '—',
                            'quantity'     => 0,
                        ];
                    }
                    $custody[$key]['quantity'] += $remaining;
                }
            }
        }

        return Inertia::render('Rental/Projects/Show', [
            'project'  => $rentalProject,
            'summary'  => $summary,
            'custody'  => array_values($custody),
        ]);
    }

    public function edit(RentalProject $rentalProject)
    {
        $customers = User::where('type', 'client')
            ->where('created_by', creatorId())
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'color']);

        return Inertia::render('Rental/Projects/Edit', [
            'project'   => $rentalProject,
            'customers' => $customers,
        ]);
    }

    public function update(Request $request, RentalProject $rentalProject)
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'code'                 => 'nullable|string|max:50',
            'description'          => 'nullable|string',
            'customer_id'          => 'required|exists:users,id',
            'color'                => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'site_name'            => 'nullable|string|max:255',
            'site_address'         => 'nullable|string',
            'site_contact_person'  => 'nullable|string|max:255',
            'site_contact_phone'   => 'nullable|string|max:50',
            'status'               => 'in:active,completed,on_hold,cancelled',
        ]);

        $rentalProject->update($validated);

        return redirect()
            ->route('rental-projects.show', $rentalProject->id)
            ->with('success', __('Project updated successfully.'));
    }

    public function destroy(RentalProject $rentalProject)
    {
        if ($rentalProject->contracts()->where('status', 'active')->exists()) {
            return back()->with('error', __('Cannot delete a project with active contracts.'));
        }

        $rentalProject->delete();

        return redirect()
            ->route('rental-projects.index')
            ->with('success', __('Project deleted successfully.'));
    }
}
