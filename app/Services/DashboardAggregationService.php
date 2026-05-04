<?php

namespace App\Services;

use App\Models\User;
use App\Models\Plan;
use App\Models\Order;
use App\Models\SalesInvoice;
use App\Models\PurchaseInvoice;
use App\Models\SalesProposal;
use App\Models\HelpdeskTicket;
use App\Traits\FinancialDashboardTrait;
use App\Traits\HrmDashboardTrait;
use App\Traits\CrmDashboardTrait;
use App\Traits\ProjectDashboardTrait;
use App\Traits\PosDashboardTrait;
use App\Traits\SupportDashboardTrait;
use Noble\Rental\Traits\RentalDashboardTrait;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * DashboardAggregationService
 *
 * Centralizes all dashboard metrics from across ALL modules.
 * Safely checks module availability before querying data.
 * Uses modular Traits for specific domain logic.
 */
class DashboardAggregationService
{
    use FinancialDashboardTrait,
        HrmDashboardTrait,
        CrmDashboardTrait,
        ProjectDashboardTrait,
        PosDashboardTrait,
        SupportDashboardTrait,
        RentalDashboardTrait;

    private int $companyId;
    private int $cacheTTL = 300; // 5 minutes
    private array $activatedModules = [];

    public function __construct(int $companyId)
    {
        $this->companyId = $companyId;
        $this->activatedModules = $this->getActiveModules();
    }

