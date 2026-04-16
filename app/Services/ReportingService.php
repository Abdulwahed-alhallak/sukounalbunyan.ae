<?php

namespace App\Services;

use App\Models\SalesInvoice;
use App\Models\PurchaseInvoice;
use App\Models\SalesProposal;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * ReportingService
 *
 * Centralized reporting engine forNobleArchitecture.
 * Generates structured report data from any module.
 * Module-aware: checks class_exists() and Schema before querying.
 */
class ReportingService
{
    private int $userId;
    private string $userType;
    private int $companyId;

    public function __construct(int $userId, string $userType)
    {
        $this->userId = $userId;
        $this->userType = $userType;

        // Determine company context
        if ($userType === 'company') {
            $this->companyId = $userId;
        } elseif ($userType === 'superadmin') {
            $this->companyId = 0; // All companies
        } else {
            $user = User::find($userId);
            $this->companyId = $user->created_by ?? $userId;
        }
    }

    /**
     * Get all available reports for current user
     */
    public function getAvailableReports(): array
    {
        $reports = [];

        // ── Financial Reports (always available) ──
        $reports[] = [
            'category' => 'financial',
            'category_label' => 'Financial Reports',
            'category_icon' => 'DollarSign',
            'items' => [
                ['key' => 'profit_loss', 'label' => 'Profit & Loss Statement', 'description' => 'Revenue, expenses, and net profit over a period', 'icon' => 'TrendingUp'],
                ['key' => 'receivables_aging', 'label' => 'Receivables Aging', 'description' => 'Outstanding invoices grouped by age', 'icon' => 'Clock'],
                ['key' => 'payables_aging', 'label' => 'Payables Aging', 'description' => 'Outstanding purchase invoices by age', 'icon' => 'Clock'],
                ['key' => 'sales_summary', 'label' => 'Sales Summary', 'description' => 'Total sales by period, customer, or product', 'icon' => 'BarChart3'],
                ['key' => 'purchase_summary', 'label' => 'Purchase Summary', 'description' => 'Total purchases by period and vendor', 'icon' => 'ShoppingCart'],
                ['key' => 'tax_summary', 'label' => 'Tax Summary', 'description' => 'Collected and paid taxes summary', 'icon' => 'Receipt'],
            ],
        ];

        // ── HRM Reports (if HRM active) ──
        if ($this->moduleAvailable('Hrm')) {
            $reports[] = [
                'category' => 'hrm',
                'category_label' => 'HR & Workforce Reports',
                'category_icon' => 'Users',
                'items' => [
                    ['key' => 'attendance_summary', 'label' => 'Attendance Summary', 'description' => 'Monthly attendance by employee/department', 'icon' => 'CalendarCheck'],
                    ['key' => 'leave_balance', 'label' => 'Leave Balance Report', 'description' => 'Leave balances and usage by employee', 'icon' => 'CalendarOff'],
                    ['key' => 'headcount', 'label' => 'Headcount Report', 'description' => 'Employees by department, designation, and status', 'icon' => 'Users'],
                    ['key' => 'employee_turnover', 'label' => 'Employee Turnover', 'description' => 'New hires vs terminations over time', 'icon' => 'UserMinus'],
                ],
            ];
        }

        // ── CRM Reports (if Lead active) ──
        if ($this->moduleAvailable('Lead')) {
            $reports[] = [
                'category' => 'crm',
                'category_label' => 'CRM & Sales Pipeline',
                'category_icon' => 'Target',
                'items' => [
                    ['key' => 'lead_funnel', 'label' => 'Lead Funnel Analysis', 'description' => 'Leads by stage with conversion rates', 'icon' => 'Filter'],
                    ['key' => 'deal_pipeline', 'label' => 'Deal Pipeline Report', 'description' => 'Active deals by stage and expected value', 'icon' => 'GitBranch'],
                    ['key' => 'lead_source', 'label' => 'Lead Source Analysis', 'description' => 'Lead generation by source/channel', 'icon' => 'PieChart'],
                ],
            ];
        }

        // ── Project Reports (if Taskly active) ──
        if ($this->moduleAvailable('Taskly')) {
            $reports[] = [
                'category' => 'project',
                'category_label' => 'Project & Task Reports',
                'category_icon' => 'Briefcase',
                'items' => [
                    ['key' => 'project_status', 'label' => 'Project Status Report', 'description' => 'All projects with completion rates and deadlines', 'icon' => 'Activity'],
                    ['key' => 'task_productivity', 'label' => 'Task Productivity', 'description' => 'Tasks completed vs assigned per team member', 'icon' => 'CheckSquare'],
                    ['key' => 'overdue_tasks', 'label' => 'Overdue Tasks Report', 'description' => 'All overdue tasks with priority and assignee', 'icon' => 'AlertTriangle'],
                ],
            ];
        }

        // ── POS Reports (if Pos active) ──
        if ($this->moduleAvailable('Pos')) {
            $reports[] = [
                'category' => 'pos',
                'category_label' => 'Point of Sale Reports',
                'category_icon' => 'CreditCard',
                'items' => [
                    ['key' => 'daily_sales', 'label' => 'Daily Sales Report', 'description' => 'Transactions and revenue by day', 'icon' => 'CalendarDays'],
                    ['key' => 'top_products', 'label' => 'Top Selling Products', 'description' => 'Best performing products by quantity and revenue', 'icon' => 'Star'],
                ],
            ];
        }

        // ── SuperAdmin Reports ──
        if ($this->userType === 'superadmin') {
            $reports[] = [
                'category' => 'platform',
                'category_label' => 'Platform Analytics',
                'category_icon' => 'Shield',
                'items' => [
                    ['key' => 'subscription_analytics', 'label' => 'Subscription Analytics', 'description' => 'MRR, churn rate, and plan distribution', 'icon' => 'CreditCard'],
                    ['key' => 'company_growth', 'label' => 'Company Growth', 'description' => 'New registrations and active companies over time', 'icon' => 'TrendingUp'],
                    ['key' => 'revenue_breakdown', 'label' => 'Revenue Breakdown', 'description' => 'Revenue by plan, payment method, and period', 'icon' => 'PieChart'],
                ],
            ];
        }

        return $reports;
    }

