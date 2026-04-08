import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Attendance {
    id: number;
    employee_id: number;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    total_hour: number;
    user?: { id: number; name: string };
    shift?: { id: number; shift_name: string; start_time: string; end_time: string };
}

interface PageProps {
    attendances: Attendance[];
    stats: {
        total_employees: number;
        present: number;
        absent: number;
        half_day: number;
        late: number;
    };
    currentDate: string;
    auth: any;
    [key: string]: any;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    present: { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2, label: 'Present' },
    absent: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle, label: 'Absent' },
    'half day': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: AlertCircle, label: 'Half Day' },
    late: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: Clock, label: 'Late' },
};

export default function Tracker() {
    const { t } = useTranslation();
    const { attendances, stats, currentDate } = usePage<PageProps>().props;

    const [date, setDate] = useState(currentDate);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get(route('hrm.attendances.tracker'), { date: newDate }, { preserveState: true });
    };

    const getAttendanceStatus = (att: Attendance) => {
        if (!att || att.status === 'absent') return 'absent';
        
        let isLate = false;
        if (att.clock_in && att.shift && att.shift.start_time) {
            const clockInTime = new Date(att.clock_in).getTime();
            const shiftStartTime = new Date(`${att.clock_in.split(' ')[0]}T${att.shift.start_time}`).getTime();
            isLate = clockInTime > shiftStartTime;
        }

        if (isLate) return 'late';
        return att.status;
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Attendances'), url: route('hrm.attendances.index') }, { label: t('Tracker') }]} pageTitle={t('Attendance Tracker')}>
            <Head title={t('Attendance Tracker')} />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">{t('Live Tracker')}</h2>
                    <div className="flex items-center gap-2">
                        <Input type="date" value={date} onChange={handleDateChange} className="w-auto" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="border">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-3 rounded-xl bg-primary/10 mb-2"><Users className="h-6 w-6 text-primary" /></div>
                            <p className="text-2xl font-bold">{stats.total_employees}</p>
                            <p className="text-sm text-muted-foreground">{t('Total Employees')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-3 rounded-xl bg-emerald-500/10 mb-2"><CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" /></div>
                            <p className="text-2xl font-bold">{stats.present}</p>
                            <p className="text-sm text-muted-foreground">{t('Present')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-3 rounded-xl bg-orange-500/10 mb-2"><Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" /></div>
                            <p className="text-2xl font-bold">{stats.late}</p>
                            <p className="text-sm text-muted-foreground">{t('Late Arrivals')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-3 rounded-xl bg-amber-500/10 mb-2"><AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" /></div>
                            <p className="text-2xl font-bold">{stats.half_day}</p>
                            <p className="text-sm text-muted-foreground">{t('Half Day')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="p-3 rounded-xl bg-red-500/10 mb-2"><XCircle className="h-6 w-6 text-red-600 dark:text-red-400" /></div>
                            <p className="text-2xl font-bold">{stats.absent}</p>
                            <p className="text-sm text-muted-foreground">{t('Absent')}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('Attendance Log')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {attendances.length > 0 ? (
                            <div className="rounded-lg border overflow-hidden">
                                <table className="w-full">
                                    <thead><tr className="bg-muted/50 border-b">
                                        <th className="text-left p-3 text-sm font-semibold">{t('Employee')}</th>
                                        <th className="text-left p-3 text-sm font-semibold">{t('Shift')}</th>
                                        <th className="text-left p-3 text-sm font-semibold">{t('Clock In')}</th>
                                        <th className="text-left p-3 text-sm font-semibold">{t('Clock Out')}</th>
                                        <th className="text-left p-3 text-sm font-semibold">{t('Total Hours')}</th>
                                        <th className="text-left p-3 text-sm font-semibold">{t('Status')}</th>
                                    </tr></thead>
                                    <tbody>
                                        {attendances.map(item => {
                                            const status = getAttendanceStatus(item);
                                            const cfg = statusConfig[status] || statusConfig.absent;
                                            return (
                                                <tr key={item.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                                                                {item.user?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <span className="font-medium">{item.user?.name || t('Unknown')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm text-muted-foreground">{item.shift?.shift_name || '—'}</td>
                                                    <td className="p-3 text-sm font-mono">{item.clock_in ? new Date(item.clock_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                                                    <td className="p-3 text-sm font-mono">{item.clock_out ? new Date(item.clock_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                                                    <td className="p-3 text-sm">{item.total_hour ? `${item.total_hour}h` : '—'}</td>
                                                    <td className="p-3"><Badge className={cfg.color}>{t(cfg.label)}</Badge></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-foreground">{t('No Attendance logs yet')}</h3>
                                <p>{t('There are no attendance records for this date.')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
