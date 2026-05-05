<?php

namespace Noble\Rental\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Noble\Rental\Models\RentalContract;
use Noble\ProductService\Models\WarehouseStock;
use App\Models\SalesInvoice;
use App\Models\User;
use Carbon\Carbon;

class RentalDashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $workspace = getActiveWorkSpace();

        // Total active contracts
        $activeContractsCount = RentalContract::where('workspace', $workspace)
            ->where('status', 'active')
            ->count();

        // Total revenue from rentals
        $totalRevenue = RentalContract::where('workspace', $workspace)
            ->sum('paid_amount');

        // Contracts ending in next 7 days
        $endingSoon = RentalContract::with(['customer', 'project'])
            ->where('workspace', $workspace)
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->whereBetween('end_date', [$now->toDateString(), $now->copy()->addDays(7)->toDateString()])
            ->orderBy('end_date', 'asc')
            ->take(5)
            ->get();

        // Overdue contracts (end_date passed and still active)
        $overdueContracts = RentalContract::with(['customer', 'project'])
            ->where('workspace', $workspace)
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->where('end_date', '<', $now->toDateString())
            ->orderBy('end_date', 'asc')
            ->take(5)
            ->get();

        // Top rented items
        $topRentedItems = WarehouseStock::with(['product' => function ($q) {
                $q->select('id', 'name', 'sku');
            }])
            ->where('rented_quantity', '>', 0)
            ->orderBy('rented_quantity', 'desc')
            ->take(6)
            ->get();

        // Monthly revenue chart data (last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $revenue = RentalContract::where('workspace', $workspace)
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('paid_amount');
            
            $monthlyRevenue[] = [
                'name' => $month->format('M Y'),
                'total' => (float) $revenue
            ];
        }

        // Recent contracts
        $recentContracts = RentalContract::with(['customer'])
            ->where('workspace', $workspace)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Rental/Dashboard', [
            'stats' => [
                'activeContracts' => $activeContractsCount,
                'totalRevenue' => $totalRevenue,
                'totalRentedItems' => $topRentedItems->sum('rented_quantity'),
            ],
            'endingSoon' => $endingSoon,
            'overdueContracts' => $overdueContracts,
            'topRentedItems' => $topRentedItems,
            'monthlyRevenue' => $monthlyRevenue,
            'recentContracts' => $recentContracts,
        ]);
    }
}
