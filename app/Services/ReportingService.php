<?php

namespace App\Services;

use App\Models\User;
use App\Traits\FinancialReportingTrait;
use App\Traits\HrmReportingTrait;
use App\Traits\CrmReportingTrait;
use App\Traits\ProjectReportingTrait;
use App\Traits\PlatformReportingTrait;

/**
 * ReportingService
 *
 * Centralized reporting engine for Noble Architecture.
 * Generates structured report data from any module.
 * Module-aware: checks class_exists() and Schema before querying.
 */
class ReportingService
{
    use FinancialReportingTrait, 
        HrmReportingTrait, 
        CrmReportingTrait, 
        ProjectReportingTrait, 
        PlatformReportingTrait;

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

    private function emptyReport(string $title, string $message = 'No data available'): array
    {
        return ['title' => $title, 'columns' => [], 'rows' => [], 'summary' => [['label' => 'Status', 'value' => $message, 'type' => 'text']]];
    }

    private function moduleAvailable(string $module): bool
    {
        if ($this->userType === 'superadmin') return false; 
        try {
            return function_exists('Module_is_active') && Module_is_active($module, $this->companyId);
        } catch (\Exception $e) {
            return false;
        }
    }
}
