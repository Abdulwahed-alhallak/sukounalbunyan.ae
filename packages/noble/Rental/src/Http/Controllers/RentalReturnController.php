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
            'contract_id'          => 'required|exists:rental_contracts,id',
            'return_date'          => 'required|date',
            'returns'              => 'required|array',
            'returns.*.product_id' => 'required|integer',
            'returns.*.quantity'   => 'required|numeric|min:0',
            'returns.*.condition'  => 'nullable|string|in:good,damaged,lost',
            'returns.*.damage_fee' => 'nullable|numeric|min:0',
            'returns.*.damage_notes' => 'nullable|string|max:1000',
        ]);

        // Only process lines where quantity > 0
        $activeReturns = array_filter($validated['returns'], fn($r) => (float) $r['quantity'] > 0);

        if (empty($activeReturns)) {
            return back()->withErrors(['returns' => __('Please enter a quantity for at least one item.')]);
        }

        DB::transaction(function () use ($validated, $activeReturns) {
            $totalNewDamageFees = 0;

            foreach ($activeReturns as $returnData) {
                RentalReturn::create([
                    'contract_id'       => $validated['contract_id'],
                    'product_id'        => $returnData['product_id'],
                    'returned_quantity' => $returnData['quantity'],
                    'return_date'       => $validated['return_date'],
                    'condition'         => $returnData['condition'] ?? 'good',
                    'damage_fee'        => $returnData['damage_fee'] ?? 0,
                    'damage_notes'      => $returnData['damage_notes'] ?? null,
                ]);

                $totalNewDamageFees += (float) ($returnData['damage_fee'] ?? 0);
            }

            // Update contract damage fee total
            $contract = RentalContract::find($validated['contract_id']);
            if ($contract) {
                $contract->increment('total_damage_fees', $totalNewDamageFees);

                // Notify customer
                if ($contract->customer) {
                    $latestReturn = RentalReturn::where('contract_id', $contract->id)->latest()->first();
                    if ($latestReturn) {
                        try {
                            $contract->customer->notify(new RentalReturnRegisteredNotification($latestReturn));
                        } catch (\Exception $e) {
                            \Illuminate\Support\Facades\Log::warning('Rental return notification failed: ' . $e->getMessage());
                        }
                    }
                }
            }
        });

        return redirect()->route('rental.index')->with('success', __('Return registered successfully.'));
    }
}
