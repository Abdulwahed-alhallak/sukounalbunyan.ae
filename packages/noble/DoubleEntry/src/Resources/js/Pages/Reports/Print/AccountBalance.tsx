import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface AccountBalanceItem {
    account_code: string;
    account_name: string;
    debit: number;
    credit: number;
    net_balance: number;
}

interface AccountBalanceGroup {
    accounts: AccountBalanceItem[];
    subtotal_debit: number;
    subtotal_credit: number;
    subtotal_net: number;
}

interface AccountBalanceData {
    grouped: Record<string, AccountBalanceGroup>;
    totals: {
        debit: number;
        credit: number;
        net: number;
    };
    as_of_date: string;
}

interface PrintProps {
    data: AccountBalanceData;
    filters: {
        as_of_date: string;
    };
}

export default function Print() {
    const { t } = useTranslation();
    const { data, filters } = usePage<PrintProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

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
                filename: `account-balance-summary.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const },
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

    return (
        <div className="min-h-screen bg-card">
            <Head title={t('Account Balance Summary')} />

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

            <div className="report-container mx-auto max-w-5xl bg-card p-8">
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
                        <div className="text-end">
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{t('ACCOUNT BALANCE SUMMARY')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {t('As of')}: {formatDate(filters.as_of_date)}
                            </p>
                        </div>
                    </div>
                </div>

                {Object.entries(data.grouped)?.map(([type, group]) => (
                    <div key={type} className="page-break-inside-avoid mb-6">
                        <h3 className="mb-2 border-b-2 border-border pb-1 text-base font-bold">{t(type)}</h3>
                        <table className="page-break-inside-avoid mb-4 w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="w-24 px-2 py-2 text-start text-sm font-semibold">
                                        {t('Account Code')}
                                    </th>
                                    <th className="px-2 py-2 text-start text-sm font-semibold">{t('Account Name')}</th>
                                    <th className="w-28 px-2 py-2 text-end text-sm font-semibold">{t('Debit')}</th>
                                    <th className="w-28 px-2 py-2 text-end text-sm font-semibold">{t('Credit')}</th>
                                    <th className="w-32 px-2 py-2 text-end text-sm font-semibold">
                                        {t('Net Balance')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.accounts?.map((account, idx) => (
                                    <tr key={idx} className="border-b border-border">
                                        <td className="px-2 py-2 text-sm">{account.account_code}</td>
                                        <td className="break-words px-2 py-2 text-sm">{account.account_name}</td>
                                        <td className="px-2 py-2 text-end text-sm tabular-nums">
                                            {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                                        </td>
                                        <td className="px-2 py-2 text-end text-sm tabular-nums">
                                            {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                                        </td>
                                        <td className="px-2 py-2 text-end text-sm font-medium tabular-nums">
                                            {formatCurrency(account.net_balance)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-border">
                                    <td colSpan={2} className="px-2 py-2 text-sm font-bold">
                                        {t('Subtotal')} - {t(type)}
                                    </td>
                                    <td className="px-2 py-2 text-end text-sm font-bold tabular-nums">
                                        {formatCurrency(group.subtotal_debit)}
                                    </td>
                                    <td className="px-2 py-2 text-end text-sm font-bold tabular-nums">
                                        {formatCurrency(group.subtotal_credit)}
                                    </td>
                                    <td className="px-2 py-2 text-end text-sm font-bold tabular-nums">
                                        {formatCurrency(group.subtotal_net)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}

                <table className="w-full border-collapse border-t-4 border-black">
                    <tbody>
                        <tr className="font-bold">
                            <td colSpan={2} className="px-2 py-3 text-sm">
                                {t('GRAND TOTAL')}
                            </td>
                            <td className="w-28 px-2 py-3 text-end text-sm tabular-nums">
                                {formatCurrency(data.totals.debit)}
                            </td>
                            <td className="w-28 px-2 py-3 text-end text-sm tabular-nums">
                                {formatCurrency(data.totals.credit)}
                            </td>
                            <td className="w-32 px-2 py-3 text-end text-sm tabular-nums">
                                {formatCurrency(data.totals.net)}
                            </td>
                        </tr>
                    </tbody>
                </table>

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
                    size: A4;
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
