import { Head, usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, TrendingUp, TrendingDown, Calendar, FileText, Hash, Building2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ChartOfAccount {
    id: number;
    account_code: string;
    account_name: string;
    level: number;
    normal_balance: string;
    opening_balance: number;
    current_balance: number;
    is_active: boolean;
    description?: string;
    account_type?: { name: string };
    parent_account?: { account_name: string };
}

interface JournalEntry {
    id: number;
    journal_number: string;
    journal_date: string;
    description: string;
    entry_type: string;
}

interface JournalEntryItem {
    id: number;
    description: string;
    debit_amount: number;
    credit_amount: number;
    created_at: string;
    journal_entry: JournalEntry;
}

interface PaginatedHistory {
    data: JournalEntryItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ShowProps {
    chartofaccount: ChartOfAccount;
    history: PaginatedHistory;
    calculatedBalance: number;
    totalDebits: number;
    totalCredits: number;
}

export default function Show() {
    const { t } = useTranslation();
    const { chartofaccount, history, calculatedBalance, totalDebits, totalCredits } = usePage<ShowProps>().props;

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Accounting'), url: route('account.index') },
                { label: t('Chart Of Accounts'), url: route('account.chart-of-accounts.index') },
                { label: t('View') },
            ]}
            pageTitle={t('View Chart Of Account')}
        >
            <Head title={t('View Chart Of Account')} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Account Summary Cards */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-lg bg-muted p-2">
                                        <CreditCard className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-medium">
                                            {chartofaccount.account_name}
                                        </CardTitle>
                                        <p className="mt-1 flex items-center text-sm text-muted-foreground">
                                            <Hash className="mr-1 h-4 w-4" />
                                            {chartofaccount.account_code}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={chartofaccount.is_active ? 'outline' : 'outline'}
                                    className={
                                        chartofaccount.is_active
                                            ? 'border-border bg-muted text-foreground'
                                            : 'border-border bg-muted text-destructive'
                                    }
                                >
                                    {chartofaccount.is_active ? t('Active') : t('Inactive')}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-center space-x-3 rounded-lg bg-muted/50 p-3">
                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{t('Account Type')}</p>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {chartofaccount.account_type?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 rounded-lg bg-muted/50 p-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{t('Parent Account')}</p>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {chartofaccount.parent_account?.account_name || t('None')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 rounded-lg bg-muted/50 p-3">
                                    <div
                                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                                            chartofaccount.normal_balance === 'debit'
                                                ? 'bg-muted text-destructive'
                                                : 'bg-muted text-foreground'
                                        }`}
                                    >
                                        {chartofaccount.normal_balance === 'debit' ? 'DR' : 'CR'}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t('Normal Balance')}</p>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {chartofaccount.normal_balance === 'debit' ? t('Debit') : t('Credit')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 rounded-lg bg-muted/50 p-3">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                                        {chartofaccount.level}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t('Level')}</p>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {t('Level')} {chartofaccount.level}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {chartofaccount.description && (
                                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                                    <p className="mb-1 font-semibold text-foreground">{t('Description')}</p>
                                    <p className="text-sm text-foreground">{chartofaccount.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Balance Cards */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('Opening Balance')}</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {chartofaccount.opening_balance
                                            ? formatCurrency(chartofaccount.opening_balance)
                                            : formatCurrency(0)}
                                    </p>
                                </div>
                                <div className="rounded-full bg-muted p-3">
                                    <TrendingUp className="h-6 w-6 text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('Current Balance')}</p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            chartofaccount.current_balance >= 0 ? 'text-foreground' : 'text-destructive'
                                        }`}
                                    >
                                        {formatCurrency(chartofaccount.current_balance || 0)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{t('Stored')}</p>
                                </div>
                                <div
                                    className={`rounded-full p-3 ${
                                        chartofaccount.current_balance >= 0 ? 'bg-muted' : 'bg-muted'
                                    }`}
                                >
                                    {chartofaccount.current_balance >= 0 ? (
                                        <TrendingUp className="h-6 w-6 text-foreground" />
                                    ) : (
                                        <TrendingDown className="h-6 w-6 text-destructive" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t('Calculated Balance')}
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            calculatedBalance >= 0 ? 'text-foreground' : 'text-foreground'
                                        }`}
                                    >
                                        {formatCurrency(calculatedBalance || 0)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        DR: {formatCurrency(totalDebits)} | CR: {formatCurrency(totalCredits)}
                                    </p>
                                </div>
                                <div className={`rounded-full p-3 ${calculatedBalance >= 0 ? 'bg-muted' : 'bg-muted'}`}>
                                    {calculatedBalance >= 0 ? (
                                        <TrendingUp className="h-6 w-6 text-foreground" />
                                    ) : (
                                        <TrendingDown className="h-6 w-6 text-foreground" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="mt-6">
                <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium">{t('Transaction History')}</h3>
                    </div>
                </CardHeader>
                <CardContent>
                    {history?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">{t('Journal Number')}</TableHead>
                                        <TableHead className="font-semibold">{t('Date')}</TableHead>
                                        <TableHead className="font-semibold">{t('Description')}</TableHead>
                                        <TableHead className="text-right font-semibold">{t('Debit')}</TableHead>
                                        <TableHead className="text-right font-semibold">{t('Credit')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.data?.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <span className="font-mono text-sm text-foreground">
                                                    {item.journal_entry.journal_number}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatDate(item.journal_entry.journal_date)}</TableCell>
                                            <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                                            <TableCell className="text-right">
                                                {item.debit_amount > 0 ? (
                                                    <span className="text-destructive">
                                                        {formatCurrency(item.debit_amount)}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.credit_amount > 0 ? (
                                                    <span className="text-foreground">
                                                        {formatCurrency(item.credit_amount)}
                                                    </span>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg text-muted-foreground">{t('No transaction history found')}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('Transactions will appear here once journal entries are posted')}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
