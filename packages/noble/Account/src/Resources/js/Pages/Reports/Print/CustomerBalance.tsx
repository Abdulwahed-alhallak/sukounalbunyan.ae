import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

export default function Print() {
    const { t } = useTranslation();
    const { data, filters } = usePage<any>().props;
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
                filename: `customer-balance-${filters.as_of_date}.pdf`,
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

    return (
        <div className="min-h-screen bg-card">
            <Head title={t('Customer Balance Summary')} />
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
            <div className="report-container mx-auto max-w-7xl bg-card p-8">
                <div className="mb-8 border-b-2 border-border pb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-foreground">
                                {getCompanySetting('company_name') || 'YOUR COMPANY'}
                            </h1>
                            <div className="space-y-0.5 text-sm text-muted-foreground">
                                {getCompanySetting('company_address') && <p>{getCompanySetting('company_address')}</p>}
                            </div>
                        </div>
                        <div className="text-end">
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{t('CUSTOMER BALANCE SUMMARY')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {t('As of')}: {formatDate(filters.as_of_date)}
                            </p>
                        </div>
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="px-2 py-2 text-start text-sm font-semibold">{t('Customer')}</th>
                            <th className="px-2 py-2 text-start text-sm font-semibold">{t('Email')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">{t('Total Invoiced')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">
                                {t('Total Returns & Credit Notes')}
                            </th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">{t('Total Paid')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">{t('Balance')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.customers?.map((customer: any, idx: number) => (
                            <tr key={idx} className="border-b border-border">
                                <td className="px-2 py-2 text-sm">{customer.customer_name}</td>
                                <td className="px-2 py-2 text-sm">{customer.customer_email}</td>
                                <td className="px-2 py-2 text-end text-sm">
                                    {formatCurrency(customer.total_invoiced)}
                                </td>
                                <td className="px-2 py-2 text-end text-sm">
                                    {formatCurrency(customer.total_returns)}
                                </td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(customer.total_paid)}</td>
                                <td className="px-2 py-2 text-end text-sm font-semibold">
                                    {formatCurrency(customer.balance)}
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-black font-bold">
                            <td colSpan={2} className="px-2 py-3 text-sm">
                                {t('TOTAL')}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(
                                    data.customers.reduce((sum: number, c: any) => sum + c.total_invoiced, 0)
                                )}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(
                                    data.customers.reduce((sum: number, c: any) => sum + c.total_returns, 0)
                                )}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(data.customers.reduce((sum: number, c: any) => sum + c.total_paid, 0))}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">{formatCurrency(data.total_balance)}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
                    <p>
                        {t('Generated on')} {formatDate(new Date().toISOString())}
                    </p>
                </div>
            </div>
        </div>
    );
}
