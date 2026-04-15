import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface ComparisonProps {
    [key: string]: any;
    comparison: {
        id: number;
        currentPeriod: {
            id: number;
            balance_sheet_date: string;
            financial_year: string;
            total_assets: number;
            total_liabilities: number;
            total_equity: number;
            items: Array<{
                id: number;
                section_type: string;
                sub_section: string;
                amount: number;
                account: {
                    account_code: string;
                    account_name: string;
                };
            }>;
        };
        previousPeriod: {
            id: number;
            balance_sheet_date: string;
            financial_year: string;
            total_assets: number;
            total_liabilities: number;
            total_equity: number;
            items: Array<{
                id: number;
                section_type: string;
                sub_section: string;
                amount: number;
                account: {
                    account_code: string;
                    account_name: string;
                };
            }>;
        };
    };
}

export default function Comparison() {
    const { t } = useTranslation();
    const { comparison, auth } = usePage<ComparisonProps>().props;

    if (!comparison) {
        return (
            <AuthenticatedLayout
                breadcrumbs={[
                    { label: t('Double Entry') },
                    { label: t('Balance Sheets'), url: route('double-entry.balance-sheets.index') },
                    { label: t('Comparison') },
                ]}
                pageTitle={t('Balance Sheet Comparison')}
            >
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground">{t('Loading comparison data...')}</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const currentPeriod = comparison.current_period || comparison.currentPeriod;
    const previousPeriod = comparison.previous_period || comparison.previousPeriod;

    // Group items by account for comparison
    const currentItems = (currentPeriod?.items || []).reduce(
        (acc, item) => {
            if (item?.account?.account_code) {
                acc[item.account.account_code] = item;
            }
            return acc;
        },
        {} as Record<string, any>
    );

    const previousItems = (previousPeriod?.items || []).reduce(
        (acc, item) => {
            if (item?.account?.account_code) {
                acc[item.account.account_code] = item;
            }
            return acc;
        },
        {} as Record<string, any>
    );

    // Get all unique account codes
    const allAccountCodes = Array.from(new Set([...Object.keys(currentItems), ...Object.keys(previousItems)])).sort();

    // Calculate totals for each section
    const calculateSectionTotal = (items: any[], sectionType: string) => {
        return (items || [])
            .filter((item) => item.section_type === sectionType)
            .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const renderComparisonSection = (sectionType: string, sectionTitle: string) => {
        const sectionAccounts = allAccountCodes.filter((code) => {
            const item = currentItems[code] || previousItems[code];
            return item?.section_type === sectionType;
        });

        if (sectionAccounts.length === 0) return null;

        let currentTotal = 0;
        let previousTotal = 0;

        return (
            <div className="mb-8">
                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-foreground">{sectionTitle}</h3>

                <div className="space-y-2">
                    {sectionAccounts?.map((accountCode) => {
                        const currentItem = currentItems[accountCode];
                        const previousItem = previousItems[accountCode];

                        const currentAmount = parseFloat(currentItem?.amount) || 0;
                        const previousAmount = parseFloat(previousItem?.amount) || 0;
                        const change = currentAmount - previousAmount;

                        currentTotal += currentAmount;
                        previousTotal += previousAmount;

                        return (
                            <div key={accountCode} className="grid grid-cols-5 gap-4 rounded bg-muted/50 px-4 py-2">
                                <div className="col-span-2">
                                    <span className="font-medium">
                                        {currentItem?.account.account_name || previousItem?.account.account_name}
                                    </span>
                                    <span className="ms-2 text-sm text-muted-foreground">({accountCode})</span>
                                </div>
                                <div className="text-end">{formatCurrency(currentAmount)}</div>
                                <div className="text-end">{formatCurrency(previousAmount)}</div>
                                <div
                                    className={`text-end font-medium ${change >= 0 ? 'text-foreground' : 'text-destructive'}`}
                                >
                                    {change >= 0 ? '+' : ''}
                                    {formatCurrency(change)}
                                </div>
                            </div>
                        );
                    })}

                    <div className="grid grid-cols-5 gap-4 rounded border-2 border-border bg-muted/50 px-4 py-3 font-bold">
                        <div className="col-span-2">TOTAL {sectionTitle.toUpperCase()}</div>
                        <div className="text-end">{formatCurrency(currentTotal)}</div>
                        <div className="text-end">{formatCurrency(previousTotal)}</div>
                        <div
                            className={`text-end ${currentTotal - previousTotal >= 0 ? 'text-foreground' : 'text-destructive'}`}
                        >
                            {currentTotal - previousTotal >= 0 ? '+' : ''}
                            {formatCurrency(currentTotal - previousTotal)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Double Entry') },
                { label: t('Balance Sheets'), url: route('double-entry.balance-sheets.index') },
                { label: t('Comparison') },
            ]}
            pageTitle={t('Balance Sheet Comparison')}
        >
            <Head title={t('Balance Sheet Comparison')} />

            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
                                <FileText className="h-5 w-5 text-foreground" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl">{t('Balance Sheet Comparison')}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(currentPeriod?.balance_sheet_date)} vs{' '}
                                    {formatDate(previousPeriod?.balance_sheet_date)}
                                </p>
                            </div>
                            {auth?.user?.permissions?.includes('print-balance-sheets') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const currentId = comparison.current_period?.id || comparison.currentPeriod?.id;
                                        const previousId =
                                            comparison.previous_period?.id || comparison.previousPeriod?.id;
                                        const printUrl =
                                            route('double-entry.balance-sheets.comparison.print') +
                                            `?current_id=${currentId}&previous_id=${previousId}&download=pdf`;
                                        window.open(printUrl, '_blank');
                                    }}
                                    className="gap-2"
                                >
                                    <Printer className="h-4 w-4" />
                                    {t('Download PDF')}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {/* Comparison Table */}
                <Card>
                    <CardContent className="p-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-foreground">{t('COMPARATIVE BALANCE SHEET')}</h2>
                        </div>

                        {/* Column Headers */}
                        <div className="mb-4 grid grid-cols-5 gap-4 rounded border-b-2 border-border bg-muted px-4 py-3 font-semibold">
                            <div className="col-span-2">{t('Account')}</div>
                            <div className="text-end">{formatDate(currentPeriod?.balance_sheet_date)}</div>
                            <div className="text-end">{formatDate(previousPeriod?.balance_sheet_date)}</div>
                            <div className="text-end">{t('Change')}</div>
                        </div>

                        {/* Assets */}
                        {renderComparisonSection('assets', t('ASSETS'))}

                        {/* Liabilities */}
                        {renderComparisonSection('liabilities', t('LIABILITIES'))}

                        {/* Equity */}
                        {renderComparisonSection('equity', t('EQUITY'))}

                        {/* Summary */}
                        <div className="mt-8 border-t-2 border-border pt-4">
                            <div className="grid grid-cols-5 gap-4 rounded border-2 border-border bg-muted px-4 py-3 text-lg font-bold">
                                <div className="col-span-2">TOTAL ASSETS</div>
                                <div className="text-end">
                                    {formatCurrency(calculateSectionTotal(currentPeriod?.items, 'assets'))}
                                </div>
                                <div className="text-end">
                                    {formatCurrency(calculateSectionTotal(previousPeriod?.items, 'assets'))}
                                </div>
                                <div className="text-end">
                                    {formatCurrency(
                                        calculateSectionTotal(currentPeriod?.items, 'assets') -
                                            calculateSectionTotal(previousPeriod?.items, 'assets')
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-5 gap-4 rounded border-2 border-border bg-muted px-4 py-3 text-lg font-bold">
                                <div className="col-span-2">TOTAL LIABILITIES AND EQUITY</div>
                                <div className="text-end">
                                    {formatCurrency(
                                        calculateSectionTotal(currentPeriod?.items, 'liabilities') +
                                            calculateSectionTotal(currentPeriod?.items, 'equity')
                                    )}
                                </div>
                                <div className="text-end">
                                    {formatCurrency(
                                        calculateSectionTotal(previousPeriod?.items, 'liabilities') +
                                            calculateSectionTotal(previousPeriod?.items, 'equity')
                                    )}
                                </div>
                                <div className="text-end">
                                    {formatCurrency(
                                        calculateSectionTotal(currentPeriod?.items, 'liabilities') +
                                            calculateSectionTotal(currentPeriod?.items, 'equity') -
                                            (calculateSectionTotal(previousPeriod?.items, 'liabilities') +
                                                calculateSectionTotal(previousPeriod?.items, 'equity'))
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
