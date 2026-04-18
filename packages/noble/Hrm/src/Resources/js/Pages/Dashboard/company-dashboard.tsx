import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, PieChart, BarChart } from '@/components/charts';
import CalendarView from '@/components/calendar-view';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Award,
    AlertTriangle,
    FileText,
    Building,
    Briefcase,
    CalendarDays,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    User as UserIcon,
    Activity,
    Shield,
    Target,
    Loader2,
} from 'lucide-react';
import { getImagePath, formatDate, formatTime, formatDateTime } from '@/utils/helpers';

interface DeferredData {
    department_distribution: Array<{
        name: string;
        value: number;
    }>;
    calendar_events: Array<{
        id: number;
        title: string;
        startDate: string;
        endDate: string;
        time: string;
        description: string;
        type: string;
        color: string;
    }>;
    recent_leave_applications: Array<{
        id: number;
        employee_name: string;
        leave_type: string;
        start_date: string;
        end_date: string;
        total_days: number;
        status: string;
        created_at: string;
    }>;
    recent_announcements: Array<{
        id: number;
        title: string;
        description: string;
        created_at: string;
    }>;
    employees_on_leave_today: Array<{
        name: string;
        leave_type: string;
        days: number;
        profile?: string;
    }>;
    employees_without_attendance: Array<{
        name: string;
        department: string;
        profile?: string;
    }>;
}

interface HrmProps {
    [key: string]: any;
    message: string;
    stats: {
        total_employees: number;
        present_today: number;
        absent_today: number;
        absent_yesterday: number;
        on_leave: number;
        pending_leaves: number;
        total_branches: number;
        total_departments: number;
        total_promotions: number;
        terminations: number;
    };
    deferredData?: DeferredData;
}

// Premium Skeleton Components
function StatCardSkeleton() {
    return (
        <div className="premium-card relative overflow-hidden p-6">
            <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}

function CalendarSkeleton() {
    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={`header-${i}`} className="h-8 rounded-lg" />
                ))}
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={`cell-${i}`} className="h-12 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

function ListSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl p-3">
                    <Skeleton className="h-11 w-11 flex-shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

function DistributionSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-5 w-12 rounded-lg" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            ))}
        </div>
    );
}

function DeferredLoadingOverlay() {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-background/5 backdrop-blur-[1px]">
            <div className="flex items-center gap-3 rounded-2xl border border-border/20 bg-background/80 px-5 py-2.5 shadow-xl">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Synchronizing…
                </span>
            </div>
        </div>
    );
}

