import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface GanttTask {
    id: number;
    name: string;
    start: string;
    end: string;
    progress: number;
    milestone: string | null;
    type: string;
}

export default function Gantt({ project, ganttTasks }: { project: any; ganttTasks: GanttTask[] }) {
    const { t } = useTranslation();

    const { minDate, maxDate, dateRange } = useMemo(() => {
        if (!ganttTasks || ganttTasks.length === 0) {
            return { minDate: new Date(), maxDate: new Date(), dateRange: [] };
        }

        let min = new Date(ganttTasks[0].start);
        let max = new Date(ganttTasks[0].end);

        ganttTasks.forEach((task) => {
            const start = new Date(task.start);
            const end = new Date(task.end);
            if (start < min) min = start;
            if (end > max) max = end;
        });

        // Add 7 days padding
        min.setDate(min.getDate() - 7);
        max.setDate(max.getDate() + 7);

        const range = [];
        let curr = new Date(min);
        while (curr <= max) {
            range.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
        }

        return { minDate: min, maxDate: max, dateRange: range };
    }, [ganttTasks]);

    const getTaskStyle = (task: GanttTask) => {
        const start = new Date(task.start);
        const end = new Date(task.end);

        const totalDurationMs = maxDate.getTime() - minDate.getTime();
        const startOffsetMs = start.getTime() - minDate.getTime();
        const taskDurationMs = end.getTime() - start.getTime() || 24 * 60 * 60 * 1000; // minimum 1 day

        const leftPercent = (startOffsetMs / totalDurationMs) * 100;
        const widthPercent = (taskDurationMs / totalDurationMs) * 100;

        return {
            left: `${leftPercent}%`,
            width: `${Math.max(widthPercent, 1)}%`, // min 1% width
        };
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${t('Gantt Chart')} - ${project.name}`} />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
                        <Link
                            href={route('project.show', project.id)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {project.name}
                        </Link>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        {t('Gantt Chart')}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t('Project timeline and task dependencies')}</p>
                </div>
                <Link
                    href={route('project.show', project.id)}
                    className="btn btn-secondary inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t('Back to Project')}
                </Link>
            </div>

            <Card className="w-full overflow-hidden shadow-sm">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-lg">{t('Timeline View')}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                    {ganttTasks.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            {t('No tasks available to generate timeline.')}
                        </div>
                    ) : (
                        <div className="min-w-[800px] whitespace-nowrap p-6">
                            {/* Date Header */}
                            <div className="relative mb-4 flex h-12 border-b">
                                {dateRange.map((date, i) => {
                                    // Make sure it doesn't crowd, show every 3rd day roughly depending on duration
                                    const showDate =
                                        dateRange.length < 30 || i % Math.ceil(dateRange.length / 15) === 0;
                                    return (
                                        <div
                                            key={i}
                                            className="absolute flex h-full items-end border-s border-muted-foreground/20 px-1 pb-2"
                                            style={{ left: `${(i / dateRange.length) * 100}%` }}
                                        >
                                            {showDate && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    {date.toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tasks Grid */}
                            <div className="relative flex flex-col gap-3">
                                {ganttTasks.map((task) => (
                                    <div key={task.id} className="group relative flex h-10 w-full items-center">
                                        {/* Task Label on left (fixed width logic can be added, but keeping it simple absolute tracking) */}
                                        <div className="absolute -start-2 top-0 z-10 flex h-full w-48 items-center truncate bg-background/80 pe-2 backdrop-blur-sm">
                                            <span className="truncate ps-2 text-xs font-medium" title={task.name}>
                                                {task.name}
                                            </span>
                                        </div>

                                        {/* The Gantt Bar */}
                                        <div className="pointer-events-none absolute h-full w-full border-b border-muted/30"></div>
                                        <div
                                            className="absolute flex h-6 cursor-pointer items-center overflow-hidden rounded-md border border-primary/20 bg-primary/80 shadow-sm transition-all duration-200 hover:bg-primary group-hover:z-20"
                                            style={getTaskStyle(task)}
                                            title={`${task.name}: ${task.start} to ${task.end}`}
                                        >
                                            {/* Progress Fill */}
                                            <div
                                                className="absolute start-0 top-0 h-full bg-white/20"
                                                style={{ width: `${task.progress}%` }}
                                            />
                                            <span className="z-10 truncate px-2 text-[10px] font-medium text-primary-foreground drop-shadow-sm">
                                                {task.progress}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
