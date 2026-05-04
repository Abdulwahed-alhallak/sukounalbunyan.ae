<?php

namespace Noble\Rental\Http\Controllers;

use App\Http\Controllers\Controller;
use Noble\Rental\Models\RentalContract;
use Noble\Rental\Models\RentalContractItem;
use Noble\Rental\Models\RentalReturn;
use Noble\ProductService\Models\ProductServiceItem;
use Noble\ProductService\Models\WarehouseStock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RentalReportController extends Controller
{
    public function index()
    {
        // 1. Material Utilization
        // Total Stock vs Total in Custody
        $products = ProductServiceItem::where('created_by', creatorId())
            ->whereHas('warehouseStock')
            ->get();

        $utilizationData = $products->map(function($product) {
            $totalInStock = WarehouseStock::where('product_id', $product->id)->sum('quantity');
            $totalInCustody = RentalContractItem::where('product_id', $product->id)
                ->whereHas('contract', fn($q) => $q->where('status', 'active'))
                ->get()
                ->sum(function($item) {
                    $returned = RentalReturn::where('product_id', $item->product_id)
                        ->where('rental_contract_id', $item->rental_contract_id)
                        ->sum('returned_quantity');
                    return max(0, $item->quantity - $returned);
                });

            return [
                'id' => $product->id,
                'name' => $product->name,
                'in_stock' => $totalInStock,
                'in_custody' => $totalInCustody,
                'total' => $totalInStock + $totalInCustody,
                'utilization_rate' => ($totalInStock + $totalInCustody) > 0 
                    ? round(($totalInCustody / ($totalInStock + $totalInCustody)) * 100, 2) 
                    : 0
            ];
        });

        // 2. Revenue by Customer
        $customerRevenue = RentalContract::select('customer_id', DB::raw('SUM(total_invoiced) as revenue'))
            ->with('customer:id,name')
            ->groupBy('customer_id')
            ->orderByDesc('revenue')
            ->get();

        return Inertia::render('Rental/Reports/Index', [
            'utilization' => $utilizationData,
            'revenue' => $customerRevenue,
        ]);
    }

    public function custodyByProduct(ProductServiceItem $product)
    {
        $custody = RentalContractItem::where('product_id', $product->id)
            ->whereHas('contract', fn($q) => $q->where('status', 'active'))
            ->with(['contract.customer', 'contract.warehouse'])
            ->get()
            ->map(function($item) {
                $returned = RentalReturn::where('product_id', $item->product_id)
                    ->where('rental_contract_id', $item->rental_contract_id)
                    ->sum('returned_quantity');
                
                $remaining = $item->quantity - $returned;

                return [
                    'contract_id' => $item->contract->id,
                    'contract_number' => $item->contract->contract_number,
                    'customer' => $item->contract->customer->name,
                    'warehouse' => $item->contract->warehouse->name ?? '—',
                    'quantity' => $remaining,
                    'start_date' => $item->contract->start_date,
                ];
            })
            ->filter(fn($c) => $c['quantity'] > 0)
            ->values();

        return Inertia::render('Rental/Reports/CustodyDetails', [
            'product' => $product,
            'custody' => $custody,
        ]);
    }
}
