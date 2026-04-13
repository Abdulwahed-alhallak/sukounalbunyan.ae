import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CalendarView from "@/components/calendar-view";
import { Skeleton } from '@/components/ui/skeleton';
import {
    Clock,
    Calendar,
    CalendarDays,
    FileText,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    Award,
    Play,
    Square,
    Shield,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { formatDate, formatTime, formatDateTime } from '@/utils/helpers';

interface DeferredEmployeeData {
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
    recent_announcements: Array<{
        id: number;
        title: string;
        description: string;
        created_at: string;
    }>;
    recent_leave_applications: Array<{
        id: number;
        leave_type: string;
        start_date: string;
        end_date: string;
        total_days: number;
        status: string;
        created_at: string;
    }>;
    recent_awards: Array<{
        id: number;
        award_type: string;
        award_date: string;
        created_at: string;
    }>;
    recent_warnings: Array<{
        id: number;
        warning_type: string;
        warning_date: string;
        created_at: string;
    }>;
    recent_attendance: Array<{
        date: string;
        status: string;
        clock_in: string;
        clock_out: string;
    }>;
}

interface EmployeeDashboardProps {
    message: string;
    auth: any;
    stats: {
        my_attendance: number;
        total_approved_leave_year: number;
        total_approved_leave_month: number;
        pending_requests: number;
        total_absent_days: number;
        total_awards: number;
        total_warnings: number;
        total_complaints: number;
        attendance_data?: {
            is_clocked_in: boolean;
            clock_in_time: string;
            clock_out_time: string;
            total_working_hours: string;
            shift_start_time: string;
            shift_end_time: string;
            can_clock: boolean;
            is_on_leave: boolean;
            is_holiday: boolean;
            is_non_working_day: boolean;
        };
    };
    deferredData?: DeferredEmployeeData;
}

// Skeleton components for employee dashboard
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
                    <Skeleton key={`h-${i}`} className="h-8 rounded-lg" />
                ))}
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={`c-${i}`} className="h-12 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl">
                    <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
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

