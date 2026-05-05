<?php

namespace Noble\Rental\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalReturn;
use Noble\Rental\Models\RentalContractItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Notifications\RentalReturnRegisteredNotification;
use Illuminate\Support\Facades\Notification;

class RentalReturnController extends Controller
{
    /**
     * Show the return registration page.
     */
    public function create(Request $request)
    {
        $contracts = RentalContract::with(['customer', 'project'])
            ->where('status', 'active')
            ->get()
            ->map(fn($c) => [
                'value' => $c->id,
                'label' => $c->contract_number . ' - ' . ($c->project?->name ?? $c->customer->name),
            ]);

        return Inertia::render('Rental::Returns/Create', [
            'contracts' => $contracts,
        ]);
    }

    /**
     * Get contract items for return.
     */
    public function getContractItems($id)
    {
        $contract = RentalContract::with(['items.product'])->findOrFail($id);
        
        $items = $contract->items->map(fn($item) => [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'product_name' => $item->product->name,
            'rented_quantity' => $item->quantity,
            'returned_quantity_total' => RentalReturn::where('contract_id', $id)
                ->where('product_id', $item->product_id)
                ->sum('returned_quantity'),
        ])->map(function($item) {
            $item['outstanding_quantity'] = $item['rented_quantity'] - $item['returned_quantity_total'];
            return $item;
        });

        return response()->json($items);
    }

    /**
     * Store a new return.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:rental_contracts,id',
            'returns' => 'required|array',
            'returns.*.product_id' => 'required',
            'returns.*.quantity' => 'required|numeric|min:0.01',
            'return_date' => 'required|date',
        ]);

        DB::transaction(function() use ($validated) {
            foreach ($validated['returns'] as $returnData) {
                RentalReturn::create([
                    'contract_id' => $validated['contract_id'],
                    'product_id' => $returnData['product_id'],
                    'returned_quantity' => $returnData['quantity'],
                    'return_date' => $validated['return_date'],
                    'condition' => $returnData['condition'] ?? 'Good',
                    'damage_fee' => $returnData['damage_fee'] ?? 0,
                    'damage_notes' => $returnData['damage_notes'] ?? null,
                ]);

                // Logic for inventory adjustment can be added here
            }

            // Send notification to the customer
            $contract = RentalContract::find($validated['contract_id']);
            if ($contract && $contract->customer) {
                $contract->customer->notify(new RentalReturnRegisteredNotification(RentalReturn::where('contract_id', $contract->id)->latest()->first()));
            }
        });

        return redirect()->route('rental.index')->with('success', 'Return registered successfully.');
    }
}
