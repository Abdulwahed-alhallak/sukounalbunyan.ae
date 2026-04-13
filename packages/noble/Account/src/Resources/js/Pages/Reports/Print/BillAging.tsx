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
                filename: `bill-aging-${filters.as_of_date}.pdf`,
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
            <Head title={t('Bill Aging Report')} />
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
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{t('BILL AGING REPORT')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {t('As of')}: {formatDate(filters.as_of_date)}
                            </p>
                        </div>
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="px-2 py-2 text-start text-sm font-semibold">{t('Vendor')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">{t('Current')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">1-30 {t('Days')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">31-60 {t('Days')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">61-90 {t('Days')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">&gt;90 {t('Days')}</th>
                            <th className="px-2 py-2 text-end text-sm font-semibold">{t('Total')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.vendors?.map((vendor: any, idx: number) => (
                            <tr key={idx} className="border-b border-border">
                                <td className="px-2 py-2 text-sm">{vendor.vendor_name}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(vendor.current)}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(vendor['1_30_days'])}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(vendor['31_60_days'])}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(vendor['61_90_days'])}</td>
                                <td className="px-2 py-2 text-end text-sm">{formatCurrency(vendor.over_90_days)}</td>
                                <td className="px-2 py-2 text-end text-sm font-semibold">
                                    {formatCurrency(vendor.total)}
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-black font-bold">
                            <td className="px-2 py-3 text-sm">{t('TOTAL')}</td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(data.aging_summary.current)}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(data.aging_summary['1_30_days'])}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(data.aging_summary['31_60_days'])}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(data.aging_summary['61_90_days'])}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">
                                {formatCurrency(data.aging_summary.over_90_days)}
                            </td>
                            <td className="px-2 py-3 text-end text-sm">{formatCurrency(data.aging_summary.total)}</td>
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
