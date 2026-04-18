<?php
namespace App\Traits;

use App\Models\User;
use Illuminate\Support\Facades\DB;

trait PlatformReportingTrait
{
    private function dailySalesReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Pos\Models\Pos::class)) return $this->emptyReport('Daily Sales');

        $data = \Noble\Pos\Models\Pos::where('created_by', $this->companyId)
            ->whereBetween('created_at', [$dateFrom, "$dateTo 23:59:59"])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as transactions, SUM(grand_total) as revenue')
            ->groupBy('date')->orderBy('date')->get();

        return [
            'title' => 'Daily Sales Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'date', 'label' => 'Date', 'type' => 'date'],
                ['key' => 'transactions', 'label' => 'Transactions', 'type' => 'number'],
                ['key' => 'revenue', 'label' => 'Revenue', 'type' => 'currency'],
            ],
            'rows' => $data->map(fn($d) => ['date' => $d->date, 'transactions' => $d->transactions, 'revenue' => (float) $d->revenue])->toArray(),
            'summary' => [
                ['label' => 'Total Revenue', 'value' => (float) $data->sum('revenue'), 'type' => 'currency', 'highlight' => true],
                ['label' => 'Total Transactions', 'value' => $data->sum('transactions'), 'type' => 'number'],
            ],
            'chartData' => $data->map(fn($d) => ['date' => $d->date, 'revenue' => (float) $d->revenue])->toArray(),
            'chartType' => 'area',
        ];
    }

    private function topProductsReport(string $dateFrom, string $dateTo): array
    {
        return $this->emptyReport('Top Selling Products', 'Requires POS item-level data');
    }

    private function subscriptionAnalyticsReport(string $dateFrom, string $dateTo): array
    {
        $monthSelect = "MONTH(created_at) as month";

        $data = \App\Models\Order::whereBetween('created_at', [$dateFrom, "$dateTo 23:59:59"])
            ->selectRaw("{$monthSelect}, COUNT(*) as count, SUM(price) as revenue")
            ->groupBy('month')->orderBy('month')->get();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return [
            'title' => 'Subscription Analytics',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'month', 'label' => 'Month', 'type' => 'text'],
                ['key' => 'subscriptions', 'label' => 'Subscriptions', 'type' => 'number'],
                ['key' => 'revenue', 'label' => 'Revenue', 'type' => 'currency'],
            ],
            'rows' => $data->map(fn($d) => [
                'month' => $months[($d->month ?? 1) - 1] ?? 'N/A',
                'subscriptions' => $d->count,
                'revenue' => (float) $d->revenue,
            ])->toArray(),
            'summary' => [
                ['label' => 'Total Revenue', 'value' => (float) $data->sum('revenue'), 'type' => 'currency', 'highlight' => true],
                ['label' => 'Total Subscriptions', 'value' => $data->sum('count'), 'type' => 'number'],
                ['label' => 'Active Companies', 'value' => User::where('type', 'company')->where('is_disable', 0)->count(), 'type' => 'number'],
            ],
            'chartData' => $data->map(fn($d) => ['month' => $months[($d->month ?? 1) - 1] ?? 'N/A', 'revenue' => (float) $d->revenue])->toArray(),
            'chartType' => 'area',
        ];
    }

    private function companyGrowthReport(string $dateFrom, string $dateTo): array
    {
        $monthSelect = "MONTH(created_at) as month";

        $data = User::where('type', 'company')
            ->whereBetween('created_at', [$dateFrom, "$dateTo 23:59:59"])
            ->selectRaw("{$monthSelect}, COUNT(*) as count")
            ->groupBy('month')->orderBy('month')->get();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return [
            'title' => 'Company Growth Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'month', 'label' => 'Month', 'type' => 'text'],
                ['key' => 'new_companies', 'label' => 'New Companies', 'type' => 'number'],
            ],
            'rows' => $data->map(fn($d) => ['month' => $months[($d->month ?? 1) - 1] ?? 'N/A', 'new_companies' => $d->count])->toArray(),
            'summary' => [
                ['label' => 'Total New', 'value' => $data->sum('count'), 'type' => 'number', 'highlight' => true],
                ['label' => 'Total Active', 'value' => User::where('type', 'company')->where('is_disable', 0)->count(), 'type' => 'number'],
            ],
        ];
    }

    private function revenueBreakdownReport(string $dateFrom, string $dateTo): array
    {
        $byPlan = \App\Models\Order::whereBetween('created_at', [$dateFrom, "$dateTo 23:59:59"])
            ->selectRaw('plan_name, COUNT(*) as count, SUM(price) as revenue')
            ->groupBy('plan_name')->get();

        return [
            'title' => 'Revenue Breakdown',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'plan', 'label' => 'Plan', 'type' => 'text'],
                ['key' => 'subscriptions', 'label' => 'Subscriptions', 'type' => 'number'],
                ['key' => 'revenue', 'label' => 'Revenue', 'type' => 'currency'],
            ],
            'rows' => $byPlan->map(fn($d) => ['plan' => $d->plan_name ?? 'Unknown', 'subscriptions' => $d->count, 'revenue' => (float) $d->revenue])->toArray(),
            'summary' => [
                ['label' => 'Total Revenue', 'value' => (float) $byPlan->sum('revenue'), 'type' => 'currency', 'highlight' => true],
            ],
            'chartData' => $byPlan->map(fn($d) => ['name' => $d->plan_name ?? 'Unknown', 'value' => (float) $d->revenue])->toArray(),
            'chartType' => 'pie',
        ];
    }
}
