import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { Milestone } from './types';

interface ViewMilestoneProps {
    [key: string]: any;
    milestone: Milestone;
}

export default function View({ milestone }: ViewMilestoneProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        return (
            <span
                className={`rounded-full px-2 py-1 text-sm ${
                    status === 'achieved'
                        ? 'bg-muted text-foreground'
                        : status === 'pending'
                          ? 'bg-muted text-foreground'
                          : status === 'overdue'
                            ? 'bg-muted text-destructive'
                            : 'bg-muted text-foreground'
                }`}
            >
                {t(status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1))}
            </span>
        );
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {t('Milestone Details')} - {milestone.milestone_name}
                </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                            {t('Milestone Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="font-semibold">{t('Milestone Name')}</span>
                                <p className="mt-1 text-muted-foreground">{milestone.milestone_name}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Goal')}</span>
                                <p className="mt-1 text-muted-foreground">{milestone.goal?.goal_name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Status')}</span>
                                <div className="mt-1">{getStatusBadge(milestone.status)}</div>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Target Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(milestone.target_date)}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="text-sm font-semibold">{t('Progress Information')}</span>
                            <div className="mt-3 rounded-lg bg-muted/50 p-4">
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                    <div>
                                        <span className="font-medium text-muted-foreground">{t('Target Amount')}</span>
                                        <p className="text-lg font-semibold text-foreground">
                                            {formatCurrency(milestone.target_amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-muted-foreground">{t('Archive Amount')}</span>
                                        <p className="text-lg font-semibold text-foreground">
                                            {formatCurrency(milestone.achieved_amount || 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-muted-foreground">{t('Progress')}</span>
                                        <p className="text-lg font-semibold text-foreground">
                                            {milestone.target_amount > 0
                                                ? Math.round(
                                                      ((milestone.achieved_amount || 0) / milestone.target_amount) * 100
                                                  )
                                                : 0}
                                            %
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-foreground transition-all duration-300"
                                            style={{
                                                width: `${milestone.target_amount > 0 ? Math.min(((milestone.achieved_amount || 0) / milestone.target_amount) * 100, 100) : 0}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {milestone.milestone_description && (
                            <div className="mt-4 text-sm">
                                <span className="font-semibold">{t('Description')}</span>
                                <p className="mt-1 rounded bg-muted/50 p-3 text-sm">
                                    {milestone.milestone_description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DialogContent>
    );
}
