import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaveApplication, LeaveApplicationsIndexProps } from './types';

interface StatusUpdateProps {
    leaveapplication: LeaveApplication;
    onSuccess: () => void;
}

interface StatusUpdateFormData {
    status?: string;
    manager_status?: string;
    approver_comment: string;
}

export default function StatusUpdate({ leaveapplication, onSuccess }: StatusUpdateProps) {
    const { t } = useTranslation();
    const { auth, isMultiTierEnabled } = usePage<LeaveApplicationsIndexProps>().props;

    // Determine the permissions
    const canManageHRStatus = auth.user?.permissions?.includes('manage-leave-status');
    const isLineManager = leaveapplication.is_line_manager;

    const showManagerUpdate = isMultiTierEnabled && isLineManager;
    const showHRUpdate = canManageHRStatus;

    const { data, setData, put, processing, errors } = useForm<StatusUpdateFormData>({
        status: showHRUpdate ? leaveapplication.status || 'pending' : undefined,
        manager_status: showManagerUpdate ? leaveapplication.manager_status || 'pending' : undefined,
        approver_comment:
            (showManagerUpdate ? leaveapplication.manager_comment : leaveapplication.approver_comment) || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Let backend decide based on presence of values and auth
        put(route('hrm.leave-applications.update-status', leaveapplication.id), {
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('Update Leave Authorization')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="mt-4 space-y-6">
                {showManagerUpdate && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                        <Label htmlFor="manager_status" className="text-xs font-bold uppercase text-foreground">
                            {t('Line Manager Authorization')}
                        </Label>
                        <Select value={data.manager_status} onValueChange={(value) => setData('manager_status', value)}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('Select Status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">{t('Pending')}</SelectItem>
                                <SelectItem value="approved">{t('Approved')}</SelectItem>
                                <SelectItem value="rejected">{t('Rejected')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.manager_status} />
                    </div>
                )}

                {showHRUpdate && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                        <Label htmlFor="status" className="text-xs font-bold uppercase text-foreground">
                            {t('HR Final Authorization')}
                        </Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('Select Status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">{t('Pending')}</SelectItem>
                                <SelectItem value="approved">{t('Approved')}</SelectItem>
                                <SelectItem value="rejected">{t('Rejected')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="approver_comment" className="text-xs font-bold uppercase">
                        {t('Authorization Notes')}
                    </Label>
                    <Textarea
                        id="approver_comment"
                        value={data.approver_comment}
                        onChange={(e) => setData('approver_comment', e.target.value)}
                        placeholder={t('Enter your assessment...')}
                        rows={4}
                        className="resize-none"
                    />
                    <InputError message={errors.approver_comment} />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={onSuccess}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="px-8 text-xs font-bold uppercase tracking-widest"
                    >
                        {processing ? t('Transmitting...') : t('Execute')}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
