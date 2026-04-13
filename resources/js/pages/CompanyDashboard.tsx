import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, PieChart } from '@/components/charts';
import { formatCurrency } from '@/utils/helpers';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Receipt,
    ShoppingCart,
    FileText,
    Users,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Briefcase,
    Target,
    Zap,
    Calendar,
    Activity,
    PieChartIcon,
    UserCheck,
    UserX,
    Cake,
    BarChart3,
    RefreshCw,
} from 'lucide-react';

// ==================== TYPES ====================
interface FinancialKPIs {
    total_receivable: number;
    total_payable: number;
    net_balance: number;
    sales_this_month: number;
    purchases_this_month: number;
    overdue_invoices: number;
    pending_proposals: number;
    revenue_this_month: number;
    expense_this_month: number;
    profit_this_month: number;
    sales_growth: number;
}

interface HrmKPIs {
    total_employees: number;
    present_today: number;
    absent_today: number;
    attendance_rate: number;
    pending_leaves: number;
    departments: { name: string; count: number }[];
    upcoming_birthdays: { id: number; name: string; date_of_birth: string }[];
}

interface CrmKPIs {
    total_leads: number;
    new_leads_this_month: number;
    converted_leads: number;
    active_leads: number;
    conversion_rate: number;
    total_deals: number;
    deals_value: number;
    pipeline: { name: string; count: number }[];
}

interface ProjectKPIs {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    total_bugs: number;
    task_completion_rate: number;
}

interface PosKPIs {
    total_transactions: number;
    transactions_today: number;
    revenue_today: number;
    revenue_this_month: number;
}

interface SupportKPIs {
    open_tickets: number;
    total_tickets: number;
    resolution_rate: number;
}

interface CashflowData {
    month: string;
    income: number;
    expense: number;
    net: number;
}

interface ActivityItem {
    type: string;
    label: string;
    amount?: number;
    status: string;
    date: string;
}

interface UpcomingEvent {
    type: string;
    title: string;
    amount?: number;
    date: string;
    urgency: string;
}

interface Props {
    financial: FinancialKPIs;
    hrm: HrmKPIs | null;
    crm: CrmKPIs | null;
    project: ProjectKPIs | null;
    pos: PosKPIs | null;
    support: SupportKPIs | null;
    cashflow: CashflowData[];
    recentActivity: ActivityItem[];
    upcomingEvents: UpcomingEvent[];
    activeModules: string[];
}

