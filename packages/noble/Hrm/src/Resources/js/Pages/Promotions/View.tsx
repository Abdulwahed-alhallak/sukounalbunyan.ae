import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { ArrowRight, User, Building, Users, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Promotion } from './types';
import { formatDate, getImagePath } from '@/utils/helpers';

const getStatusBadge = (status: string) => {
    const statusColors = {
        pending: 'bg-muted text-foreground',
        approved: 'bg-muted text-foreground',
        rejected: 'bg-muted text-destructive',
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.pending;
};

interface ViewProps {
    promotion: Promotion;
}

export default function View({ promotion }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('Promotion Details')}
                    </div>
                    <span
                        className={`rounded-full px-2 py-1 text-sm font-semibold ${getStatusBadge(promotion.status || 'pending')}`}
                    >
                        {t(promotion.status?.charAt(0).toUpperCase() + promotion.status?.slice(1) || 'Pending')}
                    </span>
                </DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {/* Employee Info */}
                <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-foreground/10 p-2">
                            <User className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{promotion.employee?.name || '-'}</h3>
                            <p className="text-sm text-muted-foreground">{t('Employee')}</p>
                        </div>
                    </div>
                </div>

                {/* Promotion Timeline */}
                <div className="rounded-lg bg-gradient-to-r from-muted/50 to-muted/50 p-6">
                    <h4 className="mb-6 text-center text-xl font-semibold text-foreground">
                        {t('Career Progression')}
                    </h4>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute bottom-8 start-1/2 top-8 w-0.5 -translate-x-1/2 transform bg-gradient-to-b from-foreground to-foreground/60"></div>

                        {/* Previous Position */}
                        <div className="mb-8 flex items-center">
                            <div className="w-1/2 pe-8 text-end">
                                <div className="rounded-lg border-s-4 border-destructive bg-card p-4 shadow-md">
                                    <h5 className="mb-2 font-semibold text-destructive">{t('Previous Position')}</h5>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p>{promotion.previous_designation?.designation_name || '-'}</p>
                                        <p>{promotion.previous_department?.department_name || '-'}</p>
                                        <p>{promotion.previous_branch?.branch_name || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/70">
                                <Building className="h-4 w-4 text-background" />
                            </div>
                            <div className="w-1/2 ps-8"></div>
                        </div>

                        {/* Current Position */}
                        <div className="flex items-center">
                            <div className="w-1/2 pe-8"></div>
                            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60">
                                <Building className="h-4 w-4 text-background" />
                            </div>
                            <div className="w-1/2 ps-8">
                                <div className="rounded-lg border-s-4 border-foreground bg-card p-4 shadow-md">
                                    <h5 className="mb-2 font-semibold text-foreground">{t('Current Position')}</h5>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p>{promotion.current_designation?.designation_name || '-'}</p>
                                        <p>{promotion.current_department?.department_name || '-'}</p>
                                        <p>{promotion.current_branch?.branch_name || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="rounded-lg border bg-card p-6">
                    <h4 className="mb-4 font-semibold text-foreground">{t('Promotion Details')}</h4>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                <Calendar className="h-5 w-5 text-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('Effective Date')}</p>
                                    <p className="font-semibold text-foreground">
                                        {promotion.effective_date ? formatDate(promotion.effective_date) : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {promotion.document && (
                                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                    <FileText className="h-5 w-5 text-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">{t('Document')}</p>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = getImagePath(promotion.document);
                                                link.download =
                                                    promotion.document?.split('/').pop() || 'promotion-document';
                                                link.click();
                                            }}
                                            className="h-auto p-0 font-semibold text-foreground"
                                        >
                                            {t('Download Document')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {promotion.reason && (
                        <div className="mt-4 rounded-lg bg-muted/50 p-4">
                            <p className="mb-2 text-sm font-medium text-muted-foreground">
                                {t('Reason for Promotion')}
                            </p>
                            <p className="text-foreground">{promotion.reason}</p>
                        </div>
                    )}

                    {promotion.approved_by && (
                        <div className="mt-4 rounded-lg bg-muted/50 p-4">
                            <p className="mb-2 text-sm font-medium text-foreground">{t('Approved By')}</p>
                            <p className="font-semibold text-foreground">{promotion.approved_by.name}</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
}
