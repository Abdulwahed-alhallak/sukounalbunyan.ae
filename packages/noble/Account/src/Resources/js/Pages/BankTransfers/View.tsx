import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BankTransfer } from './types';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface ViewProps {
    banktransfer: BankTransfer;
}

export default function View({ banktransfer }: ViewProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        return (
            <span
                className={`rounded-full px-2 py-1 text-sm ${
                    status === 'completed'
                        ? 'bg-muted text-foreground'
                        : status === 'pending'
                          ? 'bg-muted text-foreground'
                          : 'bg-muted text-destructive'
                }`}
            >
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
            </span>
        );
    };

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{t('Bank Transfer Details')}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Transfer Number')}</Label>
                        <div className="mt-1 font-medium">{banktransfer.transfer_number}</div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Transfer Date')}</Label>
                        <div className="mt-1">{formatDate(banktransfer.transfer_date)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('From Account')}</Label>
                        <div className="mt-1">
                            <div className="font-medium">{banktransfer.from_account.account_name}</div>
                            <div className="text-sm text-muted-foreground">
                                {banktransfer.from_account.account_number}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('To Account')}</Label>
                        <div className="mt-1">
                            <div className="font-medium">{banktransfer.to_account.account_name}</div>
                            <div className="text-sm text-muted-foreground">
                                {banktransfer.to_account.account_number}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Transfer Amount')}</Label>
                        <div className="mt-1 text-lg font-medium">{formatCurrency(banktransfer.transfer_amount)}</div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Transfer Charges')}</Label>
                        <div className="mt-1 font-medium">{formatCurrency(banktransfer.transfer_charges)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Total Amount')}</Label>
                        <div className="mt-1 text-lg font-medium text-destructive">
                            {formatCurrency(banktransfer.transfer_amount + banktransfer.transfer_charges)}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Status')}</Label>
                        <div className="mt-1">{getStatusBadge(banktransfer.status)}</div>
                    </div>
                </div>

                {banktransfer.reference_number && (
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">{t('Reference Number')}</Label>
                        <div className="mt-1 font-medium">{banktransfer.reference_number}</div>
                    </div>
                )}

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t('Description')}</Label>
                    <div className="mt-1 rounded-md bg-muted/50 p-3">{banktransfer.description}</div>
                </div>

                <div>
                    <Label className="text-sm font-medium text-muted-foreground">{t('Created At')}</Label>
                    <div className="mt-1 text-sm text-muted-foreground">{formatDate(banktransfer.created_at)}</div>
                </div>
            </div>
        </DialogContent>
    );
}
