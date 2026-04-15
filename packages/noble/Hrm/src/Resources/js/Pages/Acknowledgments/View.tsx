import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { FileCheck, User, FileText, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Acknowledgment } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    [key: string]: any;
    acknowledgment: Acknowledgment;
}

export default function View({ acknowledgment }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <FileCheck className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Acknowledgment Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="h-4 w-4" />
                                {t('Employee')}
                            </label>
                            <p className="mt-1 font-medium">{acknowledgment.employee?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {t('Document')}
                            </label>
                            <p className="mt-1 font-medium">{acknowledgment.document?.title || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                {t('Status')}
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`rounded-full px-2 py-1 text-sm ${
                                        acknowledgment.status === 'pending'
                                            ? 'bg-muted text-foreground'
                                            : acknowledgment.status === 'acknowledged'
                                              ? 'bg-muted text-foreground'
                                              : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {t(
                                        acknowledgment.status === 'pending'
                                            ? 'Pending'
                                            : acknowledgment.status === 'acknowledged'
                                              ? 'Acknowledged'
                                              : acknowledgment.status || '-'
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="h-4 w-4" />
                                {t('Assigned By')}
                            </label>
                            <p className="mt-1 font-medium">{acknowledgment.assigned_by?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Acknowledged At')}
                            </label>
                            <p className="mt-1 font-medium">
                                {acknowledgment.acknowledged_at ? formatDate(acknowledgment.acknowledged_at) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {acknowledgment.acknowledgment_note && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Acknowledgment Note')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{acknowledgment.acknowledgment_note}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
