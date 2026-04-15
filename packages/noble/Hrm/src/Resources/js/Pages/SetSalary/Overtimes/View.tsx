import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Clock, FileText, Calendar, Tag, User, AlertCircle, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/helpers';

interface Overtime {
    id: number;
    title: string;
    total_days: number;
    hours: number;
    rate: number;
    start_date?: string;
    end_date?: string;
    notes?: string;
    status: string;
}

interface ViewOvertimeProps {
    [key: string]: any;
    overtime: Overtime;
}

export default function View({ overtime }: ViewOvertimeProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                        <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Overtime Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{overtime.title}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {t('Title')}
                            </label>
                            <p className="mt-1 font-medium">{overtime.title || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Hash className="h-4 w-4" />
                                {t('Total Days')}
                            </label>
                            <p className="mt-1 font-medium">{overtime.total_days || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('Hours')}
                            </label>
                            <p className="mt-1 font-medium">{overtime.hours || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                {t('Rate')}
                            </label>
                            <p className="mt-1 text-lg font-medium">{formatCurrency(overtime.rate) || '0'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Start Date')}
                            </label>
                            <p className="mt-1 font-medium">
                                {overtime.start_date ? formatDate(overtime.start_date) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('End Date')}
                            </label>
                            <p
                                className={`mt-1 font-medium ${overtime.end_date && new Date(overtime.end_date) < new Date() ? 'text-destructive' : ''}`}
                            >
                                {overtime.end_date ? formatDate(overtime.end_date) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                {t('Status')}
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                        overtime.status === 'active'
                                            ? 'bg-muted text-foreground'
                                            : 'bg-muted text-destructive'
                                    }`}
                                >
                                    {t(overtime.status === 'active' ? 'Active' : 'Expired')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {overtime.notes && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Notes')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{overtime.notes}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
