import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { FileText, Calendar, User, Clock, CheckCircle, MessageSquare, Tag } from 'lucide-react';
import { LeaveApplication } from './types';
import { formatDate, formatDateTime } from '@/utils/helpers';
import ModuleAttachments from '@/components/ModuleAttachments';
import { router } from '@inertiajs/react';

interface ViewProps {
    leaveapplication: LeaveApplication;
}

export default function View({ leaveapplication }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <FileText className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Leave Application Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            {leaveapplication.employee?.name || 'Unknown Employee'}
                        </p>
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
                            <p className="mt-1 font-medium">{leaveapplication.employee?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                {t('Leave Type')}
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: leaveapplication.leave_type?.color || '#gray' }}
                                ></div>
                                <p className="font-medium">{leaveapplication.leave_type?.name || '-'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Start Date')}
                            </label>
                            <p className="mt-1 font-medium">
                                {leaveapplication.start_date ? formatDate(leaveapplication.start_date) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('End Date')}
                            </label>
                            <p className="mt-1 font-medium">
                                {leaveapplication.end_date ? formatDate(leaveapplication.end_date) : '-'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('Total Days')}
                            </label>
                            <p className="mt-1 font-medium">{leaveapplication.total_days || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                {t('Status')}
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                        leaveapplication.status === 'pending'
                                            ? 'bg-muted text-foreground'
                                            : leaveapplication.status === 'approved'
                                              ? 'bg-muted text-foreground'
                                              : leaveapplication.status === 'rejected'
                                                ? 'bg-muted text-destructive'
                                                : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {t(
                                        leaveapplication.status?.charAt(0).toUpperCase() +
                                            leaveapplication.status?.slice(1) || 'Unknown'
                                    )}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="h-4 w-4" />
                                {t('Approved By')}
                            </label>
                            <p className="mt-1 font-medium">{leaveapplication.approved_by?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Approved At')}
                            </label>
                            <p className="mt-1 font-medium">
                                {leaveapplication.approved_at ? formatDateTime(leaveapplication.approved_at) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {leaveapplication.reason && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Reason')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{leaveapplication.reason}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {t('Approver Comment')}
                    </label>
                    <div className="mt-2 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm">{leaveapplication.approver_comment || '-'}</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <label className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {t('Attachments')}
                    </label>
                    <ModuleAttachments
                        moduleId={leaveapplication.id}
                        attachments={leaveapplication.attachments || []}
                        deleteRoute="hrm.leave-applications.attachments.destroy"
                        onRefresh={() => router.reload()}
                        canDelete={false} // View should generally be read-only unless specifically needed
                    />
                </div>
            </div>
        </DialogContent>
    );
}
