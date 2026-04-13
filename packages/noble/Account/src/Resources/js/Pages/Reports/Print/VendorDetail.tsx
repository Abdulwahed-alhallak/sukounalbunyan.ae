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
                filename: `vendor-detail-${data.vendor.name}-${filters.start_date || 'all'}.pdf`,
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
            <Head title={t('Vendor Detail Report')} />
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
                        <div className="text-right">
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{t('VENDOR DETAIL REPORT')}</h2>
                            <p className="text-sm text-muted-foreground">
                                {t('Vendor')}: {data.vendor.name}
                            </p>
                            {filters.start_date && (
                                <p className="text-sm text-muted-foreground">
                                    {t('Period')}: {formatDate(filters.start_date)} - {formatDate(filters.end_date)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="mb-3 border-b-2 border-black pb-2 text-lg font-bold">{t('PURCHASE INVOICES')}</h3>
                    <table className="mb-4 w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Invoice Number')}</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Date')}</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Due Date')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Subtotal')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Tax')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Total')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Balance')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.invoices?.map((invoice: any, idx: number) => (
                                <tr key={idx} className="border-b border-border">
                                    <td className="px-2 py-2 text-sm">{invoice.invoice_number}</td>
                                    <td className="px-2 py-2 text-sm">{formatDate(invoice.date)}</td>
                                    <td className="px-2 py-2 text-sm">{formatDate(invoice.due_date)}</td>
                                    <td className="px-2 py-2 text-right text-sm">{formatCurrency(invoice.subtotal)}</td>
                                    <td className="px-2 py-2 text-right text-sm">
                                        {formatCurrency(invoice.tax_amount)}
                                    </td>
                                    <td className="px-2 py-2 text-right text-sm">
                                        {formatCurrency(invoice.total_amount)}
                                    </td>
                                    <td className="px-2 py-2 text-right text-sm font-semibold">
                                        {formatCurrency(invoice.balance_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-6">
                    <h3 className="mb-3 border-b-2 border-black pb-2 text-lg font-bold">{t('PURCHASE RETURNS')}</h3>
                    <table className="mb-4 w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Return Number')}</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Date')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Subtotal')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Tax')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.returns?.map((ret: any, idx: number) => (
                                <tr key={idx} className="border-b border-border">
                                    <td className="px-2 py-2 text-sm">{ret.return_number}</td>
                                    <td className="px-2 py-2 text-sm">{formatDate(ret.date)}</td>
                                    <td className="px-2 py-2 text-right text-sm">{formatCurrency(ret.subtotal)}</td>
                                    <td className="px-2 py-2 text-right text-sm">{formatCurrency(ret.tax_amount)}</td>
                                    <td className="px-2 py-2 text-right text-sm font-semibold">
                                        {formatCurrency(ret.total_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-6">
                    <h3 className="mb-3 border-b-2 border-black pb-2 text-lg font-bold">{t('DEBIT NOTES')}</h3>
                    <table className="mb-4 w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Debit Note Number')}</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Date')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Total')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Applied')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Balance')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.debit_notes?.map((note: any, idx: number) => (
                                <tr key={idx} className="border-b border-border">
                                    <td className="px-2 py-2 text-sm">{note.debit_note_number}</td>
                                    <td className="px-2 py-2 text-sm">{formatDate(note.date)}</td>
                                    <td className="px-2 py-2 text-right text-sm">
                                        {formatCurrency(note.total_amount)}
                                    </td>
                                    <td className="px-2 py-2 text-right text-sm">
                                        {formatCurrency(note.applied_amount)}
                                    </td>
                                    <td className="px-2 py-2 text-right text-sm font-semibold">
                                        {formatCurrency(note.balance_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-6">
                    <h3 className="mb-3 border-b-2 border-black pb-2 text-lg font-bold">{t('VENDOR PAYMENTS')}</h3>
                    <table className="mb-4 w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Payment Number')}</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Date')}</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold">{t('Bank Account')}</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold">{t('Amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.payments?.map((payment: any, idx: number) => (
                                <tr key={idx} className="border-b border-border">
                                    <td className="px-2 py-2 text-sm">{payment.payment_number}</td>
                                    <td className="px-2 py-2 text-sm">{formatDate(payment.date)}</td>
                                    <td className="px-2 py-2 text-sm">{payment.bank_account || '-'}</td>
                                    <td className="px-2 py-2 text-right text-sm font-semibold">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 border-t-2 border-black pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">{t('Total Invoiced')}:</span>{' '}
                            {formatCurrency(data.summary.total_invoiced)}
                        </div>
                        <div>
                            <span className="font-semibold">{t('Total Returns')}:</span>{' '}
                            {formatCurrency(data.summary.total_returns)}
                        </div>
                        <div>
                            <span className="font-semibold">{t('Total Debit Notes')}:</span>{' '}
                            {formatCurrency(data.summary.total_debit_notes)}
                        </div>
                        <div>
                            <span className="font-semibold">{t('Total Payments')}:</span>{' '}
                            {formatCurrency(data.summary.total_payments)}
                        </div>
                        <div className="col-span-2 text-lg">
                            <span className="font-bold">{t('Balance')}:</span>{' '}
                            <span className="font-bold">{formatCurrency(data.summary.balance)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
                    <p>
                        {t('Generated on')} {formatDate(new Date().toISOString())}
                    </p>
                </div>
            </div>
        </div>
    );
}
