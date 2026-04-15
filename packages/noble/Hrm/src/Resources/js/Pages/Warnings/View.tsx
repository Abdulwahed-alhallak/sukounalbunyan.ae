import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { User, Calendar, FileText, AlertOctagon, CheckCircle } from 'lucide-react';
import { formatDate, getImagePath } from '@/utils/helpers';

interface WarningViewProps {
    [key: string]: any;
    warning: any;
    onClose: () => void;
}

export default function WarningView({ warning, onClose }: WarningViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <AlertOctagon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Warning Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Employee Name')}
                        </label>
                        <p className="mt-1 font-medium">{warning.employee?.name || '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Warning By')}
                        </label>
                        <p className="mt-1 font-medium">{warning.warning_by?.name || '-'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Warning Type')}
                        </label>
                        <p className="mt-1 font-medium">{warning.warning_type?.warning_type_name || '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('Warning Date')}
                        </label>
                        <p className="mt-1 font-medium">
                            {warning.warning_date ? formatDate(warning.warning_date) : '-'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <AlertOctagon className="h-4 w-4" />
                            {t('Severity')}
                        </label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    warning.severity === 'Minor'
                                        ? 'bg-muted text-foreground'
                                        : warning.severity === 'Moderate'
                                          ? 'bg-muted text-foreground'
                                          : warning.severity === 'Major'
                                            ? 'bg-muted text-destructive'
                                            : 'bg-muted text-foreground'
                                }`}
                            >
                                {t(warning.severity || '-')}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            {t('Status')}
                        </label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    warning.status === 'pending'
                                        ? 'bg-muted text-foreground'
                                        : warning.status === 'approved'
                                          ? 'bg-muted text-foreground'
                                          : warning.status === 'rejected'
                                            ? 'bg-muted text-destructive'
                                            : 'bg-muted text-foreground'
                                }`}
                            >
                                {t(
                                    warning.status
                                        ? warning.status.charAt(0).toUpperCase() + warning.status.slice(1)
                                        : 'Pending'
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {warning.subject && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Subject')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{warning.subject}</p>
                        </div>
                    </div>
                )}

                {warning.description && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{warning.description}</p>
                        </div>
                    </div>
                )}

                {warning.employee_response && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Employee Response')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{warning.employee_response}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