export default function HrmIndex({ message, stats }: HrmProps) {
    const { t } = useTranslation();
    const { deferredData } = usePage<{ deferredData?: DeferredData }>().props;
    const isDeferred = !deferredData;

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('HRM Dashboard') }]}
            pageTitle={t('HR Overview')}
        >
            <Head title={t('HR Dashboard')} />

            <div className="space-y-8 pb-12">
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                    <div className="absolute end-0 top-0 p-8 opacity-10">
                        <Shield className="h-40 w-40 text-foreground" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                                {t('People Overview')}
                            </h2>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('Track workforce activity, leave requests, and payroll readiness from one place.')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge
                                variant="premium"
                                className="px-3 py-1 text-[10px] uppercase tracking-[.2em]"
                            >
                                {t('Live Data')}
                            </Badge>
                            <Badge
                                variant="premium"
                                className="px-3 py-1 text-[10px] uppercase tracking-[.2em]"
                            >
                                <Activity className="me-1 h-3 w-3 animate-pulse" />
                                {t('Updated')}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div
                        onClick={() => (window.location.href = route('hrm.employees.index'))}
                        className="group cursor-pointer"
                    >
                        <div className="premium-card relative overflow-hidden bg-gradient-to-br from-info/20 via-transparent to-transparent p-6 transition-all duration-500 hover:border-info/40">
                            <div className="absolute -bottom-6 -end-6 opacity-5 transition-opacity group-hover:opacity-10">
                                <Users className="h-24 w-24" />
                            </div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-info/20 text-info shadow-lg shadow-info/20 transition-transform group-hover:scale-110">
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                                    {t('Employees')}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight transition-colors group-hover:text-foreground">
                                    {stats.total_employees}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('Active employee records')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.attendances.index'))}
                        className="group cursor-pointer"
                    >
                        <div className="premium-card relative overflow-hidden bg-gradient-to-br from-success/20 via-transparent to-transparent p-6 transition-all duration-500 hover:border-success/40">
                            <div className="absolute -bottom-6 -end-6 opacity-5 transition-opacity group-hover:opacity-10">
                                <UserCheck className="h-24 w-24" />
                            </div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/20 text-success shadow-lg shadow-success/20 transition-transform group-hover:scale-110">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                                    {t('Present Today')}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black tracking-tight transition-colors group-hover:text-foreground">
                                        {stats.present_today}
                                    </h3>
                                    <span className="rounded-lg border border-success/20 bg-success/10 px-2 py-0.5 text-sm font-black text-success">
                                        {((stats.present_today / Math.max(1, stats.total_employees)) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('Attendance rate')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.attendances.index'))}
                        className="group cursor-pointer"
                    >
                        <div className="premium-card relative overflow-hidden bg-gradient-to-br from-destructive/20 via-transparent to-transparent p-6 transition-all duration-500 hover:border-destructive/40">
                            <div className="absolute -bottom-6 -end-6 opacity-5 transition-opacity group-hover:opacity-10">
                                <UserX className="h-24 w-24" />
                            </div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/20 text-destructive shadow-lg shadow-destructive/20 transition-transform group-hover:scale-110">
                                    <UserX className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-destructive">
                                    {t('Absent Today')}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight transition-colors group-hover:text-destructive">
                                    {stats.absent_today}
                                </h3>
                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-destructive">
                                    {stats.absent_today > stats.absent_yesterday ? (
                                        <ArrowUpRight className="me-1 h-3 w-3" />
                                    ) : (
                                        <ArrowDownRight className="me-1 h-3 w-3" />
                                    )}
                                    <span>
                                        {Math.abs(stats.absent_today - stats.absent_yesterday)}{' '}
                                        {t('vs yesterday')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.leave-applications.index'))}
                        className="group cursor-pointer"
                    >
                        <div className="premium-card relative overflow-hidden bg-gradient-to-br from-warning/20 via-transparent to-transparent p-6 transition-all duration-500 hover:border-warning/40">
                            <div className="absolute -bottom-6 -end-6 opacity-5 transition-opacity group-hover:opacity-10">
                                <Clock className="h-24 w-24" />
                            </div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/20 text-warning shadow-lg shadow-warning/20 transition-transform group-hover:scale-110">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-warning">
                                    {t('On Leave')}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight transition-colors group-hover:text-warning">
                                    {stats.on_leave}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {stats.pending_leaves} {t('Pending requests')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div className="premium-card relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                            <div className="pointer-events-none absolute end-0 top-0 p-12 opacity-[0.02]">
                                <Target className="h-64 w-64" />
                            </div>
                            <div className="relative z-10 mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/10 text-foreground shadow-inner">
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">
                                        {t('Upcoming Calendar')}
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-xl border-border/40 bg-card/50 px-4 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        {t('Export')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 rounded-xl border-border/40 bg-card/50 px-4 text-[10px] font-black uppercase tracking-widest"
                                        onClick={() => (window.location.href = route('hrm.calendar.index'))}
                                    >
                                        {t('Open Calendar')}
                                    </Button>
                                </div>
                            </div>
                            <div className="relative z-10 min-h-[450px] flex-1">
                                {isDeferred ? (
                                    <CalendarSkeleton />
                                ) : (
                                    <CalendarView events={deferredData?.calendar_events || []} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:col-span-4">
                        <div className="premium-card relative flex h-full flex-col overflow-hidden border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                            <div className="pointer-events-none absolute -end-12 -top-12 rotate-12 p-12 opacity-[0.03]">
                                <Building className="h-64 w-64" />
                            </div>
                            <h3 className="relative z-10 mb-8 flex items-center gap-3 text-lg font-black uppercase tracking-tight">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground">
                                    <Building className="h-5 w-5" />
                                </div>
                                {t('Department Distribution')}
                            </h3>
                            <div className="custom-scrollbar relative z-10 flex-1 space-y-6 overflow-y-auto px-1 pe-2">
                                {isDeferred ? (
                                    <DistributionSkeleton />
                                ) : (
                                    deferredData?.department_distribution?.map((dept, index) => {
                                        const maxValue = Math.max(
                                            ...(deferredData?.department_distribution?.map((d) => d.value) || [1])
                                        );
                                        const percentage = (dept.value / Math.max(1, maxValue)) * 100;
                                        return (
                                            <div key={index} className="group space-y-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all duration-300 group-hover:tracking-[0.15em] group-hover:text-foreground">
                                                            {dept.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-sm font-black text-foreground">{dept.value}</span>
                                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-40">{t('Employees')}</span>
                                                    </div>
                                                </div>
                                                <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-border/20 bg-card/40 shadow-inner">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary shadow-[0_0_15px_rgba(var(--primary),0.4)] transition-all duration-1000 ease-out"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="relative z-10 mt-8 border-t border-white/5 pt-6">
                                <div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/20 text-foreground">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-bold">{t('Departments')}</span>
                                    </div>
                                    <span className="text-xl font-black tracking-tighter text-foreground">
                                        {stats.total_departments}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="premium-card group relative overflow-hidden border border-border/20 bg-card/60 p-6 backdrop-blur-xl">
                            <div className="absolute end-0 top-0 p-4 opacity-[0.05] transition-transform duration-700 group-hover:scale-110">
                                <AlertTriangle className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <h3 className="relative z-10 mb-6 flex items-center gap-3 text-lg font-black uppercase tracking-tight">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-foreground/20 text-muted-foreground shadow-inner">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                {t('Recent Announcements')}
                            </h3>
                            <div className="relative z-10 space-y-4">
                                {isDeferred ? (
                                    <ListSkeleton count={3} />
                                ) : (
                                    deferredData?.recent_announcements?.slice(0, 3)?.map((ann, idx) => (
                                        <div
                                            key={idx}
                                            className="group/item flex items-start gap-4 rounded-2xl border border-border/20 bg-card/50 p-3 transition-all hover:border-border/40 hover:bg-card/80"
                                        >
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-muted-foreground/10 text-muted-foreground transition-colors duration-300 group-hover/item:bg-muted-foreground group-hover/item:text-black">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="mb-0.5 text-[9px] font-black uppercase tracking-[.1em] text-muted-foreground/80">
                                                    {formatDate(ann.created_at)}
                                                </p>
                                                <h4 className="line-clamp-1 text-xs font-bold uppercase leading-tight transition-colors group-hover/item:text-muted-foreground">
                                                    {ann.title}
                                                </h4>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                className="mt-4 h-9 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-muted-foreground/10 hover:text-muted-foreground"
                            >
                                {t('View Announcements')}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="premium-card relative overflow-hidden border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                        <div className="pointer-events-none absolute bottom-0 end-0 p-8 opacity-[0.02]">
                            <Clock className="h-40 w-40" />
                        </div>
                        <div className="relative z-10 mb-8 flex items-center justify-between">
                            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground shadow-inner">
                                    <Clock className="h-5 w-5" />
                                </div>
                                {t('Employees on Leave')}
                            </h3>
                            <Badge
                                variant="outline"
                                className="border-foreground/20 bg-foreground/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm shadow-black/20"
                            >
                                {deferredData?.employees_on_leave_today?.length || 0} {t('Active requests')}
                            </Badge>
                        </div>
                        <div className="custom-scrollbar relative z-10 grid max-h-[400px] grid-cols-1 gap-3 overflow-y-auto pe-2">
                            {isDeferred ? (
                                <ListSkeleton count={4} />
                            ) : deferredData?.employees_on_leave_today?.length ? (
                                deferredData.employees_on_leave_today.map((emp, i) => (
                                    <div
                                        key={i}
                                        className="geist-surface group flex items-center justify-between bg-background/50 p-3 transition-all duration-300 hover:border-foreground/40 hover:bg-card/40"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-foreground/20 p-0.5 transition-colors group-hover:border-foreground/30">
                                                <img
                                                    src={getImagePath(emp.profile || 'avatar.png')}
                                                    className="h-full w-full rounded-lg object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight transition-colors group-hover:text-foreground">
                                                    {emp.name}
                                                </p>
                                                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
                                                    {emp.leave_type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Badge
                                                variant="outline"
                                                className="border-foreground/20 bg-foreground/10 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-foreground"
                                            >
                                                {emp.days} {t('Days remaining')}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="relative z-10 py-20 text-center text-muted-foreground">
                                    <UserCheck className="mx-auto mb-4 h-16 w-16 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
                                        {t('No employees are currently on leave')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="premium-card group relative overflow-hidden border border-border/30 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6 backdrop-blur-xl">
                        <div className="pointer-events-none absolute -end-12 -top-12 rotate-[-15deg] p-12 opacity-[0.03] transition-transform duration-700 group-hover:scale-110">
                            <Briefcase className="h-64 w-64 text-foreground" />
                        </div>
                        <h3 className="relative z-10 mb-8 flex items-center gap-3 text-lg font-black uppercase tracking-tight text-foreground">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/20 text-foreground shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                                <Briefcase className="h-4 w-4" />
                            </div>
                            {t('Quick Actions')}
                        </h3>
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            {[
                                {
                                    icon: Users,
                                    label: t('Add Employee'),
                                    route: 'hrm.employees.create',
                                    color: 'text-foreground',
                                },
                                {
                                    icon: Clock,
                                    label: t('Attendance'),
                                    route: 'hrm.attendances.index',
                                    color: 'text-foreground',
                                },
                                {
                                    icon: Calendar,
                                    label: t('Leave Requests'),
                                    route: 'hrm.leave-applications.index',
                                    color: 'text-muted-foreground',
                                },
                                {
                                    icon: CreditCard,
                                    label: t('Payroll'),
                                    route: 'hrm.payrolls.index',
                                    color: 'text-foreground',
                                },
                                {
                                    icon: TrendingUp,
                                    label: t('Promotions'),
                                    route: 'hrm.promotions.index',
                                    color: 'text-destructive',
                                },
                                {
                                    icon: AlertTriangle,
                                    label: t('Warnings'),
                                    route: 'hrm.warnings.index',
                                    color: 'text-foreground',
                                },
                            ]?.map((action, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="group flex h-auto flex-col gap-3 rounded-2xl border-white/10 bg-card/5 py-5 shadow-lg transition-all duration-300 hover:border-foreground/50 hover:bg-foreground/20 hover:shadow-primary/10"
                                    onClick={() => (window.location.href = route(action.route))}
                                >
                                    <div
                                        className={`rounded-xl border border-white/5 bg-background/50 p-2 transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-background/80 ${action.color}`}
                                    >
                                        <action.icon className="h-5 w-5 transition-transform group-hover:scale-125" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {action.label}
                                    </span>
                                </Button>
                            ))}
                        </div>

                        <div className="relative z-10 mt-8 border-t border-white/5 pt-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-foreground" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Branches')}: {stats.total_branches}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3 animate-pulse text-foreground" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Pending leave requests')}: {stats.pending_leaves}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
