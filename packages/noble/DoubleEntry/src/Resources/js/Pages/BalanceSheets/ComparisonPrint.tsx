import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface ComparisonPrintProps {
    comparison: {
        currentPeriod: any;
        previousPeriod: any;
    };
}

export default function ComparisonPrint() {
    const { t } = useTranslation();
    const { comparison } = usePage<ComparisonPrintProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    const currentPeriod = comparison.current_period || comparison.currentPeriod;
    const previousPeriod = comparison.previous_period || comparison.previousPeriod;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.report-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `balance-sheet-comparison.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' as const },
            };

            try {
                await html2pdf()
                    .set(opt)
                    .from(printContent as HTMLElement)
                    .save();
                setTimeout(() => window.close(), 1000);
            } catch (error) {
                console.error('PDF generation failed:', error);
            }
        }

        setIsDownloading(false);
    };

    const currentItems = (currentPeriod?.items || []).reduce((acc: any, item: any) => {
        if (item?.account?.account_code) {
            acc[item.account.account_code] = item;
        }
        return acc;
    }, {});

    const previousItems = (previousPeriod?.items || []).reduce((acc: any, item: any) => {
        if (item?.account?.account_code) {
            acc[item.account.account_code] = item;
        }
        return acc;
    }, {});

    const allAccountCodes = Array.from(new Set([...Object.keys(currentItems), ...Object.keys(previousItems)])).sort();

    const calculateSectionTotal = (items: any[], sectionType: string) => {
        return (items || [])
            .filter((item: any) => item.section_type === sectionType)
            .reduce((sum: number, item: any) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const renderSection = (sectionType: string, sectionTitle: string) => {
        const sectionAccounts = allAccountCodes.filter((code) => {
            const item = currentItems[code] || previousItems[code];
            return item?.section_type === sectionType;
        });

        if (sectionAccounts.length === 0) return null;

        let currentTotal = 0;
        let previousTotal = 0;

        return (
            <div className="page-break-inside-avoid mb-6">
                <h3 className="mb-2 border-b-2 border-border pb-1 text-base font-bold">{sectionTitle}</h3>
                <table className="w-full border-collapse">
                    <tbody>
                        {sectionAccounts?.map((accountCode) => {
                            const currentItem = currentItems[accountCode];
                            const previousItem = previousItems[accountCode];
                            const currentAmount = parseFloat(currentItem?.amount) || 0;
                            const previousAmount = parseFloat(previousItem?.amount) || 0;
                            const change = currentAmount - previousAmount;

                            currentTotal += currentAmount;
                            previousTotal += previousAmount;

                            return (
                                <tr key={accountCode} className="page-break-inside-avoid border-b border-border">
                                    <td className="px-2 py-2 text-sm" style={{ width: '40%' }}>
                                        {currentItem?.account.account_name || previousItem?.account.account_name}
                                        <span className="ml-1 text-xs text-muted-foreground">({accountCode})</span>
                                    </td>
                                    <td className="px-2 py-2 text-right text-sm tabular-nums" style={{ width: '20%' }}>
                                        {formatCurrency(currentAmount)}
                                    </td>
                                    <td className="px-2 py-2 text-right text-sm tabular-nums" style={{ width: '20%' }}>
                                        {formatCurrency(previousAmount)}
                                    </td>
                                    <td
                                        className="px-2 py-2 text-right text-sm font-medium tabular-nums"
                                        style={{ width: '20%' }}
                                    >
                                        {change >= 0 ? '+' : ''}
                                        {formatCurrency(change)}
                                    </td>
                                </tr>
                            );
                        })}
                        <tr className="border-t-2 border-black font-bold">
                            <td className="px-2 py-2 text-sm">TOTAL {sectionTitle.toUpperCase()}</td>
                            <td className="px-2 py-2 text-right text-sm tabular-nums">
                                {formatCurrency(currentTotal)}
                            </td>
                            <td className="px-2 py-2 text-right text-sm tabular-nums">
                                {formatCurrency(previousTotal)}
                            </td>
                            <td className="px-2 py-2 text-right text-sm tabular-nums">
                                {currentTotal - previousTotal >= 0 ? '+' : ''}
                                {formatCurrency(currentTotal - previousTotal)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-card">
            <Head title={t('Balance Sheet Comparison')} />

            {isDownloading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground bg-opacity-50">
                    <div className="rounded-lg bg-card p-6 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-foreground"></div>
                            <p className="text-lg font-semibold text-foreground">{t('Generating PDF...')}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="report-container mx-auto max-w-6xl bg-card p-8">
                <div className="mb-8 border-b-2 border-border pb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-foreground">
                                {getCompanySetting('company_name') || 'YOUR COMPANY'}
                            </h1>
                            <div className="space-y-0.5 text-sm text-muted-foreground">
                                {getCompanySetting('company_address') && <p>{getCompanySetting('company_address')}</p>}
                                {(getCompanySetting('company_city') ||
                                    getCompanySetting('company_state') ||
                                    getCompanySetting('company_zipcode')) && (
                                    <p>
                                        {getCompanySetting('company_city')}
                                        {getCompanySetting('company_state') &&
                                            `, ${getCompanySetting('company_state')}`}{' '}
                                        {getCompanySetting('company_zipcode')}
                                    </p>
                                )}
                                {getCompanySetting('company_country') && <p>{getCompanySetting('company_country')}</p>}
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="mb-3 text-2xl font-bold text-foreground">
                                {t('COMPARATIVE BALANCE SHEET')}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(currentPeriod?.balance_sheet_date)} vs{' '}
                                {formatDate(previousPeriod?.balance_sheet_date)}
                            </p>
                        </div>
                    </div>
                </div>

                <table className="mb-6 w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="px-2 py-2 text-left text-sm font-semibold" style={{ width: '40%' }}>
                                {t('Account')}
                            </th>
                            <th className="px-2 py-2 text-right text-sm font-semibold" style={{ width: '20%' }}>
                                {formatDate(currentPeriod?.balance_sheet_date)}
                            </th>
                            <th className="px-2 py-2 text-right text-sm font-semibold" style={{ width: '20%' }}>
                                {formatDate(previousPeriod?.balance_sheet_date)}
                            </th>
                            <th className="px-2 py-2 text-right text-sm font-semibold" style={{ width: '20%' }}>
                                {t('Change')}
                            </th>
                        </tr>
                    </thead>
                </table>

                {renderSection('assets', t('ASSETS'))}
                {renderSection('liabilities', t('LIABILITIES'))}
                {renderSection('equity', t('EQUITY'))}

                <div className="mt-6 border-t-4 border-black pt-4">
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="font-bold">
                                <td className="px-2 py-2 text-sm" style={{ width: '40%' }}>
                                    TOTAL ASSETS
                                </td>
                                <td className="px-2 py-2 text-right text-sm tabular-nums" style={{ width: '20%' }}>
                                    {formatCurrency(calculateSectionTotal(currentPeriod?.items, 'assets'))}
                                </td>
                                <td className="px-2 py-2 text-right text-sm tabular-nums" style={{ width: '20%' }}>
                                    {formatCurrency(calculateSectionTotal(previousPeriod?.items, 'assets'))}
                                </td>
                                <td className="px-2 py-2 text-right text-sm tabular-nums" style={{ width: '20%' }}>
                                    {formatCurrency(
                                        calculateSectionTotal(currentPeriod?.items, 'assets') -
                                            calculateSectionTotal(previousPeriod?.items, 'assets')
                                    )}
                                </td>
                            </tr>
                            <tr className="border-t font-bold">
                                <td className="px-2 py-2 text-sm">TOTAL LIABILITIES AND EQUITY</td>
                                <td className="px-2 py-2 text-right text-sm tabular-nums">
                                    {formatCurrency(
                                        calculateSectionTotal(currentPeriod?.items, 'liabilities') +
                                            calculateSectionTotal(currentPeriod?.items, 'equity')
                                    )}
                                </td>
                                <td className="px-2 py-2 text-right text-sm tabular-nums">
                                    {formatCurrency(
                                        calculateSectionTotal(previousPeriod?.items, 'liabilities') +
                                            calculateSectionTotal(previousPeriod?.items, 'equity')
                                    )}
                                </td>
                                <td className="px-2 py-2 text-right text-sm tabular-nums">
                                    {formatCurrency(
                                        calculateSectionTotal(currentPeriod?.items, 'liabilities') +
                                            calculateSectionTotal(currentPeriod?.items, 'equity') -
                                            (calculateSectionTotal(previousPeriod?.items, 'liabilities') +
                                                calculateSectionTotal(previousPeriod?.items, 'equity'))
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
                    <p>
                        {t('Generated on')} {formatDate(new Date().toISOString())}
                    </p>
                </div>
            </div>

            <style>{`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4 landscape;
                }

                .report-container {
                    max-width: 100%;
                    margin: 0;
                    box-shadow: none;
                }

                .page-break-inside-avoid {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }

                @media print {
                    body {
                        background: hsl(var(--card));
                    }

                    .report-container {
                        box-shadow: none;
                    }

                    .page-break-inside-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
