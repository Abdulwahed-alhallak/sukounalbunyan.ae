import { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";

interface Shift {
    id: number;
    shift_name: string;
    start_time: string;
    end_time: string;
    is_night_shift: boolean;
}

interface Employee {
    id: number;
    name: string;
    shift_id: number | null;
    shift_name: string | null;
    start_time: string | null;
    end_time: string | null;
}

interface PageProps {
    shifts: Shift[];
    employees: Employee[];
    auth: any;
    [key: string]: any;
}

export default function Scheduler() {
    const { t } = useTranslation();
    const { shifts, employees } = usePage<PageProps>().props;

    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInWeek = useMemo(() => {
        const result = [];
        const start = new Date(currentDate);
        start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            result.push(d);
        }
        return result;
    }, [currentDate]);

    const prevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    };

    const nextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    };

    const today = () => setCurrentDate(new Date());

    const formatTime = (timeStr: string | null) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        return `${h}:${m}`;
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM'), url: route('hrm.index') }, { label: t('Shifts'), url: route('hrm.shifts.index') }, { label: t('Scheduler') }]} pageTitle={t('Shifts Scheduler')}>
            <Head title={t('Shifts Scheduler')} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight">{t('Weekly Schedule')}</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" onClick={today}>{t('Today')}</Button>
                        <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="h-4 w-4" /></Button>
                        <Badge variant="secondary" className="ml-2 text-sm py-1.5 px-3">
                            {daysInWeek[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {daysInWeek[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="col-span-1 md:col-span-3">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-lg"><CalendarIcon className="h-5 w-5 mr-2 text-primary" /> {t('Schedule Calendar')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="text-left p-3 font-semibold w-[200px] border-r">{t('Employee')}</th>
                                            {daysInWeek.map((day, idx) => (
                                                <th key={idx} className={`p-3 font-semibold text-center min-w-[120px] ${day.toDateString() === new Date().toDateString() ? 'bg-primary/10 text-primary' : ''}`}>
                                                    <div className="text-xs text-muted-foreground uppercase">{day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                                                    <div className="text-lg">{day.getDate()}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.length > 0 ? employees.map((emp) => (
                                            <tr key={emp.id} className="border-b last:border-b-0">
                                                <td className="p-3 border-r bg-muted/10 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                                                            {emp.name.charAt(0)}
                                                        </div>
                                                        <span className="truncate" title={emp.name}>{emp.name}</span>
                                                    </div>
                                                </td>
                                                {daysInWeek.map((day, idx) => {
                                                    // In a real app we might have day-specific overrides,
                                                    // but for now we just show their default shift if it's a weekday
                                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                                    
                                                    return (
                                                        <td key={idx} className={`p-2 border-r last:border-r-0 ${isWeekend ? 'bg-muted/30' : ''}`}>
                                                            {emp.shift_id && !isWeekend ? (
                                                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 p-2 flex flex-col items-center justify-center text-center shadow-sm">
                                                                    <span className="text-xs font-semibold truncate w-full">{emp.shift_name}</span>
                                                                    <span className="text-[10px] opacity-80 mt-0.5">{formatTime(emp.start_time)} - {formatTime(emp.end_time)}</span>
                                                                </div>
                                                            ) : isWeekend ? (
                                                                <div className="text-center text-xs text-muted-foreground/50">{t('Off')}</div>
                                                            ) : (
                                                                <div className="text-center text-xs text-muted-foreground/50">-</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                                    {t('No employees assigned to shifts')}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Clock className="h-5 w-5 mr-2 text-primary" /> {t('Shift Distributions')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {shifts.map((shift) => {
                                    const count = employees.filter(e => e.shift_id === shift.id).length;
                                    return (
                                        <div key={shift.id} className="flex flex-col gap-1 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-sm">{shift.shift_name}</span>
                                                <Badge variant="secondary"><Users className="h-3 w-3 mr-1" /> {count}</Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                            </div>
                                        </div>
                                    );
                                })}
                                {shifts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t('No shifts available')}</p>}
                                
                                <div className="pt-4 border-t mt-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t('Unassigned Employees')}</span>
                                        <span className="font-bold">{employees.filter(e => !e.shift_id).length}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
