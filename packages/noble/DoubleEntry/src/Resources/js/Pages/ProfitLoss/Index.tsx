import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Search, Printer } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface Account {
    id: number;
    account_code: string;
    account_name: string;
    balance: number;
}

interface ProfitLossData {
    revenue: Account[];
    expenses: Account[];
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
    from_date: string;
    to_date: string;
}

interface ProfitLossProps {
    [key: string]: any;
    profitLoss: ProfitLossData;
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export default function Index() {
    const { t } = useTranslation();
    const { profitLoss, auth } = usePage<ProfitLossProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [fromDate, setFromDate] = useState(urlParams.get('from_date') || profitLoss.from_date);
    const [toDate, setToDate] = useState(urlParams.get('to_date') || profitLoss.to_date);

    const handleGenerate = () => {
        if (!fromDate || !toDate) return;
        router.get(
            route('double-entry.profit-loss.index'),
            {
                from_date: fromDate,
                to_date: toDate,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Double Entry') }, { label: t('Profit & Loss') }]}
            pageTitle={t('Profit & Loss Statement')}
        >
            <Head title={t('Profit & Loss')} />

            <div className="mx-auto max-w-7xl space-y-6">
                <Card className="border-0 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                                    <FileText className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{t('Profit & Loss Statement')}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(profitLoss.from_date)} - {formatDate(profitLoss.to_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-end gap-3">
                                <div>
                                    <Label className="text-xs">{t('From Date')}</Label>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(value) => setFromDate(value)}
                                        placeholder={t('Select from date')}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">{t('To Date')}</Label>
                                    <DatePicker
                                        value={toDate}
                                        onChange={(value) => setToDate(value)}
                                        placeholder={t('Select to date')}
                                    />
                                </div>
                                <Button onClick={handleGenerate} disabled={!fromDate || !toDate} size="sm">
                                    <Search className="me-2 h-4 w-4" />
                                    {t('Generate')}
                                </Button>
                                {auth.user?.permissions?.includes('print-profit-loss') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const printUrl =
                                                route('double-entry.profit-loss.print') +
                                                `?from_date=${fromDate}&to_date=${toDate}&download=pdf`;
                                            window.open(printUrl, '_blank');
                                        }}
                                    >
                                        <Printer className="me-2 h-4 w-4" />
                                        {t('Download PDF')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-foreground">{t('Total Revenue')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-foreground">
                                    {formatCurrency(profitLoss.total_revenue)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-destructive">{t('Total Expenses')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-destructive">
                                    {formatCurrency(profitLoss.total_expenses)}
                                </p>
                            </div>
                            <div
                                className={`rounded-xl border p-6 text-center shadow-md transition-all hover:shadow-lg ${
                                    profitLoss.net_profit >= 0
                                        ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10'
                                        : 'border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10'
                                }`}
                            >
                                <h4
                                    className={`mb-2 font-semibold ${profitLoss.net_profit >= 0 ? 'text-primary' : 'text-destructive'}`}
                                >
                                    {profitLoss.net_profit >= 0 ? t('Net Profit') : t('Net Loss')}
                                </h4>
                                <p
                                    className={`text-3xl font-bold tabular-nums ${profitLoss.net_profit >= 0 ? 'text-primary' : 'text-destructive'}`}
                                >
                                    {formatCurrency(Math.abs(profitLoss.net_profit))}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-3 text-lg font-bold text-foreground">{t('Revenue')}</h3>
                                <div className="space-y-1">
                                    {profitLoss.revenue.length > 0 ? (
                                        profitLoss.revenue?.map((account) => (
                                            <div
                                                key={account.id}
                                                className="flex items-center justify-between border-b border-border py-1.5"
                                            >
                                                <p className="text-sm font-medium">
                                                    <span className="text-foreground">{account.account_code}</span> -{' '}
                                                    {account.account_name}
                                                </p>
                                                <p className="text-sm font-semibold tabular-nums">
                                                    {formatCurrency(account.balance)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-4 text-center text-muted-foreground">
                                            {t('No revenue accounts')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-lg font-bold text-foreground">{t('Expenses')}</h3>
                                <div className="space-y-1">
                                    {profitLoss.expenses.length > 0 ? (
                                        profitLoss.expenses?.map((account) => (
                                            <div
                                                key={account.id}
                                                className="flex items-center justify-between border-b border-border py-1.5"
                                            >
                                                <p className="text-sm font-medium">
                                                    <span className="text-foreground">{account.account_code}</span> -{' '}
                                                    {account.account_name}
                                                </p>
                                                <p className="text-sm font-semibold tabular-nums">
                                                    {formatCurrency(account.balance)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-4 text-center text-muted-foreground">
                                            {t('No expense accounts')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="flex items-center justify-between border-t-2 border-border pt-3">
                                <p className="font-bold">{t('Total Revenue')}</p>
                                <p className="font-bold tabular-nums">{formatCurrency(profitLoss.total_revenue)}</p>
                            </div>
                            <div className="flex items-center justify-between border-t-2 border-border pt-3">
                                <p className="font-bold">{t('Total Expenses')}</p>
                                <p className="font-bold tabular-nums">{formatCurrency(profitLoss.total_expenses)}</p>
                            </div>
                        </div>

                        <div className="mt-8 border-t-2 border-border pt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-foreground">
                                    {profitLoss.net_profit >= 0 ? t('Net Profit') : t('Net Loss')}
                                </h3>
                                <p
                                    className={`text-base font-bold tabular-nums ${profitLoss.net_profit >= 0 ? 'text-foreground' : 'text-destructive'}`}
                                >
                                    {formatCurrency(Math.abs(profitLoss.net_profit))}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
