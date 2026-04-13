import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';

interface SalesProposal {
    id: number;
    proposal_number: string;
    proposal_date: string;
    due_date: string;
    customer: { id: number; name: string; email: string };
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    status: string;
    payment_terms?: string;
    notes?: string;
    warehouse?: { id: number; name: string };
    items?: Array<{
        id: number;
        product_id: number;
        quantity: number;
        unit_price: number;
        discount_percentage: number;
        discount_amount: number;
        tax_percentage: number;
        tax_amount: number;
        total_amount: number;
        product?: {
            id: number;
            name: string;
            sku?: string;
        };
        taxes?: Array<{
            id: number;
            tax_name: string;
            tax_rate: number;
        }>;
    }>;
}

interface PrintProps {
    proposal: SalesProposal;
    [key: string]: any;
}

export default function Print() {
    const { t } = useTranslation();
    const { proposal } = usePage<PrintProps>().props;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'pdf') {
            downloadPDF();
        }
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);

        const printContent = document.querySelector('.proposal-container');
        if (printContent) {
            const opt = {
                margin: 0.25,
                filename: `sales-proposal-${proposal.proposal_number}.pdf`,
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
            <Head title={t('Sales Proposal')} />

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

            <div className="proposal-container mx-auto max-w-4xl bg-card p-8">
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
                    <div className="w-1/2 text-right">
                        <h2 className="mb-2 text-2xl font-bold">{t('SALES PROPOSAL')}</h2>
                        <p className="text-lg font-semibold">#{proposal.proposal_number}</p>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>
                                {t('Date')}: {formatDate(proposal.proposal_date)}
                            </p>
                            <p>
                                {t('Due')}: {formatDate(proposal.due_date)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 flex justify-between">
                    <div className="w-1/2">
                        <h3 className="mb-3 font-bold">{t('PROPOSAL TO')}</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold">{proposal.customer?.name}</p>
                            <p>{proposal.customer?.email}</p>
                        </div>
                    </div>
                    <div className="w-1/2 text-right">
                        <h3 className="mb-3 font-bold">{t('WAREHOUSE')}</h3>
                        <div className="space-y-1 text-sm">
                            <p>{proposal.warehouse?.name || '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-3 text-left font-bold">{t('ITEM')}</th>
                                <th className="py-3 text-center font-bold">{t('QTY')}</th>
                                <th className="py-3 text-right font-bold">{t('PRICE')}</th>
                                <th className="py-3 text-right font-bold">{t('DISCOUNT')}</th>
                                <th className="py-3 text-right font-bold">{t('TAX')}</th>
                                <th className="py-3 text-right font-bold">{t('TOTAL')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposal.items?.map((item, index) => (
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
                                    <td className="py-4 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="py-4 text-right">
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
                                    <td className="py-4 text-right">
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
                                    <td className="py-4 text-right font-semibold">
                                        {formatCurrency(item.total_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="page-break-inside-avoid mb-4 flex justify-end">
                    <div className="page-break-inside-avoid w-80">
                        <div className="page-break-inside-avoid border border-border p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>{t('Subtotal')}:</span>
                                    <span>{formatCurrency(proposal.subtotal)}</span>
                                </div>
                                {proposal.discount_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>{t('Discount')}:</span>
                                        <span>-{formatCurrency(proposal.discount_amount)}</span>
                                    </div>
                                )}
                                {proposal.tax_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span>{t('Tax')}:</span>
                                        <span>{formatCurrency(proposal.tax_amount)}</span>
                                    </div>
                                )}
                                <div className="mt-2 border-t border-border pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>{t('TOTAL')}:</span>
                                        <span>{formatCurrency(proposal.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-4 text-center">
                    <p className="font-semibold">
                        {t('PAYMENT TERMS')}: {proposal.payment_terms || t('Net 30 Days')}
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

                .proposal-container {
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

                    .proposal-container {
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
