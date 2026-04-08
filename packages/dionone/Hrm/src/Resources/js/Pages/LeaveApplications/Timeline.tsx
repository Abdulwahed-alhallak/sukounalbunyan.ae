import { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Leave {
    id: number;
    start_date: string;
    end_date: string;
    employee: { id: number; employee: { user_id: number; name?: string } | null; name?: string; };
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
        if (prevM < 1) { prevM = 12; prevY -= 1; }
        setMonth(prevM);
        setYear(prevY);
        router.get(route('hrm.leave-applications.timeline'), { month: prevM, year: prevY }, { preserveState: true });
    };

    const handleNextMonth = () => {
        let nextM = month + 1;
        let nextY = year;
        if (nextM > 12) { nextM = 1; nextY += 1; }
        setMonth(nextM);
        setYear(nextY);
        router.get(route('hrm.leave-applications.timeline'), { month: nextM, year: nextY }, { preserveState: true });
    };

    const handleToday = () => {
        const d = new Date();
        setMonth(d.getMonth() + 1);
        setYear(d.getFullYear());
        router.get(route('hrm.leave-applications.timeline'), { month: d.getMonth() + 1, year: d.getFullYear() }, { preserveState: true });
    };

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Group leaves by employee
    const employeesData = useMemo(() => {
        const empMap = new Map<number, { name: string, leaves: Leave[] }>();
        leaves.forEach(leave => {
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
        return dayLeaves.find(l => {
            const start = l.start_date.split(' ')[0]; // Handled datetime formats safely
            const end = l.end_date.split(' ')[0];
            return checkDate >= start && checkDate <= end;
        });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Leave Applications'), url: route('hrm.leave-applications.index') }, { label: t('Timeline') }]} pageTitle={t('Leave Timeline')}>
            <Head title={t('Leave Timeline')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t('Team Leave Timeline')}</h2>
                        <p className="text-muted-foreground text-sm">{t('Visualize employee approved leaves and prevent overlaps.')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" onClick={handleToday}>{t('Current Month')}</Button>
                        <Button variant="outline" size="icon" onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></Button>
                        <Badge variant="secondary" className="ml-2 px-3 py-1.5 font-semibold text-sm">
                            {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg"><CalendarIcon className="mr-2 h-5 w-5 text-primary" /> {t('Monthly Overview')}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6 overflow-hidden">
                        <div className="rounded-lg border overflow-x-auto custom-scrollbar relative">
                            <table className="w-full min-w-[1000px] border-collapse bg-card">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 z-10 bg-muted/60 p-3 text-left font-semibold border-b border-r w-[200px] min-w-[200px] backdrop-blur-md">
                                            {t('Employee')}
                                        </th>
                                        {daysArray.map(d => {
                                            const isWeekend = new Date(year, month - 1, d).getDay() === 0 || new Date(year, month - 1, d).getDay() === 6;
                                            const isToday = new Date().toDateString() === new Date(year, month - 1, d).toDateString();
                                            return (
                                                <th key={d} className={`border-b p-2 min-w-[35px] text-center text-xs font-medium 
                                                    ${isWeekend ? 'bg-muted/30 text-muted-foreground' : ''}
                                                    ${isToday ? 'bg-primary/10 text-primary font-bold' : ''}
                                                `}>
                                                    <div>{new Date(year, month - 1, d).toLocaleDateString(undefined, { weekday: 'narrow' })}</div>
                                                    <div>{d}</div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeesData.length > 0 ? employeesData.map((emp, i) => (
                                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                                            <td className="sticky left-0 z-10 bg-card p-3 border-b border-r font-medium backdrop-blur-md">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                                        {emp.name.substring(0, 2)}
                                                    </div>
                                                    <span className="truncate max-w-[150px]" title={emp.name}>{emp.name}</span>
                                                </div>
                                            </td>
                                            {daysArray.map(d => {
                                                const leave = getLeaveForDay(emp.leaves, d);
                                                const isWeekend = new Date(year, month - 1, d).getDay() === 0 || new Date(year, month - 1, d).getDay() === 6;
                                                return (
                                                    <td key={d} className={`border-b p-1 text-center ${isWeekend && !leave ? 'bg-muted/20' : ''}`}>
                                                        {leave ? (
                                                            <div 
                                                                className="h-6 w-full rounded-sm bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 font-medium text-[10px] flex items-center justify-center truncate px-1 shadow-sm border border-orange-200 dark:border-orange-500/30 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-500/40 transition-colors"
                                                                title={`${leave.leave_type?.name} (${leave.total_leave_days} Days)`}
                                                            >
                                                                {leave.leave_type?.name?.substring(0, 3)}
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={daysArray.length + 1} className="p-12 text-center text-muted-foreground border-b border-r">
                                                <div className="flex flex-col items-center justify-center">
                                                    <CalendarIcon className="h-10 w-10 mb-3 opacity-20" />
                                                    <p>{t('No approved leaves found for this month.')}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Legend */}
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground px-2">
                            <span className="font-semibold text-foreground mr-2">{t('Legend')}:</span>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-muted/30 border rounded-sm"></div> {t('Weekend/Off')}</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary/10 border border-primary/20 rounded-sm"></div> {t('Today')}</div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-100 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 rounded-sm"></div> {t('Approved Leave')}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
