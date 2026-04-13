import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { CalendarDays, Target, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { GoalTracking } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface ViewProps {
    tracking: GoalTracking;
}

export default function View() {
    const { t } = useTranslation();
    const { tracking } = usePage<ViewProps>().props;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ahead':
                return 'bg-muted text-foreground';
            case 'on_track':
                return 'bg-muted text-foreground';
            case 'behind':
                return 'bg-muted text-foreground';
            case 'critical':
                return 'bg-muted text-destructive';
            default:
                return 'bg-muted text-foreground';
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Goal'), url: route('goal.goals.index') },
                { label: t('Tracking'), url: route('goal.tracking.index') },
                { label: t('View') },
            ]}
            pageTitle={t('Tracking Details')}
        >
            <Head title={t('Tracking Details')} />

            <div className="space-y-6">
                {/* Header Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{tracking.goal?.goal_name}</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {t('Tracking Date')}: {formatDate(tracking.tracking_date)}
                                </p>
                            </div>
                            <Badge className={getStatusColor(tracking.on_track_status)}>
                                {t(
                                    tracking.on_track_status.replace('_', ' ').charAt(0).toUpperCase() +
                                        tracking.on_track_status.replace('_', ' ').slice(1)
                                )}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Progress Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {t('Progress Overview')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <DollarSign className="mx-auto mb-2 h-8 w-8 text-foreground" />
                                <p className="text-sm text-muted-foreground">{t('Target Amount')}</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {formatCurrency(tracking.goal?.target_amount || 0)}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <Target className="mx-auto mb-2 h-8 w-8 text-foreground" />
                                <p className="text-sm text-muted-foreground">{t('Current Amount')}</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {formatCurrency(tracking.current_amount)}
                                </p>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-foreground" />
                                <p className="text-sm text-muted-foreground">{t('Progress')}</p>
                                <p className="text-2xl font-bold text-foreground">{tracking.progress_percentage}%</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>{t('Progress')}</span>
                                <span>{tracking.progress_percentage}%</span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-muted">
                                <div
                                    className="h-3 rounded-full bg-foreground transition-all duration-300"
                                    style={{ width: `${Math.min(tracking.progress_percentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tracking Details */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Financial Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                {t('Financial Details')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between border-b py-2">
                                <span className="text-sm text-muted-foreground">{t('Previous Amount')}</span>
                                <span className="font-medium">{formatCurrency(tracking.previous_amount)}</span>
                            </div>
                            <div className="flex items-center justify-between border-b py-2">
                                <span className="text-sm text-muted-foreground">{t('Contribution Amount')}</span>
                                <span className="font-medium text-foreground">
                                    {formatCurrency(tracking.contribution_amount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b py-2">
                                <span className="text-sm text-muted-foreground">{t('Current Amount')}</span>
                                <span className="text-lg font-semibold">{formatCurrency(tracking.current_amount)}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">{t('Remaining Amount')}</span>
                                <span className="font-medium text-foreground">
                                    {formatCurrency(
                                        Math.max(0, (tracking.goal?.target_amount || 0) - tracking.current_amount)
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                {t('Timeline Details')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between border-b py-2">
                                <span className="text-sm text-muted-foreground">{t('Tracking Date')}</span>
                                <span className="font-medium">{formatDate(tracking.tracking_date)}</span>
                            </div>
                            <div className="flex items-center justify-between border-b py-2">
                                <span className="text-sm text-muted-foreground">{t('Days Remaining')}</span>
                                <span
                                    className={`font-medium ${tracking.days_remaining < 0 ? 'text-destructive' : tracking.days_remaining < 30 ? 'text-muted-foreground' : 'text-foreground'}`}
                                >
                                    {tracking.days_remaining < 0
                                        ? t('Overdue by {{days}} days', { days: Math.abs(tracking.days_remaining) })
                                        : t('{{days}} days', { days: tracking.days_remaining })}
                                </span>
                            </div>
                            {tracking.projected_completion_date && (
                                <div className="flex items-center justify-between border-b py-2">
                                    <span className="text-sm text-muted-foreground">{t('Projected Completion')}</span>
                                    <span className="font-medium">
                                        {formatDate(tracking.projected_completion_date)}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-muted-foreground">{t('Status')}</span>
                                <Badge className={getStatusColor(tracking.on_track_status)}>
                                    {t(
                                        tracking.on_track_status.replace('_', ' ').charAt(0).toUpperCase() +
                                            tracking.on_track_status.replace('_', ' ').slice(1)
                                    )}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Goal Information */}
                {tracking.goal && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                {t('Goal Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">{t('Goal Name')}</p>
                                    <p className="font-medium">{tracking.goal.goal_name}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">{t('Goal Type')}</p>
                                    <p className="font-medium capitalize">
                                        {tracking.goal.goal_type?.replace('_', ' ')}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">{t('Start Date')}</p>
                                    <p className="font-medium">{formatDate(tracking.goal.start_date)}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">{t('Target Date')}</p>
                                    <p className="font-medium">{formatDate(tracking.goal.target_date)}</p>
                                </div>
                            </div>
                            {tracking.goal.goal_description && (
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">{t('Description')}</p>
                                    <p className="text-sm">{tracking.goal.goal_description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
