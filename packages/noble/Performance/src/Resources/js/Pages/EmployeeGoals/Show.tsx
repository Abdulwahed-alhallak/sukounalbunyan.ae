import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Target } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { formatDate } from '@/utils/helpers';

interface EmployeeGoal {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    target: string;
    progress: number;
    status: string;
    created_at: string;
    updated_at: string;
    employee: {
        id: number;
        name: string;
    };
    goal_type: {
        id: number;
        name: string;
    };
}

interface ShowProps {
    [key: string]: any;
    goal: EmployeeGoal;
}

export default function Show({ goal }: ShowProps) {
    const { t } = useTranslation();
    const { employees, goal_types } = usePage<any>().props;

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            not_started: 'bg-muted text-foreground',
            in_progress: 'bg-muted text-foreground',
            completed: 'bg-muted text-foreground',
            overdue: 'bg-muted text-destructive',
        };
        return colors[status] || 'bg-muted text-foreground';
    };

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            not_started: t('Not Started'),
            in_progress: t('In Progress'),
            completed: t('Completed'),
            overdue: t('Overdue'),
        };
        return labels[status] || status;
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Target className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Employee Goal Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{goal.title}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Title')}</label>
                            <p className="mt-1 text-sm text-foreground">{goal.title}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Employee')}</label>
                            <p className="mt-1 text-sm text-foreground">{goal.employee?.name || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Goal Type')}</label>
                            <p className="mt-1 text-sm text-foreground">
                                {goal_types?.find((type: any) => type.id.toString() === goal.goal_type?.id?.toString())
                                    ?.name ||
                                    goal.goal_type?.name ||
                                    '-'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Target')}</label>
                            <p className="mt-1 text-sm text-foreground">{goal.target || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Progress')}</label>
                            <div className="mt-1 flex items-center gap-2">
                                <div className="h-2 flex-1 rounded-full bg-muted">
                                    <div
                                        className="h-2 rounded-full bg-foreground transition-all duration-300"
                                        style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm text-foreground">{goal.progress || 0}%</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Status')}</label>
                            <p className="mt-1 text-sm text-foreground">
                                <span className={`rounded-full px-2 py-1 text-sm ${getStatusColor(goal.status)}`}>
                                    {getStatusLabel(goal.status)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Start Date')}</label>
                            <p className="mt-1 text-sm text-foreground">{formatDate(goal.start_date)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('End Date')}</label>
                            <p className="mt-1 text-sm text-foreground">{formatDate(goal.end_date)}</p>
                        </div>
                    </div>
                </div>

                {goal.description && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('Description')}</label>
                        <p className="mt-1 text-sm text-foreground">{goal.description}</p>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