    /**
     * Generate a specific report
     */
    public function generate(string $reportType, string $dateFrom, string $dateTo, array $filters = []): array
    {
        return match ($reportType) {
            'profit_loss' => $this->profitLossReport($dateFrom, $dateTo),
            'receivables_aging' => $this->receivablesAgingReport(),
            'payables_aging' => $this->payablesAgingReport(),
            'sales_summary' => $this->salesSummaryReport($dateFrom, $dateTo),
            'purchase_summary' => $this->purchaseSummaryReport($dateFrom, $dateTo),
            'tax_summary' => $this->taxSummaryReport($dateFrom, $dateTo),
            'attendance_summary' => $this->attendanceSummaryReport($dateFrom, $dateTo),
            'leave_balance' => $this->leaveBalanceReport(),
            'headcount' => $this->headcountReport(),
            'employee_turnover' => $this->employeeTurnoverReport($dateFrom, $dateTo),
            'lead_funnel' => $this->leadFunnelReport($dateFrom, $dateTo),
            'deal_pipeline' => $this->dealPipelineReport(),
            'lead_source' => $this->leadSourceReport($dateFrom, $dateTo),
            'project_status' => $this->projectStatusReport(),
            'task_productivity' => $this->taskProductivityReport($dateFrom, $dateTo),
            'overdue_tasks' => $this->overdueTasksReport(),
            'daily_sales' => $this->dailySalesReport($dateFrom, $dateTo),
            'top_products' => $this->topProductsReport($dateFrom, $dateTo),
            'subscription_analytics' => $this->subscriptionAnalyticsReport($dateFrom, $dateTo),
            'company_growth' => $this->companyGrowthReport($dateFrom, $dateTo),
            'revenue_breakdown' => $this->revenueBreakdownReport($dateFrom, $dateTo),
            default => ['title' => 'Unknown Report', 'columns' => [], 'rows' => [], 'summary' => []],
        };
    }

    // ═══════════════════════════════════════════════════════════════════
    // FINANCIAL REPORTS
    // ═══════════════════════════════════════════════════════════════════

    private function profitLossReport(string $dateFrom, string $dateTo): array
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $monthSelect = $isSqlite ? "CAST(strftime('%m', invoice_date) AS INTEGER) as month" : "MONTH(invoice_date) as month";

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

    // ═══════════════════════════════════════════════════════════════════
    // HRM REPORTS
    // ═══════════════════════════════════════════════════════════════════

