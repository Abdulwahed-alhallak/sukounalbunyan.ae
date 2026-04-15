import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { DollarSign, FileText, Calendar, Tag, User, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/helpers';

interface Loan {
    id: number;
    title: string;
    loan_type_id: number;
    type: string;
    amount: number;
    start_date?: string;
    end_date?: string;
    reason?: string;
    loan_type?: {
        name: string;
    };
}

interface ViewLoanProps {
    [key: string]: any;
    loan: Loan;
}

export default function View({ loan }: ViewLoanProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                        <DollarSign className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Loan Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{loan.title}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {t('Title')}
                            </label>
                            <p className="mt-1 font-medium">{loan.title || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                {t('Loan Type')}
                            </label>
                            <p className="mt-1 font-medium">{loan.loan_type?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                {t('Type')}
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                        loan.type === 'fixed' ? 'bg-muted text-foreground' : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {t(loan.type === 'fixed' ? 'Fixed' : 'Percentage')}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                {t('Amount')}
                            </label>
                            <p className="mt-1 text-lg font-medium">
                                {loan.type === 'fixed'
                                    ? formatCurrency(loan.amount) || '0'
                                    : formatCurrency(loan.amount) || '0%'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Start Date')}
                            </label>
                            <p className="mt-1 font-medium">{loan.start_date ? formatDate(loan.start_date) : '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('End Date')}
                            </label>
                            <p
                                className={`mt-1 font-medium ${loan.end_date && new Date(loan.end_date) < new Date() ? 'text-destructive' : ''}`}
                            >
                                {loan.end_date ? formatDate(loan.end_date) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {loan.reason && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Reason')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{loan.reason}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
