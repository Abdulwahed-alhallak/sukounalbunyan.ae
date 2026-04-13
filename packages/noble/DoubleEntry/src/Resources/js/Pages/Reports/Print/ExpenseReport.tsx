import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface ExpenseItem {
    account_code: string;
    account_name: string;
    amount: number;
}

interface ExpenseReportData {
    expenses: ExpenseItem[];
    total_expenses: number;
}

interface PrintProps {
    data: ExpenseReportData;
    filters: {
        from_date: string;
        to_date: string;
    };
}

export default function Print() {
    const { t } = useTranslation();
    const { data, filters } = usePage<PrintProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    const getPercentage = (amount: number) => {
        if (data.total_expenses === 0) return 0;
        return ((amount / data.total_expenses) * 100).toFixed(1);
    };

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
                filename: `expense-report.pdf`,
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
            <Head title={t('Expense Report')} />

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
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{t('EXPENSE REPORT')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(filters.from_date)} {t('to')} {formatDate(filters.to_date)}
                            </p>
                        </div>
                    </div>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="w-16 px-3 py-2 text-start text-sm font-semibold">{t('Rank')}</th>
                            <th className="w-24 px-3 py-2 text-start text-sm font-semibold">{t('Account Code')}</th>
                            <th className="px-3 py-2 text-start text-sm font-semibold">{t('Expense Category')}</th>
                            <th className="w-32 px-3 py-2 text-end text-sm font-semibold">{t('Amount')}</th>
                            <th className="w-24 px-3 py-2 text-end text-sm font-semibold">{t('% of Total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.expenses?.map((expense, idx) => (
                            <tr key={idx} className="page-break-inside-avoid border-b border-border">
                                <td className="px-3 py-2 text-sm font-medium">{idx + 1}</td>
                                <td className="px-3 py-2 text-sm">{expense.account_code}</td>
                                <td className="break-words px-3 py-2 text-sm">{expense.account_name}</td>
                                <td className="px-3 py-2 text-end text-sm font-semibold tabular-nums">
                                    {formatCurrency(expense.amount)}
                                </td>
                                <td className="px-3 py-2 text-end text-sm tabular-nums">
                                    {getPercentage(expense.amount)}%
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-black">
                            <td colSpan={3} className="px-3 py-3 text-sm font-bold">
                                {t('Total Expenses')}
                            </td>
                            <td className="px-3 py-3 text-end text-sm font-bold tabular-nums">
                                {formatCurrency(data.total_expenses)}
                            </td>
                            <td className="px-3 py-3 text-end text-sm font-bold tabular-nums">100%</td>
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