export default function EmployeeDashboard({ message, stats }: EmployeeDashboardProps) {
    const { t } = useTranslation();
    const { auth, deferredData } = usePage<{ auth: any; deferredData?: DeferredEmployeeData }>().props;
    const isDeferred = !deferredData;

    const [isClockedIn, setIsClockedIn] = useState(stats.attendance_data?.is_clocked_in || false);
    const [clockTime, setClockTime] = useState(stats.attendance_data?.is_clocked_in ? stats.attendance_data?.clock_in_time : '--:--');
    const [clockInTime, setClockInTime] = useState(stats.attendance_data?.clock_in_time || '');
    const [clockOutTime, setClockOutTime] = useState(stats.attendance_data?.clock_out_time || '');
    const [totalWorkingHours, setTotalWorkingHours] = useState(stats.attendance_data?.total_working_hours || '');


    useEffect(() => {
        // Initialize state from props data
        const attendanceData = stats.attendance_data;
        if (attendanceData) {
            setIsClockedIn(attendanceData.is_clocked_in);
            setClockTime(attendanceData.is_clocked_in ? attendanceData.clock_in_time : '--:--');
            setClockInTime(attendanceData.clock_in_time || '');
            setClockOutTime(attendanceData.clock_out_time || '');
            setTotalWorkingHours(attendanceData.total_working_hours || '');
        }
    }, [stats.attendance_data]);

    const handleClockAction = () => {
        const endpoint = isClockedIn ? route('hrm.attendances.clock-out') : route('hrm.attendances.clock-in');
        router.post(endpoint, {}, {
            onSuccess: () => {
                fetch(route('hrm.attendances.clock-status'))
                    .then(response => response.json())
                    .then(data => {
                        setIsClockedIn(data.is_clocked_in);
                        setClockTime(data.is_clocked_in ? data.clock_in_time : '--:--');
                        setClockInTime(data.clock_in_time || '');
                        setClockOutTime(data.clock_out_time || '');
                        setTotalWorkingHours(data.total_working_hours || '');
                    });
            }
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Employee Dashboard') }]}
            pageTitle={t('Employee Dashboard')}
        >
            <Head title={t('Employee Dashboard')} />

            <div className="space-y-8 animate-in fade-in duration-1000">
                {/* Personal Command Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div onClick={() => window.location.href = route('hrm.attendances.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-muted/500/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-muted/500/20 flex items-center justify-center text-foreground shadow-lg shadow-blue-500/20">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{t('Duty Log')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight">{stats.my_attendance}</h3>
                                <p className="text-xs font-medium text-muted-foreground">{t('Active Days This Month')}</p>
                            </div>
                        </div>
                    </div>

                    <div onClick={() => window.location.href = route('hrm.leave-applications.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-foreground/20 flex items-center justify-center text-foreground shadow-lg shadow-emerald-500/20">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors uppercase">{t('Tactical Leave')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight">{stats.total_approved_leave_month}</h3>
                                <p className="text-xs font-medium text-muted-foreground">{t('Approved Days (Month)')}</p>
                            </div>
                        </div>
                    </div>

                    <div onClick={() => window.location.href = route('hrm.leave-applications.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-muted-foreground/20 flex items-center justify-center text-muted-foreground shadow-lg shadow-amber-500/20">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-muted-foreground transition-colors uppercase">{t('Pending Ops')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight">{stats.pending_requests}</h3>
                                <p className="text-xs font-medium text-muted-foreground">{t('Awaiting Command Approval')}</p>
                            </div>
                        </div>
                    </div>

                    <div onClick={() => window.location.href = route('hrm.attendances.index')} className="group cursor-pointer">
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-destructive/20 flex items-center justify-center text-destructive shadow-lg shadow-rose-500/20">
                                    <XCircle className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-destructive transition-colors uppercase">{t('Absence Delta')}</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-4xl font-black tracking-tight">{stats.total_absent_days}</h3>
                                <p className="text-xs font-medium text-muted-foreground">{t('Personnel Missed Cycles')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tactical Attendance Control Hub */}
                {(auth.user?.permissions?.includes('clock-in') || auth.user?.permissions?.includes('clock-out')) && (
                    <div className="premium-card p-8 border-foreground/20 bg-gradient-to-br from-primary/5 via-foreground/50 to-transparent backdrop-blur-3xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                            <Clock className="h-64 w-64 -mr-32 -mt-32 rotate-12" />
                        </div>
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className={`h-24 w-24 rounded-[2rem] flex items-center justify-center shadow-2xl animate-pulse-slow ${isClockedIn ? 'bg-foreground/20 text-foreground shadow-emerald-500/20 border border-foreground/30' : 'bg-muted/50 text-muted-foreground border border-white/5'}`}>
                                        <Clock className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black tracking-tight uppercase">
                                            {isClockedIn ? t('Active Duty Station') : t('System Standby')}
                                        </h3>
                                        {clockOutTime ? (
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
                                                <div className="px-3 py-1 rounded-lg glass-effect">IN: {formatDateTime(clockInTime)}</div>
                                                <div className="px-3 py-1 rounded-lg glass-effect">OUT: {formatDateTime(clockOutTime)}</div>
                                                <div className="px-3 py-1 rounded-lg bg-foreground/20 text-foreground border border-foreground/20 uppercase">{t('Shift Complete')}</div>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-muted-foreground max-w-md">
                                                {isClockedIn 
                                                    ? `${t('Personnel on-station since')}: ${formatDateTime(clockTime)}` 
                                                    : t('Initialization required for current duty cycle. Deploy now.')
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Attendance Edge Cases Info */}
                                {!clockOutTime && !stats.attendance_data?.can_clock && (
                                    <div className="mt-8 p-4 rounded-2xl bg-muted-foreground/10 border border-border/20 flex items-start gap-3 animate-in slide-in-from-left duration-500">
                                        <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-xs font-black uppercase text-muted-foreground tracking-wider mb-1">{t('Duty Restriction Active')}</p>
                                            <p className="text-sm font-medium leading-relaxed">
                                                {stats.attendance_data?.is_on_leave && t('Standard operations suspended due to approved absence.')}
                                                {stats.attendance_data?.is_holiday && t('Command notice: Today is observed as a regional holiday.')}
                                                {stats.attendance_data?.is_non_working_day && t('Personnel schedule indicates non-working cycle.')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-5 flex flex-col md:flex-row items-stretch gap-4">
                                <div className="flex-1 glass-effect p-4 rounded-2xl border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        <span>{t('Primary Objective')}</span>
                                        <Clock className="h-3 w-3" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('Deployment')}</p>
                                            <p className="text-lg font-black">{stats.attendance_data?.shift_start_time ? formatTime(stats.attendance_data.shift_start_time) : '--:--'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('Extraction')}</p>
                                            <p className="text-lg font-black">{stats.attendance_data?.shift_end_time ? formatTime(stats.attendance_data.shift_end_time) : '--:--'}</p>
                                        </div>
                                    </div>
                                </div>
                                {!clockOutTime && stats.attendance_data?.can_clock && (
                                    <Button
                                        onClick={handleClockAction}
                                        className={`h-auto px-8 py-6 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl transition-all duration-500 hover:scale-[1.05] active:scale-95 ${isClockedIn ? 'bg-destructive hover:bg-destructive shadow-rose-500/20' : 'bg-foreground hover:bg-foreground shadow-emerald-500/20'}`}
                                    >
                                        {isClockedIn ? (
                                            <><Square className="h-6 w-6 mr-3" />{t('Extraction')}</>
                                        ) : (
                                            <><Play className="h-6 w-6 mr-3" />{t('Deploy')}</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tactical Intelligence Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Mission Calendar */}
                    <div className="lg:col-span-8">
                        <div className="premium-card p-6 h-full flex flex-col bg-foreground/40 backdrop-blur-3xl border-none">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-foreground/20 flex items-center justify-center text-foreground">
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight uppercase">{t('Field Timeline')}</h3>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[400px]">
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

                    {/* Personal Milestones */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Awards Box */}
                        <div className="premium-card p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent flex flex-col h-full border-foreground/20">
                            <h3 className="text-lg font-black tracking-tight uppercase mb-6 flex items-center gap-2">
                                <Award className="h-5 w-5 text-foreground" />
                                {t('Service Commendations')}
                            </h3>
                            <div className="space-y-3 overflow-y-auto max-h-[300px] px-1 custom-scrollbar">
                                {isDeferred ? (
                                    <ListSkeleton count={3} />
                                ) : (
                                    <>
                                        {deferredData?.recent_awards?.map((award, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-foreground/10 group hover:border-foreground/30 transition-all">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold truncate">{award.award_type}</p>
                                                    <p className="text-[9px] font-black uppercase text-foreground">{formatDate(award.award_date)}</p>
                                                </div>
                                                <div className="h-8 w-8 rounded-lg bg-foreground/20 flex items-center justify-center text-foreground shadow-sm">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                            </div>
                                        ))}
                                        {!deferredData?.recent_awards?.length && (
                                            <div className="py-8 text-center text-muted-foreground/30 italic text-xs uppercase tracking-widest">{t('No commendations recorded')}</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Recent Briefings */}
                        <div className="premium-card p-6 bg-foreground/5 border-foreground/10">
                            <h3 className="text-lg font-black tracking-tight uppercase mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-foreground" />
                                {t('Command Directives')}
                            </h3>
                            <div className="space-y-4">
                                {isDeferred ? (
                                    <ListSkeleton count={3} />
                                ) : (
                                    deferredData?.recent_announcements?.slice(0, 3)?.map((ann, idx) => (
                                        <div key={idx} className="flex gap-4 group cursor-pointer">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                                                <Play className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1 border-b border-white/5 pb-4 group-last:border-0">
                                                <p className="text-[9px] font-black text-foreground uppercase mb-1 tracking-widest">{formatDate(ann.created_at)}</p>
                                                <h4 className="text-xs font-bold leading-tight line-clamp-2">{ann.title}</h4>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                    <Card className="premium-card border-none bg-card/40 backdrop-blur-3xl p-6">
                        <h3 className="text-lg font-black tracking-tight uppercase mb-6 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-foreground" />
                            {t('Personal Deployment Logs')}
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                            {isDeferred ? (
                                <ListSkeleton count={4} />
                            ) : (
                                deferredData?.recent_attendance?.map((att, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl glass-effect border-white/5 hover:border-foreground/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${att.status === 'present' ? 'bg-foreground/10 text-foreground' : 'bg-destructive/10 text-destructive'}`}>
                                                {att.status === 'present' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-wide">{formatDate(att.date)}</p>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {att.clock_in ? formatTime(att.clock_in) : '--:--'} → {att.clock_out ? formatTime(att.clock_out) : '--:--'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`text-[9px] font-black uppercase ${att.status === 'present' ? 'bg-foreground/10 text-foreground border-foreground/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                            {t(att.status)}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="premium-card border-none bg-card/40 backdrop-blur-3xl p-6">
                        <h3 className="text-lg font-black tracking-tight uppercase mb-6 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            {t('Duty Exemption Status')}
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                            {isDeferred ? (
                                <ListSkeleton count={4} />
                            ) : (
                                deferredData?.recent_leave_applications?.map((leave, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl glass-effect border-white/5 hover:border-border/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${leave.status === 'approved' ? 'bg-foreground/10 text-foreground' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-wide">{leave.leave_type}</p>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {formatDate(leave.start_date)} → {formatDate(leave.end_date)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{leave.total_days} {t('Cycles')}</p>
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${leave.status === 'approved' ? 'bg-foreground/10 text-foreground border-foreground/20' : 'bg-muted-foreground/10 text-muted-foreground border-border/20'}`}>
                                                {t(leave.status)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}