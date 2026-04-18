import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Complaint } from './types';
import { isMultiTierApprovalEnabled } from '../../utils/multi-tier-approval';

interface ComplaintStatusProps {
    [key: string]: any;
    complaint: Complaint;
    onSuccess: () => void;
    auth: any;
    globalSettings?: any;
    isManager?: boolean;
}

export default function ComplaintStatus({
    complaint,
    onSuccess,
    auth,
    globalSettings,
    isManager = false,
}: ComplaintStatusProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isMultiTierEnabled = isMultiTierApprovalEnabled(globalSettings);
    const isHrApproval = auth.user.permissions?.includes('manage-complaint-status');

    const { data, setData, put, errors, processing } = useForm({
        status: isManager ? complaint.manager_status || 'pending' : complaint.status || 'pending',
        manager_status: isManager ? complaint.manager_status || 'pending' : complaint.status || 'pending',
        approver_comment: isManager ? complaint.manager_comment || '' : '',
    });

    useEffect(() => {
        if (isManager) {
            setData('manager_status', complaint.manager_status || 'pending');
            setData('approver_comment', complaint.manager_comment || '');
        } else {
            setData('status', complaint.status || 'pending');
        }
    }, [complaint, isManager]);

    const statusOptions = [
        { value: 'pending', label: t('Pending') },
        { value: 'in review', label: t('In Review') },
        { value: 'assigned', label: t('Assigned') },
        { value: 'in progress', label: t('In Progress') },
        { value: 'resolved', label: t('Resolved') },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            approver_comment: data.approver_comment,
        };

        if (isManager) {
            payload.manager_status = data.manager_status;
        } else {
            payload.status = data.status;
        }

        put(route('hrm.complaints.update-status', complaint.id), {
            data: payload as any,
            onSuccess: () => {
                onSuccess();
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const cannotApproveAsHr =
        isMultiTierEnabled && !isManager && isHrApproval && complaint.manager_status === 'pending';

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-foreground" />
                    {isManager ? t('Line Manager Approval') : t('Update Complaint Status')}
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                {cannotApproveAsHr && (
                    <div className="flex items-start gap-3 rounded-md bg-destructive/10 px-4 py-3 text-destructive">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                        <div className="text-sm">
                            {t(
                                'This complaint must be reviewed by the Line Manager first before you can update the status.'
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="status">{t('Status')}</Label>
                    <Select
                        value={isManager ? data.manager_status : data.status}
                        onValueChange={(value) => setData(isManager ? 'manager_status' : 'status', value)}
                        disabled={cannotApproveAsHr}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('Select Status')} />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {(errors.status || errors.manager_status) && (
                        <p className="text-sm text-destructive">{errors.status || errors.manager_status}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="approver_comment">{t('Comment (Optional)')}</Label>
                    <Textarea
                        id="approver_comment"
                        value={data.approver_comment}
                        onChange={(e) => setData('approver_comment', e.target.value)}
                        placeholder={t('Enter your reason or comments...')}
                        disabled={processing || cannotApproveAsHr}
                        rows={3}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" disabled={processing || isSubmitting || cannotApproveAsHr}>
                        {processing || isSubmitting ? t('Updating...') : t('Update Status')}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
