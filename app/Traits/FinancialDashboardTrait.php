<?php
namespace App\Traits;

use App\Models\SalesInvoice;
use App\Models\PurchaseInvoice;
use App\Models\SalesProposal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

trait FinancialDashboardTrait
{
    private function getFinancialKPIs(): array
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->subMonth()->endOfMonth();

        $totalReceivable = SalesInvoice::where('created_by', $this->companyId)
            ->where('status', '!=', 'paid')
            ->sum('balance_amount');

        $totalSalesThisMonth = SalesInvoice::where('created_by', $this->companyId)
            ->where('invoice_date', '>=', $currentMonth)
            ->sum('total_amount');

        $totalSalesLastMonth = SalesInvoice::where('created_by', $this->companyId)
            ->whereBetween('invoice_date', [$lastMonth, $lastMonthEnd])
            ->sum('total_amount');

        $overdueInvoices = SalesInvoice::where('created_by', $this->companyId)
            ->where('due_date', '<', now())
            ->where('status', '!=', 'paid')
            ->count();

        $totalPayable = PurchaseInvoice::where('created_by', $this->companyId)
            ->where('status', '!=', 'paid')
            ->sum('balance_amount');

        $totalPurchasesThisMonth = PurchaseInvoice::where('created_by', $this->companyId)
            ->where('invoice_date', '>=', $currentMonth)
            ->sum('total_amount');

        $totalRevenue = 0;
        $totalExpense = 0;
        if ($this->moduleActive('Account')) {
            if (class_exists(\Noble\Account\Models\Revenue::class) && Schema::hasTable('revenues')) {
                $totalRevenue = \Noble\Account\Models\Revenue::where('created_by', $this->companyId)
                    ->where('revenue_date', '>=', $currentMonth)
                    ->sum('amount');
            }
            if (class_exists(\Noble\Account\Models\Expense::class) && Schema::hasTable('expenses')) {
                $totalExpense = \Noble\Account\Models\Expense::where('created_by', $this->companyId)
                    ->where('expense_date', '>=', $currentMonth)
                    ->sum('amount');
            }
        }

        $pendingProposals = SalesProposal::where('created_by', $this->companyId)
            ->where('status', 'pending')
            ->count();

        $salesGrowth = $totalSalesLastMonth > 0
            ? round((($totalSalesThisMonth - $totalSalesLastMonth) / $totalSalesLastMonth) * 100, 1)
            : ($totalSalesThisMonth > 0 ? 100 : 0);

        return [
            'total_receivable' => (float) $totalReceivable,
            'total_payable' => (float) $totalPayable,
            'net_balance' => (float) ($totalReceivable - $totalPayable),
            'sales_this_month' => (float) $totalSalesThisMonth,
            'purchases_this_month' => (float) $totalPurchasesThisMonth,
            'overdue_invoices' => $overdueInvoices,
            'pending_proposals' => $pendingProposals,
            'revenue_this_month' => (float) $totalRevenue,
            'expense_this_month' => (float) $totalExpense,
            'profit_this_month' => (float) ($totalRevenue - $totalExpense),
            'sales_growth' => $salesGrowth,
        ];
    }

    private function getCashflowChart(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $year = now()->year;

        $monthFields = [
            'invoice_date' => "MONTH(invoice_date) as month",
            'revenue_date' => "MONTH(revenue_date) as month",
            'expense_date' => "MONTH(expense_date) as month",
        ];

        $salesData = SalesInvoice::where('created_by', $this->companyId)
            ->whereYear('invoice_date', $year)
            ->selectRaw("{$monthFields['invoice_date']}, SUM(total_amount) as total")
            ->groupBy('month')->get()->keyBy('month');

        $purchaseData = PurchaseInvoice::where('created_by', $this->companyId)
            ->whereYear('invoice_date', $year)
            ->selectRaw("{$monthFields['invoice_date']}, SUM(total_amount) as total")
            ->groupBy('month')->get()->keyBy('month');

        $revenueData = collect();
        $expenseData = collect();
        if ($this->moduleActive('Account')) {
            if (class_exists(\Noble\Account\Models\Revenue::class) && Schema::hasTable('revenues')) {
                $revenueData = \Noble\Account\Models\Revenue::where('created_by', $this->companyId)
                    ->whereYear('revenue_date', $year)
                    ->selectRaw("{$monthFields['revenue_date']}, SUM(amount) as total")
                    ->groupBy('month')->get()->keyBy('month');
            }
            if (class_exists(\Noble\Account\Models\Expense::class) && Schema::hasTable('expenses')) {
                $expenseData = \Noble\Account\Models\Expense::where('created_by', $this->companyId)
                    ->whereYear('expense_date', $year)
                    ->selectRaw("{$monthFields['expense_date']}, SUM(amount) as total")
                    ->groupBy('month')->get()->keyBy('month');
            }
        }

        $chart = [];
        for ($i = 1; $i <= 12; $i++) {
            $income = (float) ($salesData[$i]->total ?? 0) + (float) ($revenueData[$i]->total ?? 0);
            $expense = (float) ($purchaseData[$i]->total ?? 0) + (float) ($expenseData[$i]->total ?? 0);
            $chart[] = [
                'month' => $months[$i - 1],
                'income' => $income,
                'expense' => $expense,
                'net' => $income - $expense,
            ];
        }
        return $chart;
    }
}
