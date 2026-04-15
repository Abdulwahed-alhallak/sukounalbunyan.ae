import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';
import { BankAccount } from './types';
import { formatCurrency } from '@/utils/helpers';

interface ViewProps {
    [key: string]: any;
    bankaccount: BankAccount;
}

export default function View({ bankaccount }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <CreditCard className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Bank Account Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{bankaccount.account_name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Account Number')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{bankaccount.account_number}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Account Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{bankaccount.account_name}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Bank Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{bankaccount.bank_name}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Branch Name')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {bankaccount.branch_name || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Account Type')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {bankaccount.account_type === '0'
                                ? 'Checking'
                                : bankaccount.account_type === '1'
                                  ? 'Savings'
                                  : bankaccount.account_type === '2'
                                    ? 'Credit'
                                    : 'Loan'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Payment Gateway')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {bankaccount.payment_gateway || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Opening Balance')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {formatCurrency(bankaccount.opening_balance || 0)}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Current Balance')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {formatCurrency(bankaccount.current_balance || 0)}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('IBAN')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">{bankaccount.iban || '-'}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('SWIFT Code')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {bankaccount.swift_code || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Routing Number')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {bankaccount.routing_number || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('GL Account')}</label>
                        <p className="rounded bg-muted/50 p-2 text-sm text-foreground">
                            {bankaccount.gl_account?.account_name || '-'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('Status')}</label>
                        <p className="text-sm">
                            <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                    bankaccount.is_active ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                }`}
                            >
                                {bankaccount.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
