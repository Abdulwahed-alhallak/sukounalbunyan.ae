import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, PieChart, BarChart } from '@/components/charts';
import CalendarView from "@/components/calendar-view";
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
    Loader2
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
        <div className="premium-card p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
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
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl">
                    <Skeleton className="h-11 w-11 rounded-xl flex-shrink-0" />
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
                    <div className="flex justify-between items-center">
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
        <div className="absolute inset-0 flex items-center justify-center bg-background/5 backdrop-blur-[1px] rounded-3xl z-20">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-background/80 border border-border/20 shadow-xl">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing…</span>
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
            breadcrumbs={[{label: t('HRM Dashboard')}]}
            pageTitle={t('Personnel Strategic Dashboard')}
        >
            <Head title={t('HRM Mission Command')} />
            
            <div className="space-y-8 pb-12">
                {/* Tactical Alert Header/Banner if needed */}
                <div className="relative overflow-hidden p-6 rounded-3xl bg-foreground/10 border border-foreground/20 backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Shield className="h-40 w-40 text-foreground" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">{t('Personnel Intelligence Hub')}</h2>
                            <p className="text-muted-foreground text-sm font-medium">{t('Real-time synchronization across all operational sectors.')}</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="bg-muted/500/10 text-foreground border-foreground/30 uppercase text-[10px] font-black tracking-[.2em] px-3 py-1">
                                {t('Status: Nominal')}
                            </Badge>
                            <Badge variant="outline" className="bg-foreground/10 text-foreground border-foreground/30 uppercase text-[10px] font-black tracking-[.2em] px-3 py-1">
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                {t('Sync Active')}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Advanced Command Metrics Layer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => window.location.href = route('hrm.employees.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-muted/500/15 via-transparent to-transparent hover:border-foreground/40 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users className="h-24 w-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-muted/500/20 flex items-center justify-center text-foreground shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors uppercase">{t('Total Force')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight group-hover:text-foreground transition-colors">{stats.total_employees}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Registered Personnel')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div onClick={() => window.location.href = route('hrm.attendances.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/15 via-transparent to-transparent hover:border-foreground/40 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <UserCheck className="h-24 w-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-foreground/20 flex items-center justify-center text-foreground shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors uppercase">{t('Ready for Duty')}</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black tracking-tight group-hover:text-foreground transition-colors">{stats.present_today}</h3>
                                    <span className="text-sm font-black text-foreground px-2 py-0.5 rounded-lg bg-foreground/10 border border-foreground/20">
                                        {((stats.present_today / Math.max(1, stats.total_employees)) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Active Attendance Today')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div onClick={() => window.location.href = route('hrm.attendances.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/15 via-transparent to-transparent hover:border-destructive/40 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <UserX className="h-24 w-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-destructive/20 flex items-center justify-center text-destructive shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                                    <UserX className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-destructive transition-colors uppercase">{t('Missing Personnel')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight group-hover:text-destructive transition-colors">{stats.absent_today}</h3>
                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-destructive">
                                    {stats.absent_today > stats.absent_yesterday ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    <span>{Math.abs(stats.absent_today - stats.absent_yesterday)} {t('Delta from Yesterday')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div onClick={() => window.location.href = route('hrm.leave-applications.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/15 via-transparent to-transparent hover:border-border/40 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Clock className="h-24 w-24" />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-muted-foreground/20 flex items-center justify-center text-muted-foreground shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-muted-foreground transition-colors uppercase">{t('Field Absence')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight group-hover:text-muted-foreground transition-colors">{stats.on_leave}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stats.pending_leaves} {t('Pending Approval')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Force Distribution and Tactical Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Calendar - Mission Timeline */}
                    <div className="lg:col-span-8">
                        <div className="premium-card p-6 rounded-3xl h-full flex flex-col border border-white/5 bg-foreground/40 backdrop-blur-3xl overflow-hidden relative">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                <Target className="h-64 w-64" />
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground shadow-inner">
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tighter uppercase">{t('Mission Deployment Timeline')}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-card/5 text-[10px] font-black uppercase tracking-widest px-4 h-9">{t('Export Data')}</Button>
                                    <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-card/5 text-[10px] font-black uppercase tracking-widest px-4 h-9" onClick={() => window.location.href = route('hrm.calendar.index')}>{t('Full Timeline')}</Button>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[450px] relative z-10">
                                {isDeferred ? (
                                    <CalendarSkeleton />
                                ) : (
                                    <CalendarView
                                        events={deferredData?.calendar_events || []}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Department Strength Analysis */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="premium-card p-6 border-none flex flex-col h-full bg-foreground/40 backdrop-blur-3xl border border-white/5 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 p-12 opacity-[0.03] pointer-events-none rotate-12">
                                <Building className="h-64 w-64" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight uppercase mb-8 flex items-center gap-3 relative z-10">
                                <div className="h-8 w-8 rounded-lg bg-foreground/20 flex items-center justify-center text-foreground">
                                    <Building className="h-4 w-4" />
                                </div>
                                {t('Operational Sector Distribution')}
                            </h3>
                            <div className="space-y-6 flex-1 overflow-y-auto px-1 relative z-10 custom-scrollbar pr-2">
                                {isDeferred ? (
                                    <DistributionSkeleton />
                                ) : (
                                    deferredData?.department_distribution?.map((dept, index) => {
                                        const maxValue = Math.max(...(deferredData?.department_distribution?.map(d => d.value) || [1]));
                                        const percentage = (dept.value / Math.max(1, maxValue)) * 100;
                                        return (
                                            <div key={index} className="space-y-2 group">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{dept.name}</span>
                                                    </div>
                                                    <Badge variant="outline" className="bg-card/5 border-white/10 text-xs font-black px-3 py-0.5 rounded-lg">
                                                        {dept.value} <span className="ml-1 opacity-40">{t('Units')}</span>
                                                    </Badge>
                                                </div>
                                                <div className="h-2 w-full bg-card/5 rounded-full overflow-hidden border border-white/5">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.3)]" 
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                                <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-foreground/20 flex items-center justify-center text-foreground">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-bold">{t('Health Score')}</span>
                                    </div>
                                    <span className="text-xl font-black text-foreground tracking-tighter">94.2%</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Intelligence (Announcements) */}
                        <div className="premium-card p-6 bg-muted-foreground/5 border border-border/10 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
                                <AlertTriangle className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight uppercase mb-6 flex items-center gap-3 relative z-10">
                                <div className="h-8 w-8 rounded-lg bg-muted-foreground/20 flex items-center justify-center text-muted-foreground">
                                    <AlertTriangle className="h-4 w-4" />
                                </div>
                                {t('Strategic Intelligence Feed')}
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {isDeferred ? (
                                    <ListSkeleton count={3} />
                                ) : (
                                    deferredData?.recent_announcements?.slice(0, 3)?.map((ann, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-3 rounded-2xl bg-foreground/40 border border-white/5 flex items-start gap-4 transition-all hover:bg-foreground/60 hover:border-border/30 group/item"
                                        >
                                            <div className="h-9 w-9 rounded-xl bg-muted-foreground/10 flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover/item:bg-muted-foreground group-hover/item:text-black transition-colors duration-300">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground/80 mb-0.5 tracking-[.1em]">{formatDate(ann.created_at)}</p>
                                                <h4 className="text-xs font-bold leading-tight line-clamp-1 group-hover/item:text-muted-foreground transition-colors uppercase">{ann.title}</h4>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-muted-foreground hover:bg-muted-foreground/10 transition-all">
                                {t('View All Broadcasts')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Personnel Hub Areas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personnel on Leave - Dynamic Matrix */}
                    <div className="premium-card p-6 border border-white/5 bg-foreground/40 backdrop-blur-3xl overflow-hidden relative">
                         <div className="absolute bottom-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                            <Clock className="h-40 w-40" />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-lg font-black tracking-tight uppercase flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-foreground/20 flex items-center justify-center text-foreground">
                                    <Clock className="h-4 w-4" />
                                </div>
                                {t('Absent Operatives Matrix')}
                            </h3>
                            <Badge variant="outline" className="bg-foreground/10 text-foreground border-foreground/20 text-[10px] font-black">
                                {deferredData?.employees_on_leave_today?.length || 0} {t('Active Gaps')}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {isDeferred ? (
                                <ListSkeleton count={4} />
                            ) : deferredData?.employees_on_leave_today?.length ? (
                                deferredData.employees_on_leave_today.map((emp, i) => (
                                    <div key={i} className="group glass-effect-dark p-3 rounded-2xl flex items-center justify-between border border-white/5 hover:border-foreground/40 hover:bg-card/40 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-xl overflow-hidden border border-white/10 p-0.5 group-hover:border-foreground/30 transition-colors bg-foreground/20">
                                                <img src={getImagePath(emp.profile || 'avatar.png')} className="h-full w-full object-cover rounded-lg" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tight group-hover:text-foreground transition-colors uppercase">{emp.name}</p>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                                                    {emp.leave_type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="bg-foreground/10 text-foreground border-foreground/20 text-[10px] font-black px-3 py-1 uppercase tracking-tighter">
                                                {emp.days} {t('Cycles Remain')}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center text-muted-foreground relative z-10">
                                    <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">{t('All Units Operational')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Command Matrix */}
                    <div className="premium-card p-6 bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-foreground/20 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none rotate-[-15deg]">
                            <Briefcase className="h-64 w-64 text-foreground" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight uppercase mb-8 flex items-center gap-3 text-foreground relative z-10">
                            <div className="h-8 w-8 rounded-lg bg-foreground/20 flex items-center justify-center text-foreground shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                                <Briefcase className="h-4 w-4" />
                            </div>
                            {t('Strategic Command Matrix')}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            {[
                                { icon: Users, label: t('Recruit Unit'), route: 'hrm.employees.create', color: 'text-foreground' },
                                { icon: Clock, label: t('Sync Attendance'), route: 'hrm.attendances.index', color: 'text-foreground' },
                                { icon: Calendar, label: t('Field Absence'), route: 'hrm.leave-applications.index', color: 'text-muted-foreground' },
                                { icon: CreditCard, label: t('Execute Payroll'), route: 'hrm.payrolls.index', color: 'text-foreground' },
                                { icon: TrendingUp, label: t('Protocol Promotion'), route: 'hrm.promotions.index', color: 'text-destructive' },
                                { icon: AlertTriangle, label: t('Command Warning'), route: 'hrm.warnings.index', color: 'text-foreground' }
                            ]?.map((action, i) => (
                                <Button 
                                    key={i}
                                    variant="outline" 
                                    className="h-auto py-5 flex flex-col gap-3 rounded-2xl bg-card/5 border-white/10 hover:bg-foreground/20 hover:border-foreground/50 group transition-all duration-300 shadow-lg hover:shadow-primary/10"
                                    onClick={() => window.location.href = route(action.route)}
                                >
                                    <div className={`p-2 rounded-xl bg-background/50 border border-white/5 group-hover:bg-background/80 group-hover:border-foreground/30 transition-all duration-300 ${action.color}`}>
                                        <action.icon className="h-5 w-5 group-hover:scale-125 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{action.label}</span>
                                </Button>
                            ))}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('System Security')}: 100%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-foreground animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Network Latency')}: 12ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}