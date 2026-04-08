import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { router } from '@inertiajs/react';
import { ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface Award {
    id: number;
    status: string;
    manager_status: string;
    manager_comment?: string;
    approver_comment?: string;
    employee_id: number;
}

interface StatusUpdateProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    award: Award | null;
    auth: any;
    globalSettings?: any;
    isManager: boolean;
}

export function StatusUpdate({ open, onOpenChange, award, auth, globalSettings, isManager }: StatusUpdateProps) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    
    // Status can be either for manager or HR
    const [status, setStatus] = useState<string>('pending');
    const [comment, setComment] = useState('');

    const isMultiTierEnabled = globalSettings?.enable_multi_tier_approval === 'on';
    const isHrApproval = auth.user.permissions?.includes('edit-awards');

    useEffect(() => {
        if (award) {
            setStatus(isManager ? award.manager_status : award.status);
            setComment(isManager ? (award.manager_comment || '') : (award.approver_comment || ''));
        }
    }, [award, isManager]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!award) return;

        setProcessing(true);
        
        const payload: Record<string, any> = {
            approver_comment: comment
        };

        if (isManager) {
            payload.manager_status = status;
        } else {
            payload.status = status;
        }

        router.patch(route('hrm.awards.updateStatus', award.id), payload, {
            onSuccess: () => {
                setProcessing(false);
                onOpenChange(false);
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    if (!award) return null;

    const cannotApproveAsHr = isMultiTierEnabled && !isManager && isHrApproval && award.manager_status !== 'approved';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        {isManager ? t('Line Manager Approval') : t('Update Award Status')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {cannotApproveAsHr && (
                        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                {t('This award must be evaluated by the Line Manager first before you can approve it.')}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Label>{t('Action')}</Label>
                        <RadioGroup
                            value={status}
                            onValueChange={setStatus}
                            className="flex gap-4"
                            disabled={processing || (cannotApproveAsHr && status !== 'rejected')}
                        >
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <RadioGroupItem value="pending" id="pending" />
                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-sm font-medium">
                                    <Clock className="w-4 h-4 text-warning" />
                                    {t('Pending')}
                                </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <RadioGroupItem value="approved" id="approved" disabled={cannotApproveAsHr} />
                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-sm font-medium text-success">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {t('Approve')}
                                </span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <RadioGroupItem value="rejected" id="rejected" />
                                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-sm font-medium text-destructive">
                                    <XCircle className="w-4 h-4" />
                                    {t('Reject')}
                                </span>
                            </label>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">{t('Comment (Optional)')}</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('Enter your reason or comments...')}
                            disabled={processing}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            {t('Cancel')}
                        </Button>
                        <Button type="submit" disabled={processing || (cannotApproveAsHr && status === 'approved')}>
                            {processing ? t('Saving...') : t('Save Action')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}