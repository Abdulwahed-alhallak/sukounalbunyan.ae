import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';
import { PurchaseInvoice } from './types';
import { usePageButtons } from '@/hooks/usePageButtons';

interface PrintProps {
    invoice: PurchaseInvoice;
    [key: string]: any;
}

export default function Print() {
    const { t } = useTranslation();
    const { invoice } = usePage<PrintProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    const signaturePrintButtons = usePageButtons('signaturePrintBtn', {
        invoice: invoice,
        invoiceType: 'purchase',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.invoice-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `purchase-invoice-${invoice.invoice_number}.pdf`,
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
            <Head title={t('Purchase Invoice')} />

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

            <div className="invoice-container mx-auto max-w-4xl bg-card p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div className="w-1/2">
                        <h1 className="mb-4 text-2xl font-bold">
                            {getCompanySetting('company_name') || 'YOUR COMPANY'}
                        </h1>
                        <div className="space-y-1 text-sm">
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
                            {getCompanySetting('company_telephone') && (
                                <p>
                                    {t('Phone')}: {getCompanySetting('company_telephone')}
                                </p>
                            )}
                            {getCompanySetting('company_email') && (
                                <p>
                                    {t('Email')}: {getCompanySetting('company_email')}
                                </p>
                            )}
                            {getCompanySetting('registration_number') && (
                                <p>
                                    {t('Registration')}: {getCompanySetting('registration_number')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 text-end">
                        <h2 className="mb-2 text-2xl font-bold">{t('PURCHASE INVOICE')}</h2>
                        <p className="text-lg font-semibold">#{invoice.invoice_number}</p>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>
                                {t('Date')}: {formatDate(invoice.invoice_date)}
                            </p>
                            <p>
                                {t('Due')}: {formatDate(invoice.due_date)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vendor Information */}
                <div className="mb-8 flex justify-between">
                    <div className="w-1/2">
                        <h3 className="mb-3 font-bold">{t('VENDOR')}</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold">{invoice.vendor?.name}</p>
                            <p>{invoice.vendor?.email}</p>
                            {invoice.vendor_details?.billing_address && (
                                <>
                                    <p>{invoice.vendor_details.billing_address.name}</p>
                                    <p>{invoice.vendor_details.billing_address.address_line_1}</p>
                                    <p>
                                        {invoice.vendor_details.billing_address.city},{' '}
                                        {invoice.vendor_details.billing_address.state}{' '}
                                        {invoice.vendor_details.billing_address.zip_code}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 text-end">
                        <h3 className="mb-3 font-bold">{t('SHIP TO')}</h3>
                        <div className="space-y-1 text-sm">
                            {invoice.vendor_details?.shipping_address ? (
                                <>
                                    <p className="font-semibold">{invoice.vendor_details.shipping_address.name}</p>
                                    <p>{invoice.vendor_details.shipping_address.address_line_1}</p>
                                    <p>
                                        {invoice.vendor_details.shipping_address.city},{' '}
                                        {invoice.vendor_details.shipping_address.state}{' '}
                                        {invoice.vendor_details.shipping_address.zip_code}
                                    </p>
                                </>
                            ) : (
                                <p className="text-muted-foreground">{t('Same as vendor address')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-3 text-start font-bold">{t('ITEM')}</th>
                                <th className="py-3 text-center font-bold">{t('QTY')}</th>
                                <th className="py-3 text-end font-bold">{t('PRICE')}</th>
                                <th className="py-3 text-end font-bold">{t('DISCOUNT')}</th>
                                <th className="py-3 text-end font-bold">{t('TAX')}</th>
                                <th className="py-3 text-end font-bold">{t('TOTAL')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items?.map((item, index) => (
                                <tr key={index} className="page-break-inside-avoid">
                                    <td className="py-4">
                                        <div className="font-semibold">{item.product?.name}</div>
                                        {item.product?.sku && (
                                            <div className="text-xs text-muted-foreground">
                                                {t('SKU')}: {item.product.sku}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 text-center">{item.quantity}</td>
                                    <td className="py-4 text-end">{formatCurrency(item.unit_price)}</td>
                                    <td className="py-4 text-end">
                                        {item.discount_percentage > 0 ? (
                                            <>
                                                <div className="text-sm">{item.discount_percentage}%</div>
                                                <div className="text-sm font-medium">
                                                    -{formatCurrency(item.discount_amount)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-sm">0%</div>
                                        )}
                                    </td>
                                    <td className="py-4 text-end">
                                        {item.taxes && item.taxes.length > 0 ? (
                                            <>
                                                {item.taxes.map((tax, taxIndex) => (
                                                    <div key={taxIndex} className="text-sm">
                                                        {tax.tax_name} ({tax.tax_rate}%)
                                                    </div>
                                                ))}
                                                <div className="text-sm font-medium">
                                                    {formatCurrency(item.tax_amount)}
                                                </div>
                                            </>
                                        ) : item.tax_percentage > 0 ? (
                                            <>
                                                <div className="text-sm">{item.tax_percentage}%</div>
                                                <div className="text-sm font-medium">
                                                    {formatCurrency(item.tax_amount)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-sm">0%</div>
                                        )}
                                    </td>
                                    <td className="py-4 text-end font-semibold">
                                        {formatCurrency(item.total_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="page-break-inside-avoid mb-4 flex justify-end">
                    <div className="page-break-inside-avoid w-80">
                        <div className="page-break-inside-avoid border border-border p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>{t('Subtotal')}:</span>
                                    <span>{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                {invoice.discount_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>{t('Discount')}:</span>
                                        <span>-{formatCurrency(invoice.discount_amount)}</span>
                                    </div>
                                )}
                                {invoice.tax_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>{t('Tax')}:</span>
                                        <span>{formatCurrency(invoice.tax_amount)}</span>
                                    </div>
                                )}
                                <div className="mt-2 border-t border-border pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>{t('TOTAL')}:</span>
                                        <span>{formatCurrency(invoice.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border pt-4 text-center">
                    {/* Signature Print Display */}
                    {signaturePrintButtons.length > 0 &&
                        signaturePrintButtons.map((button) => <div key={button.id}>{button.component}</div>)}
                    <p className="font-semibold">
                        {t('PAYMENT TERMS')}: {invoice.payment_terms || t('Net 30 Days')}
                    </p>
                    <p className="mt-2 text-sm">{t('Thank you for your business!')}</p>
                </div>
            </div>

            <style>{`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.5in;
                    size: A4;
                }

                .invoice-container {
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
                        background: white;
                    }

                    .invoice-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
