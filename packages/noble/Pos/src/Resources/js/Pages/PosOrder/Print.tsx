import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface PosItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    tax_amount?: number;
    total_amount?: number;
    total: number;
    taxes?: { tax_name: string; rate: number }[];
    product: {
        id: number;
        name: string;
        sku?: string;
    };
}

interface PosSale {
    id: number;
    sale_number: string;
    customer?: {
        name: string;
        email?: string;
    };
    warehouse?: {
        name: string;
    };
    subtotal: number;
    discount_amount: number;
    tax_amount?: number;
    total: number;
    total_amount?: number;
    created_at: string;
    zatca_qr?: string;
    items: PosItem[];
}

interface PrintProps {
    sale: PosSale;
    [key: string]: any;
}

export default function Print() {
    const { t } = useTranslation();
    const { sale } = usePage<PrintProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.sale-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `pos-sale-${sale.sale_number}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            };

            try {
                await html2pdf().set(opt).from(printContent).save();
                setTimeout(() => window.close(), 1000);
            } catch (error) {
                console.error('PDF generation failed:', error);
            }
        }

        setIsDownloading(false);
    };

    return (
        <div className="min-h-screen bg-card">
            <Head title={t('POS Sale')} />

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

            <div className="sale-container mx-auto max-w-4xl bg-card p-12">
                {/* Header */}
                <div className="mb-12 flex items-start justify-between">
                    <div className="w-1/2">
                        <h1 className="mb-4 text-2xl font-bold">
                            {getCompanySetting('company_name') || 'YOUR COMPANY'}
                        </h1>
                        <div className="space-y-1 text-sm">
                            {getCompanySetting('company_address') && <p>{getCompanySetting('company_address')}</p>}
                            {(getCompanySetting('company_city') || getCompanySetting('company_state')) && (
                                <p>
                                    {getCompanySetting('company_city')}, {getCompanySetting('company_state')}
                                </p>
                            )}
                            {(getCompanySetting('company_country') || getCompanySetting('company_zipcode')) && (
                                <p>
                                    {getCompanySetting('company_country')} - {getCompanySetting('company_zipcode')}
                                </p>
                            )}
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
                        </div>
                    </div>
                    <div className="w-1/2 text-end">
                        <h2 className="mb-2 text-2xl font-bold">{t('POS SALE')}</h2>
                        <p className="text-lg font-semibold">{sale.sale_number}</p>
                        <div className="mt-2 text-sm">
                            <p>
                                {t('Date')}: {formatDate(sale.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="mb-12 flex justify-between">
                    <div className="w-1/2">
                        <h3 className="mb-3 font-bold">{t('CUSTOMER')}</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold">{sale.customer?.name || t('Walk-in Customer')}</p>
                            {sale.customer?.email && <p>{sale.customer.email}</p>}
                        </div>
                    </div>
                    <div className="w-1/2 text-end">
                        <h3 className="mb-3 font-bold">{t('WAREHOUSE')}</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold">{sale.warehouse?.name || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-3 text-start font-bold">{t('Product')}</th>
                                <th className="py-3 text-center font-bold">{t('Qty')}</th>
                                <th className="py-3 text-end font-bold">{t('Unit Price')}</th>
                                <th className="py-3 text-center font-bold">{t('Tax')}</th>
                                <th className="py-3 text-end font-bold">{t('Tax Amount')}</th>
                                <th className="py-3 text-end font-bold">{t('Total')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items?.map((item, index) => (
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
                                    <td className="py-4 text-end">{formatCurrency(item.price)}</td>
                                    <td className="py-4 text-center">
                                        {item.taxes && item.taxes.length > 0 ? (
                                            <div className="text-xs">
                                                {item.taxes?.map((tax, taxIndex) => (
                                                    <div key={taxIndex}>
                                                        {tax.tax_name} ({tax.rate}%)
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="py-4 text-end">
                                        {item.tax_amount > 0 ? <span>{formatCurrency(item.tax_amount)}</span> : '-'}
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
                <div className="mb-8 flex justify-end">
                    <div className="w-80">
                        <div className="border border-border p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>{t('Subtotal')}:</span>
                                    <span>{formatCurrency(sale.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('Discount')}:</span>
                                    <span className="font-medium text-destructive">
                                        -{formatCurrency(sale.discount_amount || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('Tax')}:</span>
                                    <span>{formatCurrency(sale.tax_amount || 0)}</span>
                                </div>
                                <div className="mt-2 border-t border-border pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>{t('TOTAL')}:</span>
                                        <span>{formatCurrency(sale.total_amount || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border pt-6 text-center">
                    <p className="mb-4 mt-2 text-sm">{t('Thank you for your business!')}</p>

                    {/* ZATCA Phase 1 QR Code */}
                    {sale.zatca_qr && (
                        <div className="no-print-page-break mt-6 flex justify-center">
                            <img src={sale.zatca_qr} alt="ZATCA e-Invoice QR" className="h-32 w-32 object-contain" />
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    font-family: Arial, sans-serif;
                }

                @page {
                    margin: 0.25in;
                    size: A4;
                }

                .sale-container {
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

                    .sale-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
