<?php

namespace App\Services;

use App\Models\User;
use App\Models\Plan;
use App\Models\Order;
use App\Models\SalesInvoice;
use App\Models\PurchaseInvoice;
use App\Models\SalesProposal;
use App\Models\HelpdeskTicket;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * DashboardAggregationService
 *
 * Centralizes all dashboard metrics from across ALL modules.
 * Safely checks module availability before querying data.
 * Uses tenant-aware queries (created_by = company_id).
 * Applies caching to reduce database load.
 */
class DashboardAggregationService
{
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

            // Monthly revenue trend
            $orderData = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as count, SUM(price) as total')
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

            // Current month vs last month
            $currentMonthRevenue = Order::whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $currentMonth)->sum('price');
            $lastMonthRevenue = Order::whereYear('created_at', $lastMonth->year)
                ->whereMonth('created_at', $lastMonth->month)->sum('price');

            $revenueGrowth = $lastMonthRevenue > 0
                ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
                : ($currentMonthRevenue > 0 ? 100 : 0);

            // Companies growth
            $companiesThisMonth = User::where('type', 'company')
                ->whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $currentMonth)
                ->count();

            // Plan distribution
            $planDistribution = Plan::leftJoin('users', 'users.active_plan', '=', 'plans.id')
                ->where('users.type', 'company')
                ->select('plans.name', DB::raw('COUNT(users.id) as count'))
                ->groupBy('plans.name')
                ->get();

            // Recent orders
            $recentOrders = Order::with('user:id,name,email')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'order_id', 'name', 'plan_name', 'price', 'payment_status', 'payment_type', 'created_at', 'created_by']);

            return [
                'stats' => [
                    'total_revenue' => (float) Order::sum('price'),
                    'total_orders' => Order::count(),
                    'total_plans' => Plan::count(),
                    'total_companies' => User::where('type', 'company')->count(),
                    'total_users' => User::count(),
                    'active_companies' => User::where('type', 'company')->where('is_disable', 0)->count(),
                    'revenue_growth' => $revenueGrowth,
                    'new_companies_this_month' => $companiesThisMonth,
                ],
                'chartData' => $chartData,
                'planDistribution' => $planDistribution,
                'recentOrders' => $recentOrders,
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
                'cashflow' => $this->getCashflowChart(),
                'recentActivity' => $this->getRecentActivity(),
                'upcomingEvents' => $this->getUpcomingEvents(),
                'activeModules' => $this->activatedModules,
            ];
        });
    }

    // =========================================================================
    // FINANCIAL KPIs (Core + Account module)
    // =========================================================================
    private function getFinancialKPIs(): array
    {
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->subMonth()->endOfMonth();

        // Sales Invoices
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

        // Purchase Invoices
        $totalPayable = PurchaseInvoice::where('created_by', $this->companyId)
            ->where('status', '!=', 'paid')
            ->sum('balance_amount');

        $totalPurchasesThisMonth = PurchaseInvoice::where('created_by', $this->companyId)
            ->where('invoice_date', '>=', $currentMonth)
            ->sum('total_amount');

        // Account module Revenue/Expense (if available)
        $totalRevenue = 0;
        $totalExpense = 0;
        if ($this->moduleActive('Account')) {
            if (class_exists(\DionONE\Account\Models\Revenue::class) && Schema::hasTable('revenues')) {
                $totalRevenue = \DionONE\Account\Models\Revenue::where('created_by', $this->companyId)
                    ->where('revenue_date', '>=', $currentMonth)
                    ->sum('amount');
            }
            if (class_exists(\DionONE\Account\Models\Expense::class) && Schema::hasTable('expenses')) {
                $totalExpense = \DionONE\Account\Models\Expense::where('created_by', $this->companyId)
                    ->where('expense_date', '>=', $currentMonth)
                    ->sum('amount');
            }
        }

        // Proposals
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

    // =========================================================================
    // HRM KPIs (Hrm module)
    // =========================================================================
    private function getHrmKPIs(): ?array
    {
        if (!$this->moduleActive('Hrm')) return null;
        if (!class_exists(\DionONE\Hrm\Models\Employee::class)) return null;

        $today = now()->toDateString();

        $totalEmployees = \DionONE\Hrm\Models\Employee::where('created_by', $this->companyId)->count();

        // Today's attendance
        $presentToday = 0;
        $absentToday = 0;
        if (class_exists(\DionONE\Hrm\Models\Attendance::class) && Schema::hasTable('attendances')) {
            $presentToday = \DionONE\Hrm\Models\Attendance::where('created_by', $this->companyId)
                ->where('date', $today)
                ->where('status', 'Present')
                ->count();
            $absentToday = $totalEmployees - $presentToday;
        }

        // Pending leave requests
        $pendingLeaves = 0;
        if (class_exists(\DionONE\Hrm\Models\LeaveApplication::class) && Schema::hasTable('leave_applications')) {
            $pendingLeaves = \DionONE\Hrm\Models\LeaveApplication::where('created_by', $this->companyId)
                ->where('status', 'Pending')
                ->count();
        }

        // Department distribution
        $departmentStats = [];
        if (class_exists(\DionONE\Hrm\Models\Department::class) && Schema::hasTable('departments')) {
            $departmentStats = \DionONE\Hrm\Models\Employee::where('employees.created_by', $this->companyId)
                ->join('departments', 'employees.department_id', '=', 'departments.id')
                ->select('departments.department_name as name', DB::raw('COUNT(employees.id) as count'))
                ->groupBy('departments.department_name')
                ->orderByDesc('count')
                ->limit(8)
                ->get()
                ->toArray();
        }

        // Upcoming birthdays
        $upcomingBirthdays = [];
        if (Schema::hasColumn('employees', 'date_of_birth')) {
            $upcomingBirthdays = \DionONE\Hrm\Models\Employee::where('created_by', $this->companyId)
                ->whereNotNull('date_of_birth')
                ->whereRaw("DATE_FORMAT(date_of_birth, '%m-%d') BETWEEN DATE_FORMAT(NOW(), '%m-%d') AND DATE_FORMAT(NOW() + INTERVAL 30 DAY, '%m-%d')")
                ->with('user:id,name')
                ->limit(5)
                ->get(['id', 'user_id', 'date_of_birth'])
                ->toArray();
        }

        return [
            'total_employees' => $totalEmployees,
            'present_today' => $presentToday,
            'absent_today' => $absentToday,
            'attendance_rate' => $totalEmployees > 0 ? round(($presentToday / $totalEmployees) * 100, 1) : 0,
            'pending_leaves' => $pendingLeaves,
            'departments' => $departmentStats,
            'upcoming_birthdays' => $upcomingBirthdays,
        ];
    }

    // =========================================================================
    // CRM KPIs (Lead module)
    // =========================================================================
    private function getCrmKPIs(): ?array
    {
        if (!$this->moduleActive('Lead')) return null;
        if (!class_exists(\DionONE\Lead\Models\Lead::class)) return null;

        $currentMonth = now()->startOfMonth();

        $totalLeads = \DionONE\Lead\Models\Lead::where('created_by', $this->companyId)->count();
        $newLeadsThisMonth = \DionONE\Lead\Models\Lead::where('created_by', $this->companyId)
            ->where('created_at', '>=', $currentMonth)->count();
        $convertedLeads = \DionONE\Lead\Models\Lead::where('created_by', $this->companyId)
            ->where('is_converted', true)->count();
        $activeLeads = \DionONE\Lead\Models\Lead::where('created_by', $this->companyId)
            ->where('is_active', true)->count();

        // Deals (if available)
        $totalDeals = 0;
        $dealsValue = 0;
        if (class_exists(\DionONE\Lead\Models\Deal::class) && Schema::hasTable('deals')) {
            $totalDeals = \DionONE\Lead\Models\Deal::where('created_by', $this->companyId)->count();
            $dealsValue = \DionONE\Lead\Models\Deal::where('created_by', $this->companyId)->sum('price');
        }

        // Pipeline stages
        $pipelineData = [];
        if (class_exists(\DionONE\Lead\Models\LeadStage::class) && Schema::hasTable('lead_stages')) {
            $pipelineData = \DionONE\Lead\Models\Lead::where('leads.created_by', $this->companyId)
                ->join('lead_stages', 'leads.stage_id', '=', 'lead_stages.id')
                ->select('lead_stages.name', DB::raw('COUNT(leads.id) as count'))
                ->groupBy('lead_stages.name')
                ->get()
                ->toArray();
        }

        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;

        return [
            'total_leads' => $totalLeads,
            'new_leads_this_month' => $newLeadsThisMonth,
            'converted_leads' => $convertedLeads,
            'active_leads' => $activeLeads,
            'conversion_rate' => $conversionRate,
            'total_deals' => $totalDeals,
            'deals_value' => (float) $dealsValue,
            'pipeline' => $pipelineData,
        ];
    }

    // =========================================================================
    // PROJECT KPIs (Taskly module)
    // =========================================================================
    private function getProjectKPIs(): ?array
    {
        if (!$this->moduleActive('Taskly')) return null;
        if (!class_exists(\DionONE\Taskly\Models\Project::class)) return null;

        $totalProjects = \DionONE\Taskly\Models\Project::where('created_by', $this->companyId)->count();
        $activeProjects = \DionONE\Taskly\Models\Project::where('created_by', $this->companyId)
            ->where('status', 'active')->count();
        $completedProjects = \DionONE\Taskly\Models\Project::where('created_by', $this->companyId)
            ->where('status', 'completed')->count();

        // Tasks
        $totalTasks = 0;
        $completedTasks = 0;
        $overdueTasks = 0;
        if (class_exists(\DionONE\Taskly\Models\ProjectTask::class) && Schema::hasTable('project_tasks')) {
            $projectIds = \DionONE\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id');
            $totalTasks = \DionONE\Taskly\Models\ProjectTask::whereIn('project_id', $projectIds)->count();
            $completedTasks = 0; // Cannot easily calculate without stage knowledge
            $overdueTasks = 0; // project_tasks has no end_date or is_complete column
        }

        // Bugs
        $totalBugs = 0;
        if (class_exists(\DionONE\Taskly\Models\ProjectBug::class) && Schema::hasTable('project_bugs')) {
            $totalBugs = \DionONE\Taskly\Models\ProjectBug::whereIn('project_id',
                \DionONE\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id')
            )->count();
        }

        $taskCompletion = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;

        return [
            'total_projects' => $totalProjects,
            'active_projects' => $activeProjects,
            'completed_projects' => $completedProjects,
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'overdue_tasks' => $overdueTasks,
            'total_bugs' => $totalBugs,
            'task_completion_rate' => $taskCompletion,
        ];
    }

    // =========================================================================
    // POS KPIs (Pos module)
    // =========================================================================
    private function getPosKPIs(): ?array
    {
        if (!$this->moduleActive('Pos')) return null;
        if (!class_exists(\DionONE\Pos\Models\Pos::class) || !Schema::hasTable('pos')) return null;

        $currentMonth = now()->startOfMonth();

        $totalSales = \DionONE\Pos\Models\Pos::where('created_by', $this->companyId)->count();
        $salesToday = \DionONE\Pos\Models\Pos::where('created_by', $this->companyId)
            ->whereDate('created_at', today())->count();
        $revenueToday = \DionONE\Pos\Models\Pos::where('created_by', $this->companyId)
            ->whereDate('created_at', today())->sum('grand_total');
        $revenueThisMonth = \DionONE\Pos\Models\Pos::where('created_by', $this->companyId)
            ->where('created_at', '>=', $currentMonth)->sum('grand_total');

        return [
            'total_transactions' => $totalSales,
            'transactions_today' => $salesToday,
            'revenue_today' => (float) $revenueToday,
            'revenue_this_month' => (float) $revenueThisMonth,
        ];
    }

    // =========================================================================
    // SUPPORT KPIs (Helpdesk + SupportTicket)
    // =========================================================================
    private function getSupportKPIs(): ?array
    {
        // From core Helpdesk
        $openTickets = HelpdeskTicket::where('created_by', $this->companyId)
            ->where('status', 'open')->count();
        $totalTickets = HelpdeskTicket::where('created_by', $this->companyId)->count();

        // From SupportTicket module
        $moduleTickets = 0;
        if ($this->moduleActive('SupportTicket') && class_exists(\DionONE\SupportTicket\Models\Ticket::class) && Schema::hasTable('tickets')) {
            $moduleTickets = \DionONE\SupportTicket\Models\Ticket::where('created_by', $this->companyId)->count();
        }

        if ($totalTickets === 0 && $moduleTickets === 0) return null;

        return [
            'open_tickets' => $openTickets,
            'total_tickets' => $totalTickets + $moduleTickets,
            'resolution_rate' => $totalTickets > 0
                ? round((($totalTickets - $openTickets) / $totalTickets) * 100, 1)
                : 0,
        ];
    }

    // =========================================================================
    // CASHFLOW CHART (12-month trend)
    // =========================================================================
    private function getCashflowChart(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $year = now()->year;

        // Sales Invoice monthly data
        $salesData = SalesInvoice::where('created_by', $this->companyId)
            ->whereYear('invoice_date', $year)
            ->selectRaw('MONTH(invoice_date) as month, SUM(total_amount) as total')
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        // Purchase Invoice monthly data
        $purchaseData = PurchaseInvoice::where('created_by', $this->companyId)
            ->whereYear('invoice_date', $year)
            ->selectRaw('MONTH(invoice_date) as month, SUM(total_amount) as total')
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        // Revenue monthly data (Account module)
        $revenueData = collect();
        $expenseData = collect();
        if ($this->moduleActive('Account')) {
            if (class_exists(\DionONE\Account\Models\Revenue::class) && Schema::hasTable('revenues')) {
                $revenueData = \DionONE\Account\Models\Revenue::where('created_by', $this->companyId)
                    ->whereYear('revenue_date', $year)
                    ->selectRaw('MONTH(revenue_date) as month, SUM(amount) as total')
                    ->groupBy('month')
                    ->get()
                    ->keyBy('month');
            }
            if (class_exists(\DionONE\Account\Models\Expense::class) && Schema::hasTable('expenses')) {
                $expenseData = \DionONE\Account\Models\Expense::where('created_by', $this->companyId)
                    ->whereYear('expense_date', $year)
                    ->selectRaw('MONTH(expense_date) as month, SUM(amount) as total')
                    ->groupBy('month')
                    ->get()
                    ->keyBy('month');
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

    // =========================================================================
    // RECENT ACTIVITY (cross-module)
    // =========================================================================
    private function getRecentActivity(): array
    {
        $activities = [];

        // Recent sales invoices
        $recentSales = SalesInvoice::where('created_by', $this->companyId)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id', 'invoice_number', 'total_amount', 'status', 'created_at']);
        foreach ($recentSales as $sale) {
            $activities[] = [
                'type' => 'sales_invoice',
                'label' => $sale->invoice_number,
                'amount' => (float) $sale->total_amount,
                'status' => $sale->status,
                'date' => $sale->created_at->toISOString(),
            ];
        }

        // Recent purchase invoices
        $recentPurchases = PurchaseInvoice::where('created_by', $this->companyId)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get(['id', 'invoice_number', 'total_amount', 'status', 'created_at']);
        foreach ($recentPurchases as $purchase) {
            $activities[] = [
                'type' => 'purchase_invoice',
                'label' => $purchase->invoice_number,
                'amount' => (float) $purchase->total_amount,
                'status' => $purchase->status,
                'date' => $purchase->created_at->toISOString(),
            ];
        }

        // Recent proposals
        $recentProposals = SalesProposal::where('created_by', $this->companyId)
            ->orderByDesc('created_at')
            ->limit(2)
            ->get(['id', 'proposal_number', 'total_amount', 'status', 'created_at']);
        foreach ($recentProposals as $proposal) {
            $activities[] = [
                'type' => 'proposal',
                'label' => $proposal->proposal_number,
                'amount' => (float) $proposal->total_amount,
                'status' => $proposal->status,
                'date' => $proposal->created_at->toISOString(),
            ];
        }

        // Sort all activities by date
        usort($activities, fn($a, $b) => strcmp($b['date'], $a['date']));

        return array_slice($activities, 0, 8);
    }

    // =========================================================================
    // UPCOMING EVENTS (Calendar, Contracts, Tasks due)
    // =========================================================================
    private function getUpcomingEvents(): array
    {
        $events = [];

        // Overdue invoices
        $overdueInvoices = SalesInvoice::where('created_by', $this->companyId)
            ->where('due_date', '<', now())
            ->where('status', '!=', 'paid')
            ->orderBy('due_date')
            ->limit(3)
            ->get(['id', 'invoice_number', 'total_amount', 'due_date']);
        foreach ($overdueInvoices as $inv) {
            $events[] = [
                'type' => 'overdue_invoice',
                'title' => "Overdue: {$inv->invoice_number}",
                'amount' => (float) $inv->total_amount,
                'date' => $inv->due_date->toISOString(),
                'urgency' => 'high',
            ];
        }

        // Upcoming contract expirations
        if ($this->moduleActive('Contract') && class_exists(\DionONE\Contract\Models\Contract::class) && Schema::hasTable('contracts')) {
            $expiringContracts = \DionONE\Contract\Models\Contract::where('created_by', $this->companyId)
                ->where('end_date', '>=', now())
                ->where('end_date', '<=', now()->addDays(30))
                ->orderBy('end_date')
                ->limit(3)
                ->get(['id', 'subject', 'value', 'end_date']);
            foreach ($expiringContracts as $contract) {
                $events[] = [
                    'type' => 'contract_expiring',
                    'title' => "Contract: {$contract->subject}",
                    'amount' => (float) $contract->value,
                    'date' => $contract->end_date->toISOString(),
                    'urgency' => 'medium',
                ];
            }
        }

        // Overdue project tasks
        if ($this->moduleActive('Taskly') && class_exists(\DionONE\Taskly\Models\ProjectTask::class) && Schema::hasTable('project_tasks')) {
            $projectIds = \DionONE\Taskly\Models\Project::where('created_by', $this->companyId)->pluck('id');
            // 'end_date' and 'is_complete' do not exist in DionONE 'project_tasks' schema.
            // Tasks status is managed via 'stage_id' relations without built-in due dates.
            // Leaving as empty collection to prevent SQL error.
            $overdueTasks = [];
            // No foreach here since overdueTasks is always empty for now
        }

        usort($events, fn($a, $b) => strcmp($a['date'], $b['date']));

        return array_slice($events, 0, 6);
    }

    // =========================================================================
    // HELPERS
    // =========================================================================
    private function getActiveModules(): array
    {
        try {
            $user = User::find($this->companyId);
            if (!$user) return [];

            $modules = [];
            if (function_exists('ActivatedModule')) {
                $allModules = ['Account', 'Hrm', 'Lead', 'Taskly', 'Pos', 'Contract', 'Recruitment',
                    'Performance', 'Training', 'Timesheet', 'Goal', 'BudgetPlanner', 'DoubleEntry',
                    'Calendar', 'FormBuilder', 'Quotation', 'SupportTicket', 'ProductService'];

                foreach ($allModules as $mod) {
                    if (Module_is_active($mod, $this->companyId)) {
                        $modules[] = $mod;
                    }
                }
            }

            return $modules;
        } catch (\Exception $e) {
            return [];
        }
    }

    private function moduleActive(string $module): bool
    {
        return in_array($module, $this->activatedModules);
    }
}
