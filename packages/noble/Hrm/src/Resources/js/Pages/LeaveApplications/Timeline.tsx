import { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Leave {
    id: number;
    start_date: string;
    end_date: string;
    employee: { id: number; employee: { user_id: number; name?: string } | null; name?: string };
    leave_type: { id: number; name: string };
    total_leave_days: number;
}

interface PageProps {
    leaves: Leave[];
    currentMonth: number;
    currentYear: number;
    auth: any;
    [key: string]: any;
}

export default function Timeline() {
    const { t } = useTranslation();
    const { leaves, currentMonth, currentYear } = usePage<PageProps>().props;

    const [month, setMonth] = useState<number>(Number(currentMonth));
    const [year, setYear] = useState<number>(Number(currentYear));

    const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);

    const handlePrevMonth = () => {
        let prevM = month - 1;
        let prevY = year;
        if (prevM < 1) {
            prevM = 12;
            prevY -= 1;
        }
        setMonth(prevM);
        setYear(prevY);
        router.get(route('hrm.leave-applications.timeline'), { month: prevM, year: prevY }, { preserveState: true });
    };

    const handleNextMonth = () => {
        let nextM = month + 1;
        let nextY = year;
        if (nextM > 12) {
            nextM = 1;
            nextY += 1;
        }
        setMonth(nextM);
        setYear(nextY);
        router.get(route('hrm.leave-applications.timeline'), { month: nextM, year: nextY }, { preserveState: true });
    };

    const handleToday = () => {
        const d = new Date();
        setMonth(d.getMonth() + 1);
        setYear(d.getFullYear());
        router.get(
            route('hrm.leave-applications.timeline'),
            { month: d.getMonth() + 1, year: d.getFullYear() },
            { preserveState: true }
        );
    };

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Group leaves by employee
    const employeesData = useMemo(() => {
        const empMap = new Map<number, { name: string; leaves: Leave[] }>();
        leaves.forEach((leave) => {
            // Safe fallback because user relation can be nested or flat depending on eager loading
            const empId = leave.employee?.id || 0;
            const empName = leave.employee?.employee?.name || leave.employee?.name || t('Unknown');
            if (!empMap.has(empId)) empMap.set(empId, { name: empName, leaves: [] });
            empMap.get(empId)?.leaves.push(leave);
        });
        return Array.from(empMap.values());
    }, [leaves, t]);

    const getLeaveForDay = (dayLeaves: Leave[], d: number) => {
        const checkDate = new Date(year, month - 1, d).toISOString().split('T')[0];
        return dayLeaves.find((l) => {
            const start = l.start_date.split(' ')[0]; // Handled datetime formats safely
            const end = l.end_date.split(' ')[0];
            return checkDate >= start && checkDate <= end;
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('HRM'), url: route('hrm.index') },
                { label: t('Leave Applications'), url: route('hrm.leave-applications.index') },
                { label: t('Timeline') },
            ]}
            pageTitle={t('Leave Timeline')}
        >
            <Head title={t('Leave Timeline')} />

            <div className="space-y-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t('Team Leave Timeline')}</h2>
                        <p className="text-sm text-muted-foreground">
                            {t('Visualize employee approved leaves and prevent overlaps.')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={handleToday}>
                            {t('Current Month')}
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Badge variant="secondary" className="ml-2 px-3 py-1.5 text-sm font-semibold">
                            {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <CalendarIcon className="mr-2 h-5 w-5 text-primary" /> {t('Monthly Overview')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden p-0 sm:p-6">
                        <div className="custom-scrollbar relative overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[1000px] border-collapse bg-card">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 z-10 w-[200px] min-w-[200px] border-b border-r bg-muted/60 p-3 text-left font-semibold backdrop-blur-md">
                                            {t('Employee')}
                                        </th>
                                        {daysArray.map((d) => {
                                            const isWeekend =
                                                new Date(year, month - 1, d).getDay() === 0 ||
                                                new Date(year, month - 1, d).getDay() === 6;
                                            const isToday =
                                                new Date().toDateString() ===
                                                new Date(year, month - 1, d).toDateString();
                                            return (
                                                <th
                                                    key={d}
                                                    className={`min-w-[35px] border-b p-2 text-center text-xs font-medium ${isWeekend ? 'bg-muted/30 text-muted-foreground' : ''} ${isToday ? 'bg-primary/10 font-bold text-primary' : ''} `}
                                                >
                                                    <div>
                                                        {new Date(year, month - 1, d).toLocaleDateString(undefined, {
                                                            weekday: 'narrow',
                                                        })}
                                                    </div>
                                                    <div>{d}</div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeesData.length > 0 ? (
                                        employeesData.map((emp, i) => (
                                            <tr key={i} className="transition-colors hover:bg-muted/10">
                                                <td className="sticky left-0 z-10 border-b border-r bg-card p-3 font-medium backdrop-blur-md">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/10 text-xs font-bold uppercase text-primary shadow-sm">
                                                            {emp.name.substring(0, 2)}
                                                        </div>
                                                        <span className="max-w-[150px] truncate" title={emp.name}>
                                                            {emp.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                {daysArray.map((d) => {
                                                    const leave = getLeaveForDay(emp.leaves, d);
                                                    const isWeekend =
                                                        new Date(year, month - 1, d).getDay() === 0 ||
                                                        new Date(year, month - 1, d).getDay() === 6;
                                                    return (
                                                        <td
                                                            key={d}
                                                            className={`border-b p-1 text-center ${isWeekend && !leave ? 'bg-muted/20' : ''}`}
                                                        >
                                                            {leave ? (
                                                                <div
                                                                    className="flex h-6 w-full cursor-pointer items-center justify-center truncate rounded-sm border border-orange-200 bg-orange-100 px-1 text-[10px] font-medium text-orange-800 shadow-sm transition-colors hover:bg-orange-200 dark:border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/40"
                                                                    title={`${leave.leave_type?.name} (${leave.total_leave_days} Days)`}
                                                                >
                                                                    {leave.leave_type?.name?.substring(0, 3)}
                                                                </div>
                                                            ) : null}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={daysArray.length + 1}
                                                className="border-b border-r p-12 text-center text-muted-foreground"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <CalendarIcon className="mb-3 h-10 w-10 opacity-20" />
                                                    <p>{t('No approved leaves found for this month.')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex items-center gap-4 px-2 text-sm text-muted-foreground">
                            <span className="mr-2 font-semibold text-foreground">{t('Legend')}:</span>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-sm border bg-muted/30"></div> {t('Weekend/Off')}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-sm border border-primary/20 bg-primary/10"></div>{' '}
                                {t('Today')}
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-sm border border-orange-200 bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/20"></div>{' '}
                                {t('Approved Leave')}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
