import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { Goal } from './types';

interface ViewGoalProps {
    goal: Goal;
}

export default function View({ goal }: ViewGoalProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        return (
            <span
                className={`rounded-full px-2 py-1 text-sm ${
                    status === 'completed'
                        ? 'bg-muted text-foreground'
                        : status === 'active'
                          ? 'bg-muted text-foreground'
                          : status === 'paused'
                            ? 'bg-muted text-foreground'
                            : status === 'cancelled'
                              ? 'bg-muted text-destructive'
                              : 'bg-muted text-foreground'
                }`}
            >
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        return (
            <span
                className={`rounded-full px-2 py-1 text-sm ${
                    priority === 'critical'
                        ? 'bg-muted text-destructive'
                        : priority === 'high'
                          ? 'bg-muted text-foreground'
                          : priority === 'medium'
                            ? 'bg-muted text-foreground'
                            : 'bg-muted text-foreground'
                }`}
            >
                {t(priority.charAt(0).toUpperCase() + priority.slice(1))}
            </span>
        );
    };

    const progressPercentage = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;

    return (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {t('Goal Details')} - {goal.goal_name}
                </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                            {t('Goal Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="font-semibold">{t('Goal Name')}</span>
                                <p className="mt-1 text-muted-foreground">{goal.goal_name}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Category')}</span>
                                <p className="mt-1 text-muted-foreground">{goal.category?.category_name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Goal Type')}</span>
                                <p className="mt-1 text-muted-foreground">{t(goal.goal_type.replace('_', ' '))}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Priority')}</span>
                                <div className="mt-1">{getPriorityBadge(goal.priority)}</div>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Status')}</span>
                                <div className="mt-1">{getStatusBadge(goal.status)}</div>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Chart of Account')}</span>
                                <p className="mt-1 text-muted-foreground">{goal.account?.account_name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Start Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(goal.start_date)}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Target Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(goal.target_date)}</p>
                            </div>
                        </div>
                        {goal.goal_description && (
                            <div className="mt-4 text-sm">
                                <span className="font-semibold">{t('Description')}</span>
                                <p className="mt-1 rounded bg-muted/50 p-3 text-sm">{goal.goal_description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('Financial Progress')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <span className="text-sm font-semibold">{t('Target Amount')}</span>
                                    <p className="mt-1 text-2xl font-bold text-foreground">
                                        {formatCurrency(goal.target_amount)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold">{t('Current Amount')}</span>
                                    <p className="mt-1 text-2xl font-bold text-foreground">
                                        {formatCurrency(goal.current_amount)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-semibold">{t('Progress')}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {progressPercentage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-muted">
                                    <div
                                        className="h-3 rounded-full bg-foreground transition-all duration-300"
                                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DialogContent>
    );
}
