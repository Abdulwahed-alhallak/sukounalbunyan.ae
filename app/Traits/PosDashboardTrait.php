<?php
namespace App\Traits;

use Illuminate\Support\Facades\Schema;

trait PosDashboardTrait
{
    private function getPosKPIs(): ?array
    {
        if (!$this->moduleActive('Pos')) return null;
        if (!class_exists(\Noble\Pos\Models\Pos::class) || !Schema::hasTable('pos')) return null;

        $currentMonth = now()->startOfMonth();
        $totalSales = \Noble\Pos\Models\Pos::where('created_by', $this->companyId)->count();
        $salesToday = \Noble\Pos\Models\Pos::where('created_by', $this->companyId)->whereDate('created_at', today())->count();
        $revenueToday = \Noble\Pos\Models\Pos::where('created_by', $this->companyId)->whereDate('created_at', today())->sum('grand_total');
        $revenueThisMonth = \Noble\Pos\Models\Pos::where('created_by', $this->companyId)->where('created_at', '>=', $currentMonth)->sum('grand_total');

        return [
            'total_transactions' => $totalSales,
            'transactions_today' => $salesToday,
            'revenue_today' => (float) $revenueToday,
            'revenue_this_month' => (float) $revenueThisMonth,
        ];
    }
}
