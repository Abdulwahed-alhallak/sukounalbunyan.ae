import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Calendar, FileText, MessageSquareWarning, CheckCircle } from 'lucide-react';
import { Complaint } from './types';
import { formatDate, getImagePath } from '@/utils/helpers';

interface ShowComplaintProps {
    complaint: Complaint;
    onClose: () => void;
}

export default function Show({ complaint, onClose }: ShowComplaintProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <MessageSquareWarning className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Complaint Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Employee')}
                        </label>
                        <p className="mt-1 font-medium">{complaint.employee?.name || '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Against Employee')}
                        </label>
                        <p className="mt-1 font-medium">{complaint.againstEmployee?.name || '-'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Complaint Type')}
                        </label>
                        <p className="mt-1 font-medium">{complaint.complaintType?.complaint_type || '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('Complaint Date')}
                        </label>
                        <p className="mt-1 font-medium">
                            {complaint.complaint_date ? formatDate(complaint.complaint_date) : '-'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            {t('Status')}
                        </label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    complaint.status?.toLowerCase() === 'pending'
                                        ? 'bg-muted text-foreground'
                                        : complaint.status?.toLowerCase() === 'in review'
                                          ? 'bg-muted text-foreground'
                                          : complaint.status?.toLowerCase() === 'assigned'
                                            ? 'bg-muted text-foreground'
                                            : complaint.status?.toLowerCase() === 'in progress'
                                              ? 'bg-muted text-foreground'
                                              : complaint.status?.toLowerCase() === 'resolved'
                                                ? 'bg-muted text-foreground'
                                                : 'bg-muted text-foreground'
                                }`}
                            >
                                {complaint.status
                                    ? t(complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1))
                                    : '-'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Resolved By')}
                        </label>
                        <p className="mt-1 font-medium">{complaint.resolvedBy?.name || '-'}</p>
                    </div>
                </div>

                {complaint.resolution_date && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Resolution Date')}
                            </label>
                            <p className="mt-1 font-medium">{formatDate(complaint.resolution_date)}</p>
                        </div>
                    </div>
                )}

                {complaint.subject && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Subject')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{complaint.subject}</p>
                        </div>
                    </div>
                )}

                {complaint.description && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{complaint.description}</p>
                        </div>
                    </div>
                )}

                {complaint.document && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Document')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <a
                                href={getImagePath(complaint.document)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-foreground hover:text-foreground"
                            >
                                {t('View Document')}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