// ==================== HELPER COMPONENTS ====================
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    index = 0,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: string;
    index?: number;
}) {
    return (
        <div
            className="premium-card group p-4 duration-500 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{title}</p>
                    <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
                    {subtitle && <p className="text-[10px] font-medium italic text-muted-foreground/60">{subtitle}</p>}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-foreground/5 transition-colors">
                    <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                </div>
            </div>
            {trend && trendValue && (
                <div
                    className={`mt-2 flex items-center gap-1.5 text-[10px] font-bold ${trend === 'up' ? 'text-foreground' : trend === 'down' ? 'text-muted-foreground' : 'text-muted-foreground'}`}
                >
                    <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${trend === 'up' ? 'bg-foreground/5' : 'bg-muted'}`}
                    >
                        {trend === 'up' ? (
                            <ArrowUpRight className="h-2.5 w-2.5" />
                        ) : (
                            <ArrowDownRight className="h-2.5 w-2.5" />
                        )}
                    </div>
                    {trendValue}
                </div>
            )}
        </div>
    );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: any; color?: string }) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-foreground/5">
                <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
    );
}

// ==================== MAIN COMPONENT ====================
export default function CompanyDashboard({
    financial,
    hrm,
    crm,
    project,
    pos,
    support,
    cashflow,
    recentActivity,
    upcomingEvents,
    activeModules,
}: Props) {
    const { t } = useTranslation();

    const handleRefresh = () => {
        router.post(
            route('dashboard.cache.clear'),
            {},
            {
                preserveState: false,
                onSuccess: () => router.reload(),
            }
        );
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Dashboard') }]} pageTitle={t('Dashboard')}>
            <Head title={t('Dashboard')} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{t('Business Overview')}</h1>
                        <p className="text-sm text-muted-foreground">{t('Real-time insights across all modules')}</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        {t('Refresh')}
                    </button>
                </div>

                {/* ============ FINANCIAL KPIs ============ */}
                <div>
                    <SectionHeader
                        title={t('Financial Overview')}
                        icon={DollarSign}
                        color="from-foreground/5 to-foreground/10"
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        <StatCard
                            index={0}
                            title={t('Net Balance')}
                            value={formatCurrency(financial.net_balance)}
                            icon={DollarSign}
                            color={financial.net_balance >= 0 ? 'success' : 'danger'}
                            trend={financial.net_balance >= 0 ? 'up' : 'down'}
                            trendValue={financial.net_balance >= 0 ? t('Positive') : t('Negative')}
                        />
                        <StatCard
                            index={1}
                            title={t('Sales This Month')}
                            value={formatCurrency(financial.sales_this_month)}
                            icon={TrendingUp}
                            color="primary"
                            trend={financial.sales_growth >= 0 ? 'up' : 'down'}
                            trendValue={`${financial.sales_growth}% ${t('vs last month')}`}
                        />
                        <StatCard
                            index={2}
                            title={t('Receivable')}
                            value={formatCurrency(financial.total_receivable)}
                            subtitle={`${financial.overdue_invoices} ${t('overdue')}`}
                            icon={Receipt}
                            color={financial.overdue_invoices > 0 ? 'warning' : 'success'}
                        />
                        <StatCard
                            index={3}
                            title={t('Revenue')}
                            value={formatCurrency(financial.revenue_this_month)}
                            icon={Activity}
                            color="purple"
                        />
                        <StatCard
                            index={4}
                            title={t('Profit')}
                            value={formatCurrency(financial.profit_this_month)}
                            icon={Target}
                            color="cyan"
                        />
                    </div>
                </div>

                {/* ============ SMART INSIGHTS ============ */}
                <div className="relative rounded-2xl border border-border bg-card p-1">
                    <div className="rounded-[calc(1rem-4px)] bg-card/40 p-5 backdrop-blur-3xl">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="mb-1 text-lg font-bold leading-none text-foreground">
                                    {t('Smart Strategic Insights')}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {t('AI-assisted business intelligence from across all modules')}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {crm && (
                                <div className="space-y-3 rounded-xl border border-white/5 bg-card/5 p-4 transition-colors hover:bg-card/10">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{t('Sales Efficiency')}</span>
                                        <span className="font-bold text-foreground">{crm.conversion_rate}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                                        <div
                                            className="h-full rounded-full bg-foreground"
                                            style={{ width: `${crm.conversion_rate}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] italic leading-tight text-muted-foreground">
                                        {crm.conversion_rate > 20
                                            ? t('Higher than industry average. Scale lead generation.')
                                            : t('Focus on lead nurturing to improve ROI.')}
                                    </p>
                                </div>
                            )}

                            {hrm && (
                                <div className="space-y-3 rounded-xl border border-white/5 bg-card/5 p-4 transition-colors hover:bg-card/10">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{t('Operational Intensity')}</span>
                                        <span className="font-bold text-foreground">{hrm.attendance_rate}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                                        <div
                                            className="h-full rounded-full bg-foreground/70"
                                            style={{ width: `${hrm.attendance_rate}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] italic leading-tight text-muted-foreground">
                                        {hrm.attendance_rate > 90
                                            ? t('Optimal workforce participation. Performance levels stable.')
                                            : t('Monitor attendance trends to stabilize operations.')}
                                    </p>
                                </div>
                            )}

                            {project && (
                                <div className="space-y-3 rounded-xl border border-white/5 bg-card/5 p-4 transition-colors hover:bg-card/10">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{t('Execution Quality')}</span>
                                        <span className="font-bold text-foreground">
                                            {project.task_completion_rate}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                                        <div
                                            className="h-full rounded-full bg-foreground/60"
                                            style={{ width: `${project.task_completion_rate}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] italic leading-tight text-muted-foreground">
                                        {project.task_completion_rate > 80
                                            ? t('Velocity is high. Team delivering consistent results.')
                                            : t('Check blockage in active projects to maintain velocity.')}
                                    </p>
                                </div>
                            )}

                            {financial && (
                                <div className="space-y-3 rounded-xl border border-white/5 bg-card/5 p-4 transition-colors hover:bg-card/10">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{t('Financial Growth')}</span>
                                        <span
                                            className={`font-bold ${financial.sales_growth >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            {financial.sales_growth}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                                        <div
                                            className={`h-full ${financial.sales_growth >= 0 ? 'bg-foreground/70' : 'bg-muted-foreground'} rounded-full`}
                                            style={{ width: `${Math.min(Math.abs(financial.sales_growth), 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] italic leading-tight text-muted-foreground">
                                        {financial.sales_growth > 0
                                            ? t('Revenue trending up. Reinvest in growth modules.')
                                            : t('Review sales funnel to address current trajectory.')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============ CASHFLOW CHART ============ */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            {t('Cash Flow Trend')} — {new Date().getFullYear()}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AreaChart
                            data={cashflow}
                            dataKey="income"
                            height={280}
                            showTooltip={true}
                            showGrid={true}
                            showLegend={true}
                            xAxisKey="month"
                            areas={[
                                { dataKey: 'income', color: 'hsl(var(--foreground))', name: t('Income') },
                                { dataKey: 'expense', color: 'hsl(var(--muted-foreground))', name: t('Expense') },
                                { dataKey: 'net', color: 'hsl(var(--foreground) / 0.4)', name: t('Net') },
                            ]}
                        />
                    </CardContent>
                </Card>

                {/* ============ MODULE GRID ============ */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* HRM MODULE */}
                    {hrm && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Users className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                    {t('Human Resources')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-foreground">{hrm.total_employees}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('Employees')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <UserCheck className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                                            <span className="text-xl font-bold text-foreground">
                                                {hrm.present_today}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Present Today')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <UserX className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                            <span className="text-xl font-bold text-muted-foreground">
                                                {hrm.absent_today}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Absent')}</div>
                                    </div>
                                </div>

                                {/* Attendance bar */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">{t('Attendance Rate')}</span>
                                        <span className="font-medium text-foreground">{hrm.attendance_rate}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-foreground transition-all"
                                            style={{ width: `${hrm.attendance_rate}%` }}
                                        />
                                    </div>
                                </div>

                                {hrm.pending_leaves > 0 && (
                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2 text-xs text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        {hrm.pending_leaves} {t('pending leave requests')}
                                    </div>
                                )}

                                {/* Department distribution */}
                                {hrm.departments.length > 0 && (
                                    <PieChart
                                        data={hrm.departments.map((d, i) => ({
                                            name: d.name,
                                            value: d.count,
                                            color: [
                                                'hsl(var(--foreground))',
                                                'hsl(var(--muted-foreground))',
                                                'hsl(var(--foreground) / 0.7)',
                                                'hsl(var(--foreground) / 0.5)',
                                                'hsl(var(--muted-foreground) / 0.8)',
                                                'hsl(var(--foreground) / 0.4)',
                                                'hsl(var(--muted-foreground) / 0.6)',
                                                'hsl(var(--foreground) / 0.3)',
                                            ][i % 8],
                                        }))}
                                        dataKey="value"
                                        nameKey="name"
                                        height={180}
                                        showTooltip={true}
                                        showLegend={true}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* CRM MODULE */}
                    {crm && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Target className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                    {t('CRM & Sales Pipeline')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg bg-muted p-3">
                                        <div className="text-xl font-bold text-foreground">{crm.total_leads}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('Total Leads')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3">
                                        <div className="text-xl font-bold text-foreground">{crm.conversion_rate}%</div>
                                        <div className="text-[10px] text-muted-foreground">{t('Conversion Rate')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3">
                                        <div className="text-xl font-bold text-foreground">
                                            {crm.new_leads_this_month}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('New This Month')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3">
                                        <div className="text-xl font-bold text-foreground">{crm.active_leads}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('Active Leads')}</div>
                                    </div>
                                </div>

                                {crm.deals_value > 0 && (
                                    <div className="rounded-lg border border-border bg-muted/50 p-3">
                                        <div className="text-xs text-muted-foreground">{t('Pipeline Value')}</div>
                                        <div className="text-lg font-bold text-foreground">
                                            {formatCurrency(crm.deals_value)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {crm.total_deals} {t('deals')}
                                        </div>
                                    </div>
                                )}

                                {/* Pipeline stages */}
                                {crm.pipeline.length > 0 && (
                                    <BarChart
                                        data={crm.pipeline}
                                        dataKey="count"
                                        height={180}
                                        showTooltip={true}
                                        xAxisKey="name"
                                        bars={[{ dataKey: 'count', color: 'hsl(var(--foreground))', name: t('Leads') }]}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* PROJECT MODULE */}
                    {project && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                    {t('Projects & Tasks')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-foreground">
                                            {project.active_projects}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Active')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-foreground">
                                            {project.completed_projects}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Completed')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-muted-foreground">
                                            {project.total_bugs}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Bugs')}</div>
                                    </div>
                                </div>

                                {/* Task completion */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            {t('Task Progress')} ({project.completed_tasks}/{project.total_tasks})
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {project.task_completion_rate}%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-foreground transition-all"
                                            style={{ width: `${project.task_completion_rate}%` }}
                                        />
                                    </div>
                                </div>

                                {project.overdue_tasks > 0 && (
                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2 text-xs text-muted-foreground">
                                        <AlertTriangle className="h-4 w-4" />
                                        {project.overdue_tasks} {t('overdue tasks')}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* POS MODULE */}
                    {pos && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Zap className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                    {t('Point of Sale')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg bg-muted p-3">
                                        <div className="text-xl font-bold text-foreground">
                                            {pos.transactions_today}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Sales Today')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3">
                                        <div className="text-xl font-bold text-foreground">
                                            {formatCurrency(pos.revenue_today)}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Revenue Today')}</div>
                                    </div>
                                    <div className="col-span-2 rounded-lg border border-border bg-muted/30 p-3">
                                        <div className="text-xs text-muted-foreground">{t('Monthly Revenue')}</div>
                                        <div className="text-lg font-bold text-foreground">
                                            {formatCurrency(pos.revenue_this_month)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {pos.total_transactions} {t('total transactions')}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ============ BOTTOM ROW ============ */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* RECENT ACTIVITY */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Activity className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                {t('Recent Activity')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentActivity.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        {t('No recent activity')}
                                    </p>
                                ) : (
                                    recentActivity.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/30"
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted`}
                                            >
                                                {item.type === 'sales_invoice' ? (
                                                    <Receipt className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                                                ) : item.type === 'purchase_invoice' ? (
                                                    <ShoppingCart
                                                        className="h-4 w-4 text-foreground"
                                                        strokeWidth={1.5}
                                                    />
                                                ) : (
                                                    <FileText className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {item.label}
                                                    </span>
                                                    <span
                                                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                                            item.status === 'paid'
                                                                ? 'bg-muted text-foreground'
                                                                : item.status === 'overdue'
                                                                  ? 'bg-foreground/5 text-muted-foreground'
                                                                  : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(item.date).toLocaleDateString('en-GB', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </div>
                                            {item.amount !== undefined && (
                                                <div className="text-sm font-semibold text-foreground">
                                                    {formatCurrency(item.amount)}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* UPCOMING EVENTS & ALERTS */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                {t('Alerts & Upcoming')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {upcomingEvents.length === 0 ? (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <CheckCircle2
                                            className="mb-2 h-8 w-8 text-muted-foreground"
                                            strokeWidth={1.5}
                                        />
                                        <p className="text-sm text-muted-foreground">{t('All clear! No alerts.')}</p>
                                    </div>
                                ) : (
                                    upcomingEvents.map((event, idx) => (
                                        <div
                                            key={idx}
                                            className={`rounded-lg border p-3 ${
                                                event.urgency === 'high'
                                                    ? 'border-border bg-muted/50'
                                                    : event.urgency === 'medium'
                                                      ? 'border-border bg-muted/30'
                                                      : 'border-border'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle
                                                    className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground`}
                                                    strokeWidth={1.5}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-medium text-foreground">{event.title}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {new Date(event.date).toLocaleDateString('en-GB', {
                                                            month: 'short',
                                                            day: '2-digit',
                                                        })}
                                                        {event.amount ? ` — ${formatCurrency(event.amount)}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Support tickets summary */}
                                {support && (
                                    <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">{t('Support Tickets')}</span>
                                            <span className="font-medium text-foreground">
                                                {support.open_tickets} {t('open')}
                                            </span>
                                        </div>
                                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-foreground"
                                                style={{ width: `${support.resolution_rate}%` }}
                                            />
                                        </div>
                                        <div className="mt-1 text-[10px] text-muted-foreground">
                                            {support.resolution_rate}% {t('resolved')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Modules Footer */}
                <div className="rounded-xl border border-border bg-card p-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">{t('Active Modules')}:</span>
                        {activeModules.map((mod) => (
                            <span
                                key={mod}
                                className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground"
                            >
                                {mod}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
