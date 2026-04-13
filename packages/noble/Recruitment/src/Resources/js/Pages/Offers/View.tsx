import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, X } from 'lucide-react';
import { Offer } from './types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import { usePage, router } from '@inertiajs/react';


interface ViewProps {
    offer: Offer;
    onClose?: () => void;
}

export default function View({ offer, onClose }: ViewProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const handleApprovalAction = (action: 'approve' | 'reject') => {
        router.post(route('recruitment.offers.approval-status', offer.id), { action }, {
            onSuccess: () => {
                onClose?.();
            }
        });
    };

    const candidateName = (() => {
        const firstName = offer.candidate?.first_name || '';
        const lastName = offer.candidate?.last_name || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : t('Unknown Candidate');
    })();

    const getStatusColor = (status: string) => {
        switch(status) {
            case '0': return 'bg-muted-foreground';
            case '1': return 'bg-muted/500';
            case '2': return 'bg-foreground';
            case '3': return 'bg-muted-foreground';
            case '4': return 'bg-muted/500';
            case '5': return 'bg-foreground';
            default: return 'bg-muted-foreground';
        }
    };

    const getStatusText = (status: string) => {
        const options: any = {"0":"Draft","1":"Sent","2":"Accepted","3":"Negotiating","4":"Declined","5":"Expired"};
        return options[status] || status || t('Unknown');
    };

    const isExpired = offer.expiration_date && offer.expiration_date <= new Date().toISOString().split('T')[0];

    return (
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-foreground/10 rounded-lg">
                            <FileText className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{t('Offer Details')}</DialogTitle>
                        </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium text-background mt-4 ${getStatusColor(offer.status)}`}>
                        {t(getStatusText(offer.status))}
                    </span>
                </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{t('Basic Information')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Candidate Name')}</p>
                            <p className="text-foreground">{candidateName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Position')}</p>
                            <p className="text-foreground">{offer.position || t('Not specified')}</p>
                        </div>
                        <div>
                         <p className="text-sm font-medium text-muted-foreground mb-1">{t('Email')}</p>
                            <p className="text-foreground">{offer.candidate?.email || t('Not specified')}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Phone')}</p>
                            <p className="text-foreground">{offer.candidate?.phone || t('Not specified')}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Job Title')}</p>
                            <p className="text-foreground">{offer.job?.title || t('Not specified')}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Department')}</p>
                            <p className="text-foreground">{offer.department?.department_name || t('Not specified')}</p>
                        </div>
                    </div>
                </div>

                {/* Compensation */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{t('Compensation')}</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Salary')}</p>
                            <p className="text-xl font-bold text-foreground">{offer.salary ? formatCurrency(offer.salary) : t('Not set')}</p>
                        </div>
                        {offer.bonus && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{t('Bonus')}</p>
                                <p className="text-xl font-bold text-foreground">{formatCurrency(offer.bonus)}</p>
                            </div>
                        )}
                        {offer.equity && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{t('Equity')}</p>
                                <p className="text-xl font-bold text-foreground">{offer.equity}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dates */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{t('Important Dates')}</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Offer Date')}</p>
                            <p className="text-foreground">{formatDate(offer.offer_date) || t('Not set')}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Start Date')}</p>
                            <p className="text-foreground">{formatDate(offer.start_date) || t('Not set')}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{t('Expires')}</p>
                            <p className={isExpired ? 'text-destructive font-bold' : 'text-foreground'}>
                                {formatDate(offer.expiration_date) || t('No limit')}
                                {isExpired && <span className="ml-2 text-xs font-bold">{t('EXPIRED')}</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                {(offer.approved_by || offer.response_date) && (
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-3">{t('Additional Information')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {offer.approved_by && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('Approved By')}</p>
                                    <p className="text-foreground">{typeof offer.approved_by === 'object' ? offer.approved_by?.name || t('Unknown User') : offer.approved_by}</p>
                                </div>
                            )}
                            {offer.response_date && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{t('Response Date')}</p>
                                    <p className="text-foreground">{formatDate(offer.response_date)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Benefits */}
                {offer.benefits && (
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-3">{t('Benefits')}</h3>
                        <p className="text-foreground leading-relaxed">{offer.benefits}</p>
                    </div>
                )}




            </div>

            {auth.user?.permissions?.includes('approve-offers') && (
                <DialogFooter className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        onClick={() => handleApprovalAction('approve')}
                        className="bg-foreground hover:bg-foreground/80"
                        disabled={offer.approval_status === 'approved'}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('Approve')}
                    </Button>
                    <Button
                        onClick={() => handleApprovalAction('reject')}
                        className="bg-destructive hover:bg-destructive/80"
                        disabled={offer.approval_status === 'rejected'}
                    >
                        <X className="w-4 h-4 mr-2" />
                        {t('Reject')}
                    </Button>
                </DialogFooter>
            )}


        </DialogContent>
    );
}