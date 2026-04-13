import { useState, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';

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
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('HRM'), url: route('hrm.index') },
                { label: t('Shifts'), url: route('hrm.shifts.index') },
                { label: t('Scheduler') },
            ]}
            pageTitle={t('Shifts Scheduler')}
        >
            <Head title={t('Shifts Scheduler')} />

            <div className="space-y-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-2xl font-bold tracking-tight">{t('Weekly Schedule')}</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={prevWeek}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={today}>
                            {t('Today')}
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextWeek}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Badge variant="secondary" className="ms-2 px-3 py-1.5 text-sm">
                            {daysInWeek[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                            {daysInWeek[6].toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card className="col-span-1 md:col-span-3">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-lg">
                                <CalendarIcon className="me-2 h-5 w-5 text-primary" /> {t('Schedule Calendar')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="w-[200px] border-e p-3 text-start font-semibold">
                                                {t('Employee')}
                                            </th>
                                            {daysInWeek.map((day, idx) => (
                                                <th
                                                    key={idx}
                                                    className={`min-w-[120px] p-3 text-center font-semibold ${day.toDateString() === new Date().toDateString() ? 'bg-primary/10 text-primary' : ''}`}
                                                >
                                                    <div className="text-xs uppercase text-muted-foreground">
                                                        {day.toLocaleDateString(undefined, { weekday: 'short' })}
                                                    </div>
                                                    <div className="text-lg">{day.getDate()}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.length > 0 ? (
                                            employees.map((emp) => (
                                                <tr key={emp.id} className="border-b last:border-b-0">
                                                    <td className="border-e bg-muted/10 p-3 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
                                                                {emp.name.charAt(0)}
                                                            </div>
                                                            <span className="truncate" title={emp.name}>
                                                                {emp.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    {daysInWeek.map((day, idx) => {
                                                        // In a real app we might have day-specific overrides,
                                                        // but for now we just show their default shift if it's a weekday
                                                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                                                        return (
                                                            <td
                                                                key={idx}
                                                                className={`border-e p-2 last:border-e-0 ${isWeekend ? 'bg-muted/30' : ''}`}
                                                            >
                                                                {emp.shift_id && !isWeekend ? (
                                                                    <div className="flex flex-col items-center justify-center rounded border border-blue-200 bg-blue-50 p-2 text-center text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                                        <span className="w-full truncate text-xs font-semibold">
                                                                            {emp.shift_name}
                                                                        </span>
                                                                        <span className="mt-0.5 text-[10px] opacity-80">
                                                                            {formatTime(emp.start_time)} -{' '}
                                                                            {formatTime(emp.end_time)}
                                                                        </span>
                                                                    </div>
                                                                ) : isWeekend ? (
                                                                    <div className="text-center text-xs text-muted-foreground/50">
                                                                        {t('Off')}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center text-xs text-muted-foreground/50">
                                                                        -
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        ) : (
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
                            <CardTitle className="flex items-center text-lg">
                                <Clock className="me-2 h-5 w-5 text-primary" /> {t('Shift Distributions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {shifts.map((shift) => {
                                    const count = employees.filter((e) => e.shift_id === shift.id).length;
                                    return (
                                        <div
                                            key={shift.id}
                                            className="flex flex-col gap-1 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold">{shift.shift_name}</span>
                                                <Badge variant="secondary">
                                                    <Users className="me-1 h-3 w-3" /> {count}
                                                </Badge>
                                            </div>
                                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                                <Clock className="me-1 h-3 w-3" />
                                                {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                            </div>
                                        </div>
                                    );
                                })}
                                {shifts.length === 0 && (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        {t('No shifts available')}
                                    </p>
                                )}

                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Unassigned Employees')}</span>
                                        <span className="font-bold">{employees.filter((e) => !e.shift_id).length}</span>
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
