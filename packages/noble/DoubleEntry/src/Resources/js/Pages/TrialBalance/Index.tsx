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
import NoRecordsFound from '@/components/no-records-found';

interface TrialBalanceAccount {
    id: number;
    account_code: string;
    account_name: string;
    debit: number;
    credit: number;
}

interface TrialBalanceData {
    accounts: TrialBalanceAccount[];
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
    from_date: string;
    to_date: string;
}

interface TrialBalanceProps {
    [key: string]: any;
    trialBalance: TrialBalanceData;
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export default function Index() {
    const { t } = useTranslation();
    const { trialBalance, auth } = usePage<TrialBalanceProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [fromDate, setFromDate] = useState(urlParams.get('from_date') || trialBalance.from_date);
    const [toDate, setToDate] = useState(urlParams.get('to_date') || trialBalance.to_date);

    const handleGenerate = () => {
        if (!fromDate || !toDate) return;
        router.get(
            route('double-entry.trial-balance.index'),
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
            breadcrumbs={[{ label: t('Double Entry') }, { label: t('Trial Balance') }]}
            pageTitle={t('Trial Balance')}
        >
            <Head title={t('Trial Balance')} />

            <div className="mx-auto max-w-7xl space-y-6">
                <Card className="border-0 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                                    <FileText className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{t('Trial Balance')}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(trialBalance.from_date)} - {formatDate(trialBalance.to_date)}
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
                                {auth.user?.permissions?.includes('print-trial-balance') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const printUrl =
                                                route('double-entry.trial-balance.print') +
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
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-foreground">{t('Total Debit')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-foreground">
                                    {formatCurrency(trialBalance.total_debit)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <h4 className="mb-2 font-semibold text-foreground">{t('Total Credit')}</h4>
                                <p className="text-3xl font-bold tabular-nums text-foreground">
                                    {formatCurrency(trialBalance.total_credit)}
                                </p>
                            </div>
                        </div>

                        {!trialBalance.is_balanced && (
                            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                                <p className="font-medium text-destructive">
                                    ⚠️ {t('Warning: Trial balance is not balanced!')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                        {trialBalance.accounts && trialBalance.accounts.length > 0 ? (
                            <>
                                <div className="space-y-1">
                                    <div className="grid grid-cols-12 gap-4 border-b-2 border-border py-2 font-bold">
                                        <div className="col-span-2">{t('Account Code')}</div>
                                        <div className="col-span-6">{t('Account Name')}</div>
                                        <div className="col-span-2 text-end">{t('Debit')}</div>
                                        <div className="col-span-2 text-end">{t('Credit')}</div>
                                    </div>
                                    {trialBalance.accounts?.map((account) => (
                                        <div
                                            key={account.id}
                                            className="grid grid-cols-12 gap-4 border-b border-border py-1.5"
                                        >
                                            <div className="col-span-2 text-sm">
                                                <span className="text-foreground">{account.account_code}</span>
                                            </div>
                                            <div className="col-span-6 text-sm font-medium">{account.account_name}</div>
                                            <div className="col-span-2 text-end text-sm font-semibold tabular-nums">
                                                {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                                            </div>
                                            <div className="col-span-2 text-end text-sm font-semibold tabular-nums">
                                                {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 grid grid-cols-12 gap-4 border-t-2 border-border pt-3 font-bold">
                                    <div className="col-span-8">{t('TOTAL')}</div>
                                    <div className="col-span-2 text-end tabular-nums">
                                        {formatCurrency(trialBalance.total_debit)}
                                    </div>
                                    <div className="col-span-2 text-end tabular-nums">
                                        {formatCurrency(trialBalance.total_credit)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NoRecordsFound
                                icon={FileText}
                                title={t('No accounts found')}
                                description={t('No account transactions found for the selected date range.')}
                                className="h-auto py-12"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
