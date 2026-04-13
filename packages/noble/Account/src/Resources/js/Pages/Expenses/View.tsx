import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface Expense {
    id: number;
    expense_number: string;
    expense_date: string;
    category: { id: number; category_name: string };
    bank_account: { id: number; account_name: string };
    chart_of_account?: { id: number; account_code: string; account_name: string };
    amount: string;
    description: string;
    reference_number: string;
    status: 'draft' | 'approved' | 'posted';
    approved_by: { id: number; name: string } | null;
    creator: { id: number; name: string };
    created_at: string;
}

interface ShowExpenseProps {
    expense: Expense;
}

export default function Show({ expense }: ShowExpenseProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        return (
            <span
                className={`rounded-full px-2 py-1 text-sm ${
                    status === 'posted'
                        ? 'bg-muted text-foreground'
                        : status === 'approved'
                          ? 'bg-muted text-foreground'
                          : 'bg-muted text-foreground'
                }`}
            >
                {status === 'posted' ? t('Posted') : status === 'approved' ? t('Approved') : t('Draft')}
            </span>
        );
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {t('Expense Details')} - {expense.expense_number}
                </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-6">
                <Card>
                    <CardContent>
                        <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                                <span className="font-semibold">{t('Expense Number')}</span>
                                <p className="mt-1 text-muted-foreground">{expense.expense_number}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Expense Date')}</span>
                                <p className="mt-1 text-muted-foreground">{formatDate(expense.expense_date)}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Category')}</span>
                                <p className="mt-1 text-muted-foreground">{expense.category?.category_name || '-'}</p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Bank Account')}</span>
                                <p className="mt-1 text-muted-foreground">
                                    {expense.bank_account?.account_name || '-'}
                                </p>
                            </div>
                            {expense.chart_of_account && (
                                <div>
                                    <span className="font-semibold">{t('Chart of Account')}</span>
                                    <p className="mt-1 text-muted-foreground">
                                        {expense.chart_of_account.account_code} -{' '}
                                        {expense.chart_of_account.account_name}
                                    </p>
                                </div>
                            )}
                            <div>
                                <span className="font-semibold">{t('Amount')}</span>
                                <p className="mt-1 text-lg font-bold text-destructive">
                                    {formatCurrency(expense.amount)}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">{t('Status')}</span>
                                <div className="mt-1">{getStatusBadge(expense.status)}</div>
                            </div>
                            {expense.reference_number && (
                                <div>
                                    <span className="font-semibold">{t('Reference Number')}</span>
                                    <p className="mt-1 text-muted-foreground">{expense.reference_number}</p>
                                </div>
                            )}
                            {expense.approved_by && (
                                <div>
                                    <span className="font-semibold">{t('Approved By')}</span>
                                    <p className="mt-1 text-muted-foreground">{expense.approved_by.name}</p>
                                </div>
                            )}
                        </div>
                        {expense.description && (
                            <div className="mt-4 text-sm">
                                <span className="font-semibold">{t('Description')}</span>
                                <p className="mt-1 rounded bg-muted/50 p-3 text-sm">{expense.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DialogContent>
    );
}
