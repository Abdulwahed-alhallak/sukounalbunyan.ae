<?php
namespace App\Traits;

use App\Models\SalesInvoice;
use App\Models\PurchaseInvoice;
use Illuminate\Support\Facades\DB;

trait FinancialReportingTrait
{
    private function profitLossReport(string $dateFrom, string $dateTo): array
    {
        $monthSelect = "MONTH(invoice_date) as month";

        $sales = SalesInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])
            ->selectRaw("{$monthSelect}, SUM(total_amount) as total, SUM(tax_amount) as tax")
            ->groupBy('month')->orderBy('month')->get();

        $purchases = PurchaseInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])
            ->selectRaw("{$monthSelect}, SUM(total_amount) as total, SUM(tax_amount) as tax")
            ->groupBy('month')->orderBy('month')->get();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $rows = [];
        $totalRevenue = 0;
        $totalExpenses = 0;

        for ($i = 1; $i <= 12; $i++) {
            $s = $sales->firstWhere('month', $i);
            $p = $purchases->firstWhere('month', $i);
            $rev = (float) ($s->total ?? 0);
            $exp = (float) ($p->total ?? 0);
            $totalRevenue += $rev;
            $totalExpenses += $exp;

            $rows[] = [
                'month' => $months[$i - 1],
                'revenue' => $rev,
                'expenses' => $exp,
                'profit' => $rev - $exp,
                'margin' => $rev > 0 ? round((($rev - $exp) / $rev) * 100, 1) : 0,
            ];
        }

        return [
            'title' => 'Profit & Loss Statement',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'month', 'label' => 'Month', 'type' => 'text'],
                ['key' => 'revenue', 'label' => 'Revenue', 'type' => 'currency'],
                ['key' => 'expenses', 'label' => 'Expenses', 'type' => 'currency'],
                ['key' => 'profit', 'label' => 'Net Profit', 'type' => 'currency'],
                ['key' => 'margin', 'label' => 'Margin %', 'type' => 'percentage'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Revenue', 'value' => $totalRevenue, 'type' => 'currency'],
                ['label' => 'Total Expenses', 'value' => $totalExpenses, 'type' => 'currency'],
                ['label' => 'Net Profit', 'value' => $totalRevenue - $totalExpenses, 'type' => 'currency', 'highlight' => true],
                ['label' => 'Profit Margin', 'value' => $totalRevenue > 0 ? round((($totalRevenue - $totalExpenses) / $totalRevenue) * 100, 1) : 0, 'type' => 'percentage'],
            ],
            'chartData' => $rows,
            'chartType' => 'area',
        ];
    }

    private function receivablesAgingReport(): array
    {
        $invoices = SalesInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->where('status', '!=', 'paid')
            ->whereNotNull('due_date')
            ->get(['id', 'invoice_number', 'customer_name', 'total_amount', 'balance_amount', 'due_date', 'status']);

        $rows = [];
        $buckets = ['current' => 0, '1_30' => 0, '31_60' => 0, '61_90' => 0, 'over_90' => 0];

        foreach ($invoices as $inv) {
            $daysOverdue = now()->diffInDays($inv->due_date, false) * -1;
            $bucket = match (true) {
                $daysOverdue <= 0 => 'Current',
                $daysOverdue <= 30 => '1-30 Days',
                $daysOverdue <= 60 => '31-60 Days',
                $daysOverdue <= 90 => '61-90 Days',
                default => '90+ Days',
            };

            $rows[] = [
                'invoice' => $inv->invoice_number,
                'customer' => $inv->customer_name ?? '—',
                'total' => (float) $inv->total_amount,
                'balance' => (float) $inv->balance_amount,
                'due_date' => $inv->due_date->format('Y-m-d'),
                'days_overdue' => max(0, $daysOverdue),
                'aging_bucket' => $bucket,
            ];

            $key = match ($bucket) {
                'Current' => 'current', '1-30 Days' => '1_30', '31-60 Days' => '31_60',
                '61-90 Days' => '61_90', default => 'over_90',
            };
            $buckets[$key] += (float) $inv->balance_amount;
        }

        return [
            'title' => 'Receivables Aging Report',
            'columns' => [
                ['key' => 'invoice', 'label' => 'Invoice #', 'type' => 'text'],
                ['key' => 'customer', 'label' => 'Customer', 'type' => 'text'],
                ['key' => 'total', 'label' => 'Total', 'type' => 'currency'],
                ['key' => 'balance', 'label' => 'Balance', 'type' => 'currency'],
                ['key' => 'due_date', 'label' => 'Due Date', 'type' => 'date'],
                ['key' => 'days_overdue', 'label' => 'Days Overdue', 'type' => 'number'],
                ['key' => 'aging_bucket', 'label' => 'Aging', 'type' => 'badge'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Current', 'value' => $buckets['current'], 'type' => 'currency'],
                ['label' => '1-30 Days', 'value' => $buckets['1_30'], 'type' => 'currency'],
                ['label' => '31-60 Days', 'value' => $buckets['31_60'], 'type' => 'currency'],
                ['label' => '61-90 Days', 'value' => $buckets['61_90'], 'type' => 'currency'],
                ['label' => '90+ Days', 'value' => $buckets['over_90'], 'type' => 'currency', 'highlight' => true],
                ['label' => 'Total Outstanding', 'value' => array_sum($buckets), 'type' => 'currency', 'highlight' => true],
            ],
            'chartData' => array_map(fn($k, $v) => ['name' => str_replace('_', '-', $k), 'value' => $v], array_keys($buckets), array_values($buckets)),
            'chartType' => 'pie',
        ];
    }

    private function payablesAgingReport(): array
    {
        $invoices = PurchaseInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->where('status', '!=', 'paid')
            ->whereNotNull('due_date')
            ->get(['id', 'invoice_number', 'vendor_name', 'total_amount', 'balance_amount', 'due_date']);

        $rows = [];
        $total = 0;
        foreach ($invoices as $inv) {
            $daysOverdue = max(0, now()->diffInDays($inv->due_date, false) * -1);
            $total += (float) $inv->balance_amount;
            $rows[] = [
                'invoice' => $inv->invoice_number,
                'vendor' => $inv->vendor_name ?? '—',
                'total' => (float) $inv->total_amount,
                'balance' => (float) $inv->balance_amount,
                'due_date' => $inv->due_date->format('Y-m-d'),
                'days_overdue' => $daysOverdue,
            ];
        }

        return [
            'title' => 'Payables Aging Report',
            'columns' => [
                ['key' => 'invoice', 'label' => 'Invoice #', 'type' => 'text'],
                ['key' => 'vendor', 'label' => 'Vendor', 'type' => 'text'],
                ['key' => 'total', 'label' => 'Total', 'type' => 'currency'],
                ['key' => 'balance', 'label' => 'Balance', 'type' => 'currency'],
                ['key' => 'due_date', 'label' => 'Due Date', 'type' => 'date'],
                ['key' => 'days_overdue', 'label' => 'Days Overdue', 'type' => 'number'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Payable', 'value' => $total, 'type' => 'currency', 'highlight' => true],
                ['label' => 'Invoices Count', 'value' => count($rows), 'type' => 'number'],
            ],
        ];
    }

    private function salesSummaryReport(string $dateFrom, string $dateTo): array
    {
        $data = SalesInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])
            ->selectRaw('status, COUNT(*) as count, SUM(total_amount) as total, SUM(tax_amount) as tax, SUM(balance_amount) as outstanding')
            ->groupBy('status')->get();

        $rows = $data->map(fn($d) => [
            'status' => $d->status,
            'count' => $d->count,
            'total' => (float) $d->total,
            'tax' => (float) $d->tax,
            'outstanding' => (float) $d->outstanding,
        ])->toArray();

        return [
            'title' => 'Sales Summary Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'status', 'label' => 'Status', 'type' => 'badge'],
                ['key' => 'count', 'label' => 'Invoices', 'type' => 'number'],
                ['key' => 'total', 'label' => 'Total Amount', 'type' => 'currency'],
                ['key' => 'tax', 'label' => 'Tax Collected', 'type' => 'currency'],
                ['key' => 'outstanding', 'label' => 'Outstanding', 'type' => 'currency'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Sales', 'value' => $data->sum('total'), 'type' => 'currency', 'highlight' => true],
                ['label' => 'Total Tax', 'value' => $data->sum('tax'), 'type' => 'currency'],
                ['label' => 'Total Invoices', 'value' => $data->sum('count'), 'type' => 'number'],
            ],
            'chartData' => $rows,
            'chartType' => 'bar',
        ];
    }

    private function purchaseSummaryReport(string $dateFrom, string $dateTo): array
    {
        $data = PurchaseInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])
            ->selectRaw('status, COUNT(*) as count, SUM(total_amount) as total')
            ->groupBy('status')->get();

        return [
            'title' => 'Purchase Summary Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'status', 'label' => 'Status', 'type' => 'badge'],
                ['key' => 'count', 'label' => 'Invoices', 'type' => 'number'],
                ['key' => 'total', 'label' => 'Total Amount', 'type' => 'currency'],
            ],
            'rows' => $data->map(fn($d) => ['status' => $d->status, 'count' => $d->count, 'total' => (float) $d->total])->toArray(),
            'summary' => [
                ['label' => 'Total Purchases', 'value' => $data->sum('total'), 'type' => 'currency', 'highlight' => true],
            ],
        ];
    }

    private function taxSummaryReport(string $dateFrom, string $dateTo): array
    {
        $salesTax = SalesInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])->sum('tax_amount');
        $purchaseTax = PurchaseInvoice::when($this->companyId, fn($q) => $q->where('created_by', $this->companyId))
            ->whereBetween('invoice_date', [$dateFrom, $dateTo])->sum('tax_amount');

        return [
            'title' => 'Tax Summary Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'category', 'label' => 'Category', 'type' => 'text'],
                ['key' => 'amount', 'label' => 'Amount', 'type' => 'currency'],
            ],
            'rows' => [
                ['category' => 'Tax Collected (Sales)', 'amount' => (float) $salesTax],
                ['category' => 'Tax Paid (Purchases)', 'amount' => (float) $purchaseTax],
                ['category' => 'Net Tax Liability', 'amount' => (float) $salesTax - (float) $purchaseTax],
            ],
            'summary' => [
                ['label' => 'Tax Collected', 'value' => (float) $salesTax, 'type' => 'currency'],
                ['label' => 'Tax Paid', 'value' => (float) $purchaseTax, 'type' => 'currency'],
                ['label' => 'Net Liability', 'value' => (float) $salesTax - (float) $purchaseTax, 'type' => 'currency', 'highlight' => true],
            ],
        ];
    }
}
