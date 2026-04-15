import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { formatDate } from '@/utils/helpers';

interface EmployeeReview {
    id: number;
    user: { name: string };
    reviewer: { name: string };
    status: string;
    review_date: string;
    completion_date?: string;
}

interface ReviewCycle {
    id: number;
    name: string;
    frequency: string;
    description?: string;
    status: string;
    created_at: string;
    creator: { name: string };
    created_by: { name: string };
    employee_reviews: EmployeeReview[];
}

interface ShowProps {
    [key: string]: any;
    reviewCycle: ReviewCycle;
}

export default function Show({ reviewCycle }: ShowProps) {
    const { t } = useTranslation();
    const { users, frequency_options } = usePage<any>().props;

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            active: 'bg-muted text-foreground',
            inactive: 'bg-muted text-destructive',
            pending: 'bg-muted text-foreground',
            completed: 'bg-muted text-foreground',
        };
        return colors[status] || 'bg-muted text-foreground';
    };

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            active: t('Active'),
            inactive: t('Inactive'),
            pending: t('Pending'),
            completed: t('Completed'),
        };
        return labels[status] || status;
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <RotateCcw className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Review Cycle Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{reviewCycle.name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Name')}</label>
                            <p className="mt-1 text-sm text-foreground">{reviewCycle.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Frequency')}</label>
                            <p className="mt-1 text-sm text-foreground">
                                {frequency_options?.[reviewCycle.frequency] || reviewCycle.frequency || '-'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Created By')}</label>
                            <p className="mt-1 text-sm text-foreground">{reviewCycle.created_by?.name || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Status')}</label>
                            <p className="mt-1 text-sm text-foreground">
                                <span
                                    className={`rounded-full px-2 py-1 text-sm ${getStatusColor(reviewCycle.status)}`}
                                >
                                    {getStatusLabel(reviewCycle.status)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {reviewCycle.description && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('Description')}</label>
                        <p className="mt-1 text-sm text-foreground">{reviewCycle.description}</p>
                    </div>
                )}

                {reviewCycle.employee_reviews && reviewCycle.employee_reviews.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">
                            {t('Employee Reviews')} ({reviewCycle.employee_reviews.length})
                        </label>
                        <div className="mt-2 space-y-2">
                            {reviewCycle.employee_reviews?.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <span className="text-sm font-medium text-foreground">
                                                    {review.user?.name}
                                                </span>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('Reviewer')}: {review.reviewer?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(review.review_date)}
                                                </p>
                                                {review.completion_date && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {t('Completed')}: {formatDate(review.completion_date)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-sm ${getStatusColor(review.status)}`}>
                                        {getStatusLabel(review.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
