<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ConsolidatedBillingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Noble\Rental\Models\RentalContract;
use Illuminate\Support\Facades\Auth;

class ConsolidatedBillingController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-sales-invoices')) {
            $customers = User::where('type', 'client')
                ->where('created_by', creatorId())
                ->get();

            return Inertia::render('Sales/ConsolidatedBilling', [
                'customers' => $customers
            ]);
        }
        return back()->with('error', __('Permission denied'));
    }

    public function getCustomerContracts(User $customer)
    {
        $contracts = RentalContract::where('customer_id', $customer->id)
            ->where('status', 'active')
            ->with(['project', 'items.product'])
            ->get();

        return response()->json($contracts);
    }

    public function store(Request $request, ConsolidatedBillingService $service)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'billing_date' => 'required|date'
        ]);

        try {
            $invoice = $service->generateForCustomer($request->customer_id, \Carbon\Carbon::parse($request->billing_date));
            
            if (!$invoice) {
                return back()->with('error', __('No active contracts found for this customer.'));
            }

            return redirect()->route('sales-invoices.show', $invoice->id)->with('success', __('Consolidated invoice generated successfully.'));
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
