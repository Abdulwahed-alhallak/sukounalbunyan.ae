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
                filename: `tax-summary-${filters.from_date}-to-${filters.to_date}.pdf`,
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
            <Head title={t('Tax Summary Report')} />
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
                            </div>
                        </div>
                        <div className="text-end">
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{t('TAX SUMMARY REPORT')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(filters.from_date)} {t('to')} {formatDate(filters.to_date)}
                            </p>
                        </div>
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="border-b-2 border-black">
                            <td className="px-2 py-3 text-sm font-semibold">{t('Tax Collected (Sales)')}</td>
                            <td className="px-2 py-3 text-end"></td>
                        </tr>
                        {data.tax_collected.items?.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-border">
                                <td className="px-6 py-2 text-sm">{item.tax_name}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-black font-semibold">
                            <td className="px-2 py-3 text-sm">{t('Total Tax Collected')}</td>
                            <td className="px-2 py-3 text-end text-sm">{formatCurrency(data.tax_collected.total)}</td>
                        </tr>
                        <tr className="border-b-2 border-black">
                            <td className="px-2 py-3 text-sm font-semibold">{t('Tax Paid (Purchases)')}</td>
                            <td className="px-2 py-3 text-end"></td>
                        </tr>
                        {data.tax_paid.items?.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-border">
                                <td className="px-6 py-2 text-sm">{item.tax_name}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-black font-semibold">
                            <td className="px-2 py-3 text-sm">{t('Total Tax Paid')}</td>
                            <td className="px-2 py-3 text-end text-sm">{formatCurrency(data.tax_paid.total)}</td>
                        </tr>
                        <tr className="border-t-4 border-black font-bold">
                            <td className="px-2 py-4 text-base">{t('Net Tax Liability')}</td>
                            <td className="px-2 py-4 text-end text-base">{formatCurrency(data.net_tax_liability)}</td>
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
