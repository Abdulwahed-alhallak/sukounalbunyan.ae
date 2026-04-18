import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CalendarView from '@/components/calendar-view';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    Calendar,
    Award,
    AlertTriangle,
    FileText,
    Activity,
    Target,
    Loader2,
} from 'lucide-react';
import { getImagePath, formatDate } from '@/utils/helpers';

interface DeferredEmployeeData {
    attendance_data: any;
    calendar_events: any[];
    recent_leave_applications: any[];
}

interface EmployeeDashboardProps {
    [key: string]: any;
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

export default function EmployeeDashboard({ stats }: EmployeeDashboardProps) {
    const { t } = useTranslation();
    const { deferredData } = usePage<{ deferredData?: DeferredEmployeeData }>().props;
    const isDeferred = !deferredData;

    // Attendance State
    const [isClockedIn, setIsClockedIn] = useState(stats.attendance_data?.is_clocked_in || false);
    const [clockTime, setClockTime] = useState(
        stats.attendance_data?.is_clocked_in ? stats.attendance_data?.clock_in_time : '--:--'
    );
    const [clockInTime, setClockInTime] = useState(stats.attendance_data?.clock_in_time || '');
    const [clockOutTime, setClockOutTime] = useState(stats.attendance_data?.clock_out_time || '');
    const [totalWorkingHours, setTotalWorkingHours] = useState(stats.attendance_data?.total_working_hours || '');

    useEffect(() => {
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
        router.post(
            endpoint,
            {},
            {
                onSuccess: () => {
                    fetch(route('hrm.attendances.clock-status'))
                        .then((response) => response.json())
                        .then((data) => {
                            setIsClockedIn(data.is_clocked_in);
                            setClockTime(data.is_clocked_in ? data.clock_in_time : '--:--');
                            setClockInTime(data.clock_in_time || '');
                            setClockOutTime(data.clock_out_time || '');
                            setTotalWorkingHours(data.total_working_hours || '');
                        });
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('My Dashboard') }]}
            pageTitle={t('My HR Dashboard')}
        >
            <Head title={t('My HR Dashboard')} />

            <div className="space-y-8 pb-12">
                <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                    <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Activity className="h-10 w-10 animate-pulse text-foreground" />
                                <div className="absolute inset-0 blur-lg bg-foreground/20 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                                    {t("Today's Work Status")}
                                </h2>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isClockedIn ? t('You are currently clocked in.') : t('You have not clocked in yet.')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-col items-end px-4 border-e border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Shift')}</span>
                                <span className="text-lg font-black tracking-tighter">{clockInTime || '--:--'} → {clockOutTime || '--:--'}</span>
                            </div>
                            <Button
                                onClick={handleClockAction}
                                variant={isClockedIn ? 'destructive' : 'default'}
                                className="h-12 rounded-2xl px-8 font-black uppercase tracking-widest shadow-xl shadow-foreground/10 transition-all hover:scale-105"
                                disabled={!stats.attendance_data?.can_clock}
                            >
                                {isClockedIn ? <UserX className="me-2 h-5 w-5" /> : <UserCheck className="me-2 h-5 w-5" />}
                                {isClockedIn ? t('Clock Out') : t('Clock In')}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: t('Attendance'), value: `${stats.my_attendance}%`, icon: Activity, color: 'text-info', bg: 'bg-info/20', gradient: 'from-info/10' },
                        { label: t('Approved Leave'), value: stats.total_approved_leave_year, icon: Calendar, color: 'text-success', bg: 'bg-success/20', gradient: 'from-success/10' },
                        { label: t('Pending Requests'), value: stats.pending_requests, icon: Clock, color: 'text-warning', bg: 'bg-warning/20', gradient: 'from-warning/10' },
                        { label: t('Awards'), value: stats.total_awards, icon: Award, color: 'text-primary', bg: 'bg-primary/20', gradient: 'from-primary/10' },
                    ].map((stat, i) => (
                        <div key={i} className={`premium-card group relative overflow-hidden bg-gradient-to-br ${stat.gradient} via-transparent to-transparent p-6 transition-all hover:border-foreground/40`}>
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-lg shadow-black/20 transition-transform group-hover:scale-110`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{stat.label}</span>
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter text-foreground">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <Card className="lg:col-span-8 premium-card relative overflow-hidden border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                        <div className="pointer-events-none absolute end-0 top-0 p-12 opacity-[0.02]">
                            <Target className="h-64 w-64" />
                        </div>
                        <div className="relative z-10 mb-8 flex items-center justify-between">
                            <h3 className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                {t('My Calendar')}
                            </h3>
                        </div>
                        <div className="relative z-10 min-h-[450px]">
                            {isDeferred ? <CalendarSkeleton /> : <CalendarView events={deferredData?.calendar_events || []} />}
                        </div>
                    </Card>

                    <Card className="lg:col-span-4 premium-card relative overflow-hidden border border-border/30 bg-card/60 p-6 backdrop-blur-xl">
                        <h3 className="mb-8 flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            {t('Recent Leave Requests')}
                        </h3>
                        <div className="custom-scrollbar max-h-[500px] space-y-4 overflow-y-auto pe-2">
                            {isDeferred ? (
                                <ListSkeleton count={5} />
                            ) : deferredData?.recent_leave_applications?.length ? (
                                deferredData.recent_leave_applications.map((leave, i) => (
                                    <div key={i} className="geist-surface group flex items-center justify-between bg-background/50 p-4 transition-all hover:bg-card/60">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${leave.status === 'approved' ? 'bg-success/10 text-success' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-wide">{leave.leave_type}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase opacity-60">
                                                    {formatDate(leave.start_date)} → {formatDate(leave.end_date)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Badge variant="outline" className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase ${leave.status === 'approved' ? 'border-success/20 bg-success/10 text-success' : 'border-border/20 bg-muted-foreground/10 text-muted-foreground'}`}>
                                                {t(leave.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-20">
                                    <FileText className="mx-auto mb-4 h-12 w-12" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">{t('No recent leave requests')}</p>
                                </div>
                            )}
                        </div>
                        <Button variant="outline" className="mt-8 w-full rounded-2xl border-white/10 font-black uppercase tracking-widest text-[10px]" onClick={() => router.get(route('hrm.leave-applications.index'))}>
                            {t('Request Leave')}
                        </Button>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