    private function attendanceSummaryReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Hrm\Models\Attendance::class)) return $this->emptyReport('Attendance Summary');

        $data = \Noble\Hrm\Models\Attendance::where('created_by', $this->companyId)
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->join('employees', 'attendances.employee_id', '=', 'employees.id')
            ->selectRaw('employees.name, attendances.status, COUNT(*) as count')
            ->groupBy('employees.name', 'attendances.status')
            ->get();

        $employees = $data->groupBy('name')->map(function ($items, $name) {
            $present = $items->firstWhere('status', 'Present');
            $absent = $items->firstWhere('status', 'Absent');
            $total = $items->sum('count');
            return [
                'employee' => $name,
                'present' => $present->count ?? 0,
                'absent' => $absent->count ?? 0,
                'total_days' => $total,
                'rate' => $total > 0 ? round((($present->count ?? 0) / $total) * 100, 1) : 0,
            ];
        })->values()->toArray();

        return [
            'title' => 'Attendance Summary',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'text'],
                ['key' => 'present', 'label' => 'Present', 'type' => 'number'],
                ['key' => 'absent', 'label' => 'Absent', 'type' => 'number'],
                ['key' => 'total_days', 'label' => 'Total Days', 'type' => 'number'],
                ['key' => 'rate', 'label' => 'Attendance %', 'type' => 'percentage'],
            ],
            'rows' => $employees,
            'summary' => [
                ['label' => 'Employees', 'value' => count($employees), 'type' => 'number'],
                ['label' => 'Avg Attendance', 'value' => count($employees) > 0 ? round(collect($employees)->avg('rate'), 1) : 0, 'type' => 'percentage'],
            ],
        ];
    }

    private function leaveBalanceReport(): array
    {
        if (!class_exists(\Noble\Hrm\Models\LeaveApplication::class)) return $this->emptyReport('Leave Balance');

        $data = \Noble\Hrm\Models\LeaveApplication::where('leave_applications.created_by', $this->companyId)
            ->join('employees', 'leave_applications.employee_id', '=', 'employees.id')
            ->selectRaw('employees.name, leave_applications.status, COUNT(*) as count')
            ->groupBy('employees.name', 'leave_applications.status')
            ->get();

        $rows = $data->groupBy('name')->map(function ($items, $name) {
            return [
                'employee' => $name,
                'approved' => $items->firstWhere('status', 'Approved')->count ?? 0,
                'pending' => $items->firstWhere('status', 'Pending')->count ?? 0,
                'rejected' => $items->firstWhere('status', 'Rejected')->count ?? 0,
                'total' => $items->sum('count'),
            ];
        })->values()->toArray();

        return [
            'title' => 'Leave Balance Report',
            'columns' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'text'],
                ['key' => 'approved', 'label' => 'Approved', 'type' => 'number'],
                ['key' => 'pending', 'label' => 'Pending', 'type' => 'number'],
                ['key' => 'rejected', 'label' => 'Rejected', 'type' => 'number'],
                ['key' => 'total', 'label' => 'Total Requests', 'type' => 'number'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Employees', 'value' => count($rows), 'type' => 'number'],
                ['label' => 'Pending Requests', 'value' => collect($rows)->sum('pending'), 'type' => 'number', 'highlight' => true],
            ],
        ];
    }

    private function headcountReport(): array
    {
        if (!class_exists(\Noble\Hrm\Models\Employee::class)) return $this->emptyReport('Headcount');

        $query = \Noble\Hrm\Models\Employee::where('employees.created_by', $this->companyId);

        $byDepartment = (clone $query)
            ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
            ->selectRaw('departments.department_name as department, COUNT(employees.id) as count')
            ->groupBy('departments.department_name')->get();

        return [
            'title' => 'Headcount Report',
            'columns' => [
                ['key' => 'department', 'label' => 'Department', 'type' => 'text'],
                ['key' => 'count', 'label' => 'Employees', 'type' => 'number'],
            ],
            'rows' => $byDepartment->map(fn($d) => ['department' => $d->department ?? 'Unassigned', 'count' => $d->count])->toArray(),
            'summary' => [
                ['label' => 'Total Employees', 'value' => $byDepartment->sum('count'), 'type' => 'number', 'highlight' => true],
                ['label' => 'Departments', 'value' => $byDepartment->count(), 'type' => 'number'],
            ],
            'chartData' => $byDepartment->map(fn($d) => ['name' => $d->department ?? 'Unassigned', 'value' => $d->count])->toArray(),
            'chartType' => 'pie',
        ];
    }

    private function employeeTurnoverReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Hrm\Models\Employee::class)) return $this->emptyReport('Employee Turnover');

        $newHires = \Noble\Hrm\Models\Employee::where('created_by', $this->companyId)
            ->whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $total = \Noble\Hrm\Models\Employee::where('created_by', $this->companyId)->count();

        return [
            'title' => 'Employee Turnover Report',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'metric', 'label' => 'Metric', 'type' => 'text'],
                ['key' => 'value', 'label' => 'Value', 'type' => 'number'],
            ],
            'rows' => [
                ['metric' => 'New Hires', 'value' => $newHires],
                ['metric' => 'Total Employees', 'value' => $total],
                ['metric' => 'Growth Rate %', 'value' => $total > 0 ? round(($newHires / $total) * 100, 1) : 0],
            ],
            'summary' => [
                ['label' => 'New Hires', 'value' => $newHires, 'type' => 'number', 'highlight' => true],
                ['label' => 'Total Workforce', 'value' => $total, 'type' => 'number'],
            ],
        ];
    }

    // ═══════════════════════════════════════════════════════════════════
    // CRM REPORTS
    // ═══════════════════════════════════════════════════════════════════

    private function leadFunnelReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Lead\Models\Lead::class)) return $this->emptyReport('Lead Funnel');

        $data = \Noble\Lead\Models\Lead::where('leads.created_by', $this->companyId)
            ->leftJoin('lead_stages', 'leads.stage_id', '=', 'lead_stages.id')
            ->selectRaw('lead_stages.name as stage, COUNT(leads.id) as count')
            ->groupBy('lead_stages.name')->get();

        $totalLeads = $data->sum('count');

        return [
            'title' => 'Lead Funnel Analysis',
            'subtitle' => "$dateFrom to $dateTo",
            'columns' => [
                ['key' => 'stage', 'label' => 'Stage', 'type' => 'text'],
                ['key' => 'count', 'label' => 'Leads', 'type' => 'number'],
                ['key' => 'percentage', 'label' => '% of Total', 'type' => 'percentage'],
            ],
            'rows' => $data->map(fn($d) => [
                'stage' => $d->stage ?? 'Unknown',
                'count' => $d->count,
                'percentage' => $totalLeads > 0 ? round(($d->count / $totalLeads) * 100, 1) : 0,
            ])->toArray(),
            'summary' => [
                ['label' => 'Total Leads', 'value' => $totalLeads, 'type' => 'number', 'highlight' => true],
            ],
            'chartData' => $data->map(fn($d) => ['name' => $d->stage ?? 'Unknown', 'value' => $d->count])->toArray(),
            'chartType' => 'bar',
        ];
    }

    private function dealPipelineReport(): array
    {
        if (!class_exists(\Noble\Lead\Models\Deal::class)) return $this->emptyReport('Deal Pipeline');

        $data = \Noble\Lead\Models\Deal::where('deals.created_by', $this->companyId)
            ->selectRaw('status, COUNT(*) as count, SUM(price) as total_value')
            ->groupBy('status')->get();

        return [
            'title' => 'Deal Pipeline Report',
            'columns' => [
                ['key' => 'status', 'label' => 'Status', 'type' => 'badge'],
                ['key' => 'count', 'label' => 'Deals', 'type' => 'number'],
                ['key' => 'total_value', 'label' => 'Total Value', 'type' => 'currency'],
            ],
            'rows' => $data->map(fn($d) => ['status' => $d->status, 'count' => $d->count, 'total_value' => (float) $d->total_value])->toArray(),
            'summary' => [
                ['label' => 'Total Deals', 'value' => $data->sum('count'), 'type' => 'number'],
                ['label' => 'Pipeline Value', 'value' => (float) $data->sum('total_value'), 'type' => 'currency', 'highlight' => true],
            ],
        ];
    }

    private function leadSourceReport(string $dateFrom, string $dateTo): array
    {
        if (!class_exists(\Noble\Lead\Models\Lead::class)) return $this->emptyReport('Lead Source');

        $data = \Noble\Lead\Models\Lead::where('leads.created_by', $this->companyId)
            ->leftJoin('sources', 'leads.source_id', '=', 'sources.id')
            ->selectRaw('sources.name as source, COUNT(leads.id) as count')
            ->groupBy('sources.name')->get();

        return [
            'title' => 'Lead Source Analysis',
            'columns' => [
                ['key' => 'source', 'label' => 'Source', 'type' => 'text'],
                ['key' => 'count', 'label' => 'Leads', 'type' => 'number'],
            ],
            'rows' => $data->map(fn($d) => ['source' => $d->source ?? 'Unknown', 'count' => $d->count])->toArray(),
            'summary' => [
                ['label' => 'Total Sources', 'value' => $data->count(), 'type' => 'number'],
                ['label' => 'Total Leads', 'value' => $data->sum('count'), 'type' => 'number', 'highlight' => true],
            ],
            'chartData' => $data->map(fn($d) => ['name' => $d->source ?? 'Unknown', 'value' => $d->count])->toArray(),
            'chartType' => 'pie',
        ];
    }

    // ═══════════════════════════════════════════════════════════════════
    // PROJECT REPORTS
    // ═══════════════════════════════════════════════════════════════════

    private function projectStatusReport(): array
    {
        if (!class_exists(\Noble\Taskly\Models\Project::class)) return $this->emptyReport('Project Status');

        $projects = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->get(['id', 'name', 'status', 'start_date', 'end_date']);

        $rows = $projects->map(function ($p) {
            $taskTotal = 0;
            $taskDone = 0;
            if (class_exists(\Noble\Taskly\Models\ProjectTask::class)) {
                $taskTotal = \Noble\Taskly\Models\ProjectTask::where('project_id', $p->id)->count();
                $taskDone = 0; // is_complete column doesn't exist
            }
            return [
                'name' => $p->name,
                'status' => $p->status,
                'tasks' => $taskTotal,
                'completed' => $taskDone,
                'progress' => $taskTotal > 0 ? round(($taskDone / $taskTotal) * 100, 1) : 0,
                'start_date' => $p->start_date?->format('Y-m-d') ?? '—',
                'end_date' => $p->end_date?->format('Y-m-d') ?? '—',
            ];
        })->toArray();

        return [
            'title' => 'Project Status Report',
            'columns' => [
                ['key' => 'name', 'label' => 'Project', 'type' => 'text'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'badge'],
                ['key' => 'tasks', 'label' => 'Tasks', 'type' => 'number'],
                ['key' => 'completed', 'label' => 'Completed', 'type' => 'number'],
                ['key' => 'progress', 'label' => 'Progress %', 'type' => 'percentage'],
                ['key' => 'end_date', 'label' => 'Deadline', 'type' => 'date'],
            ],
            'rows' => $rows,
            'summary' => [
                ['label' => 'Total Projects', 'value' => count($rows), 'type' => 'number'],
                ['label' => 'Avg Progress', 'value' => count($rows) > 0 ? round(collect($rows)->avg('progress'), 1) : 0, 'type' => 'percentage', 'highlight' => true],
            ],
        ];
    }

    private function taskProductivityReport(string $dateFrom, string $dateTo): array
    {
        return $this->emptyReport('Task Productivity', 'Requires Taskly module data');
    }

    private function overdueTasksReport(): array
    {
        if (!class_exists(\Noble\Taskly\Models\ProjectTask::class)) return $this->emptyReport('Overdue Tasks');

        $projectIds = \Noble\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id');
        $tasks = collect([]); // Cannot query overdue tasks natively without end_date in project_tasks schema

        return [
            'title' => 'Overdue Tasks Report',
            'columns' => [
                ['key' => 'title', 'label' => 'Task', 'type' => 'text'],
                ['key' => 'project_name', 'label' => 'Project', 'type' => 'text'],
                ['key' => 'priority', 'label' => 'Priority', 'type' => 'badge'],
                ['key' => 'end_date', 'label' => 'Due Date', 'type' => 'date'],
                ['key' => 'days_overdue', 'label' => 'Days Overdue', 'type' => 'number'],
            ],
            'rows' => $tasks->map(fn($t) => [
                'title' => $t->title,
                'project_name' => $t->project_name,
                'priority' => $t->priority ?? 'medium',
                'end_date' => $t->end_date->format('Y-m-d'),
                'days_overdue' => now()->diffInDays($t->end_date),
            ])->toArray(),
            'summary' => [
                ['label' => 'Overdue Tasks', 'value' => $tasks->count(), 'type' => 'number', 'highlight' => true],
            ],
        ];
    }

    // ═══════════════════════════════════════════════════════════════════
    // POS / PLATFORM REPORTS — compact implementations
    // ═══════════════════════════════════════════════════════════════════

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
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $monthSelect = $isSqlite ? "CAST(strftime('%m', created_at) AS INTEGER) as month" : "MONTH(created_at) as month";

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
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $monthSelect = $isSqlite ? "CAST(strftime('%m', created_at) AS INTEGER) as month" : "MONTH(created_at) as month";

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

    // ═══════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════

    private function emptyReport(string $title, string $message = 'No data available'): array
    {
        return ['title' => $title, 'columns' => [], 'rows' => [], 'summary' => [['label' => 'Status', 'value' => $message, 'type' => 'text']]];
    }

    private function moduleAvailable(string $module): bool
    {
        if ($this->userType === 'superadmin') return false; // SuperAdmin has platform reports instead
        try {
            return function_exists('Module_is_active') && Module_is_active($module, $this->companyId);
        } catch (\Exception $e) {
            return false;
        }
    }
}