    /**
     * Get all dashboard data for SuperAdmin view
     */
    public static function superAdmin(): array
    {
        return Cache::remember('dashboard_superadmin', 300, function () {
            $currentMonth = now()->month;
            $currentYear = now()->year;
            $lastMonth = now()->subMonth();

            $monthSelect = "MONTH(created_at) as month";

            // Monthly revenue trend
            $orderData = Order::selectRaw("{$monthSelect}, COUNT(*) as count, SUM(price) as total")
                ->whereYear('created_at', $currentYear)
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->keyBy('month');

            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $chartData = [];
            for ($i = 1; $i <= 12; $i++) {
                $chartData[] = [
                    'month' => $months[$i - 1],
                    'orders' => $orderData[$i]->count ?? 0,
                    'payments' => (float) ($orderData[$i]->total ?? 0),
                ];
            }

            // Current month vs last month revenue
            $currentMonthRevenue = Order::whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $currentMonth)->sum('price');
            $lastMonthRevenue = Order::whereYear('created_at', $lastMonth->year)
                ->whereMonth('created_at', $lastMonth->month)->sum('price');

            $revenueGrowth = $lastMonthRevenue > 0
                ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
                : ($currentMonthRevenue > 0 ? 100 : 0);

            return [
                'stats' => [
                    'total_revenue' => (float) Order::sum('price'),
                    'total_orders' => Order::count(),
                    'total_plans' => Plan::count(),
                    'total_companies' => User::where('type', 'company')->count(),
                    'revenue_growth' => $revenueGrowth,
                    'new_companies_this_month' => User::where('type', 'company')->whereYear('created_at', $currentYear)->whereMonth('created_at', $currentMonth)->count(),
                ],
                'chartData' => $chartData,
                'planDistribution' => Plan::leftJoin('users', 'users.active_plan', '=', 'plans.id')
                    ->where('users.type', 'company')
                    ->select('plans.name', DB::raw('COUNT(users.id) as count'))
                    ->groupBy('plans.name')->get(),
                'recentOrders' => Order::with('user:id,name,email')->orderBy('created_at', 'desc')->limit(5)->get(),
            ];
        });
    }

    /**
     * Get all KPIs for Company Dashboard — Module-aware
     */
    public function companyDashboard(): array
    {
        $cacheKey = "dashboard_company_{$this->companyId}";

        return Cache::remember($cacheKey, $this->cacheTTL, function () {
            return [
                'financial' => $this->getFinancialKPIs(),
                'hrm' => $this->getHrmKPIs(),
                'crm' => $this->getCrmKPIs(),
                'project' => $this->getProjectKPIs(),
                'pos' => $this->getPosKPIs(),
                'support' => $this->getSupportKPIs(),
                'rental' => $this->moduleActive('Rental') ? $this->getRentalKPIs() : null,
                'cashflow' => $this->getCashflowChart(),
                'recentActivity' => $this->getRecentActivity(),
                'upcomingEvents' => $this->getUpcomingEvents(),
                'activeModules' => $this->activatedModules,
            ];
        });
    }

    private function getRecentActivity(): array
    {
        $activities = [];

        // Recent sales invoices
        $recentSales = SalesInvoice::where('created_by', $this->companyId)->orderByDesc('created_at')->limit(3)->get();
        foreach ($recentSales as $sale) {
            $activities[] = ['type' => 'sales_invoice', 'label' => $sale->invoice_number, 'amount' => (float) $sale->total_amount, 'status' => $sale->status, 'date' => $sale->created_at->toISOString()];
        }

        // Recent rental contracts
        if ($this->moduleActive('Rental') && class_exists(\Noble\Rental\Models\RentalContract::class)) {
            $recentRentals = \Noble\Rental\Models\RentalContract::where('created_by', $this->companyId)->orderByDesc('created_at')->limit(3)->get();
            foreach ($recentRentals as $rental) {
                $activities[] = ['type' => 'rental_contract', 'label' => $rental->contract_number, 'amount' => (float) $rental->total_invoiced, 'status' => $rental->status, 'date' => $rental->created_at->toISOString()];
            }
        }

        // Recent purchase invoices
        $recentPurchases = PurchaseInvoice::where('created_by', $this->companyId)->orderByDesc('created_at')->limit(3)->get();
        foreach ($recentPurchases as $purchase) {
            $activities[] = ['type' => 'purchase_invoice', 'label' => $purchase->invoice_number, 'amount' => (float) $purchase->total_amount, 'status' => $purchase->status, 'date' => $purchase->created_at->toISOString()];
        }

        usort($activities, fn($a, $b) => strcmp($b['date'], $a['date']));
        return array_slice($activities, 0, 8);
    }

    private function getUpcomingEvents(): array
    {
        $events = [];
        $overdueInvoices = SalesInvoice::where('created_by', $this->companyId)->where('due_date', '<', now())->where('status', '!=', 'paid')->orderBy('due_date')->limit(3)->get();
        foreach ($overdueInvoices as $inv) {
            $events[] = ['type' => 'overdue_invoice', 'title' => __('Overdue') . ": {$inv->invoice_number}", 'amount' => (float) $inv->total_amount, 'date' => $inv->due_date->toISOString(), 'urgency' => 'high'];
        }

        // Rental contracts ending soon
        if ($this->moduleActive('Rental') && class_exists(\Noble\Rental\Models\RentalContract::class)) {
            $endingRentals = \Noble\Rental\Models\RentalContract::where('created_by', $this->companyId)
                ->where('status', 'active')
                ->whereNotNull('end_date')
                ->where('end_date', '<=', now()->addDays(7))
                ->orderBy('end_date')
                ->limit(3)
                ->get();
            foreach ($endingRentals as $rental) {
                $events[] = ['type' => 'rental_expiry', 'title' => __('Rental Ending') . ": {$rental->contract_number}", 'amount' => (float)$rental->balance_due, 'date' => $rental->end_date->toISOString(), 'urgency' => 'medium'];
            }

            // Rental Installments
            if (class_exists(\Noble\Rental\Models\RentalInstallment::class)) {
                $dueInstallments = \Noble\Rental\Models\RentalInstallment::with('contract')
                    ->whereHas('contract', function ($q) {
                        $q->where('created_by', $this->companyId);
                    })
                    ->where('status', 'pending')
                    ->where('due_date', '<=', now()->addDays(7))
                    ->orderBy('due_date')
                    ->limit(3)
                    ->get();
                
                foreach ($dueInstallments as $installment) {
                    $urgency = $installment->due_date < now() ? 'high' : 'medium';
                    $events[] = [
                        'type' => 'rental_installment',
                        'title' => __('Installment Due') . " - " . ($installment->contract->contract_number ?? ''),
                        'amount' => (float)$installment->amount,
                        'date' => $installment->due_date->toISOString(),
                        'urgency' => $urgency
                    ];
                }
            }

            // Rental Logistics
            $pendingLogistics = \Noble\Rental\Models\RentalContract::where('created_by', $this->companyId)
                ->whereIn('logistics_status', ['pending_delivery', 'pending_pickup'])
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->get();
            
            foreach ($pendingLogistics as $logistics) {
                $action = $logistics->logistics_status === 'pending_delivery' ? __('Pending Delivery') : __('Pending Pickup');
                $events[] = [
                    'type' => 'rental_logistics',
                    'title' => "{$action}: {$logistics->contract_number}",
                    'amount' => null,
                    'date' => $logistics->updated_at->toISOString(), // Not a perfect date for event, but works
                    'urgency' => 'high'
                ];
            }
        }
        usort($events, fn($a, $b) => strcmp($a['date'], $b['date']));
        return array_slice($events, 0, 6);
    }

    private function getActiveModules(): array
    {
        try {
            $user = User::find($this->companyId);
            if (!$user || !function_exists('Module_is_active')) return [];
            $allModules = ['Account', 'Hrm', 'Lead', 'Taskly', 'Pos', 'Contract', 'SupportTicket', 'Rental'];
            return array_filter($allModules, fn($mod) => Module_is_active($mod, $this->companyId));
        } catch (\Exception $e) { return []; }
    }

    private function moduleActive(string $module): bool
    {
        return in_array($module, $this->activatedModules);
    }
}
