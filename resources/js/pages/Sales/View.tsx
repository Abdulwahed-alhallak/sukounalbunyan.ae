import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { SalesInvoice } from './types';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { getStatusBadgeClasses } from './utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePageButtons } from '@/hooks/usePageButtons';

interface ViewProps {
    invoice: SalesInvoice;
    auth: any;
    [key: string]: any;
}

export default function View() {
    const { t } = useTranslation();
    const { invoice, auth } = usePage<ViewProps>().props;

    const pageButtons = usePageButtons('zatcaQRCodeBtn', invoice);

    const signatureStatusButtons = usePageButtons('signatureViewBtn', {
        invoice: invoice,
        invoiceType: 'sales',
    });

    const downloadPDF = () => {
        const printUrl = route('sales-invoices.print', invoice.id) + '?download=pdf';
        window.open(printUrl, '_blank');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Sales Invoice'), url: route('sales-invoices.index') },
                { label: t('Sales Invoice Details') },
            ]}
            pageTitle={`${t('Sales Invoice')} #${invoice.invoice_number}`}
        >
            <Head title={`${t('Sales Invoice')} #${invoice.invoice_number}`} />

            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-lg text-muted-foreground">#{invoice.invoice_number}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={getStatusBadgeClasses(invoice.status)}>
                                    {t(invoice.status.toUpperCase())}
                                </span>
                                <div className="text-end">
                                    <div className="text-2xl font-bold">{formatCurrency(invoice.total_amount)}</div>
                                    <div className="text-sm text-muted-foreground">{t('Total Amount')}</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`grid grid-cols-1 gap-6 ${pageButtons.length > 0 ? (invoice.customer_details?.billing_address || invoice.customer_details?.shipping_address ? 'md:grid-cols-4' : 'md:grid-cols-3') : invoice.customer_details?.billing_address || invoice.customer_details?.shipping_address ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
                        >
                            <div>
                                <h3 className="mb-2 font-semibold">{t('CUSTOMER')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">{invoice.customer?.name}</div>
                                    <div className="text-muted-foreground">{invoice.customer?.email}</div>
                                </div>
                                {invoice.customer_details?.billing_address && (
                                    <div className="mt-3">
                                        <div className="mb-1 text-sm font-medium">{t('Billing Address')}</div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div>{invoice.customer_details.billing_address.name}</div>
                                            <div>{invoice.customer_details.billing_address.address_line_1}</div>
                                            <div>
                                                {invoice.customer_details.billing_address.city},{' '}
                                                {invoice.customer_details.billing_address.state}{' '}
                                                {invoice.customer_details.billing_address.zip_code}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {invoice.customer_details?.shipping_address && (
                                <div>
                                    <h3 className="mb-2 font-semibold">{t('SHIPPING ADDRESS')}</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div>{invoice.customer_details.shipping_address.name}</div>
                                        <div>{invoice.customer_details.shipping_address.address_line_1}</div>
                                        <div>
                                            {invoice.customer_details.shipping_address.city},{' '}
                                            {invoice.customer_details.shipping_address.state}{' '}
                                            {invoice.customer_details.shipping_address.zip_code}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {pageButtons.length > 0 &&
                                pageButtons.map((button, index) => (
                                    <div key={`${button.id}-${index}`}>{button.component}</div>
                                ))}
                            <div>
                                <h3 className="mb-2 font-semibold">{t('DETAILS')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('Invoice Date')}</span>
                                        <span>{formatDate(invoice.invoice_date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('Due Date')}</span>
                                        <span
                                            className={
                                                new Date(invoice.due_date) < new Date() ? 'text-destructive' : ''
                                            }
                                        >
                                            {formatDate(invoice.due_date)}
                                        </span>
                                    </div>
                                    {invoice.type === 'product' && invoice.warehouse && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('Warehouse')}</span>
                                            <span>{invoice.warehouse.name}</span>
                                        </div>
                                    )}
                                    {invoice.payment_terms && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{t('Terms')}</span>
                                            <span>{invoice.payment_terms}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 rounded bg-muted p-3">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {auth.user?.permissions?.includes('print-sales-invoices') && (
                                                <Button variant="outline" size="sm" onClick={downloadPDF}>
                                                    <Download className="me-2 h-4 w-4" />
                                                    {t('Download PDF')}
                                                </Button>
                                            )}
                                            {invoice.status === 'draft' &&
                                                auth.user?.permissions?.includes('post-sales-invoices') && (
                                                    <TooltipProvider>
                                                        <Tooltip delayDuration={0}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        router.post(
                                                                            route('sales-invoices.post', invoice.id),
                                                                            {},
                                                                            {
                                                                                onSuccess: () => {
                                                                                    router.reload();
                                                                                },
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    <FileText className="me-2 h-4 w-4" />
                                                                    {t('Post Invoice')}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {t(
                                                                        'Post invoice to finalize and create journal entries'
                                                                    )}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                        </div>
                                        <div className="text-end sm:text-end">
                                            <div className="text-lg font-bold text-foreground sm:text-xl">
                                                {formatCurrency(invoice.balance_amount)}
                                            </div>
                                            <div className="text-xs text-muted-foreground sm:text-sm">
                                                {t('Balance Due')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {invoice.notes && (
                            <div className="mt-4 border-t pt-4">
                                <span className="text-sm font-medium">{t('Notes')}:</span>
                                <span className="ms-2 text-sm text-muted-foreground">{invoice.notes}</span>
                            </div>
                        )}

                        {signatureStatusButtons.length > 0 &&
                            signatureStatusButtons.map((button) => (
                                <div key={button.id} className="mt-4 border-t pt-4">
                                    {button.component}
                                </div>
                            ))}

                        {/* ZATCA Phase 1 QR Code preview in frontend */}
                        {invoice.zatca_qr && (
                            <div className="mt-4 flex flex-col items-center justify-center border-t pt-4">
                                <h3 className="mb-2 text-sm font-semibold">{t('ZATCA e-Invoice Verification')}</h3>
                                <img
                                    src={invoice.zatca_qr}
                                    alt="ZATCA e-Invoice QR"
                                    className="h-32 w-32 object-contain"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">{t('Invoice Items')}</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-start text-sm font-semibold">{t('Product')}</th>
                                        {invoice.type === 'product' && (
                                            <th className="px-4 py-3 text-end text-sm font-semibold">{t('Qty')}</th>
                                        )}
                                        <th className="px-4 py-3 text-end text-sm font-semibold">
                                            {t('Unit Price')}
                                        </th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Discount')}</th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Tax')}</th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {invoice.items?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4">
                                                <div className="font-medium">{item.product?.name}</div>
                                                {item.product?.sku && (
                                                    <div className="text-sm text-muted-foreground">
                                                        SKU: {item.product.sku}
                                                    </div>
                                                )}
                                                {item.product?.description && (
                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        {item.product.description}
                                                    </div>
                                                )}
                                            </td>
                                            {invoice.type === 'product' && (
                                                <td className="px-4 py-4 text-end">{item.quantity}</td>
                                            )}
                                            <td className="px-4 py-4 text-end">{formatCurrency(item.unit_price)}</td>
                                            <td className="px-4 py-4 text-end">
                                                {item.discount_percentage > 0 ? (
                                                    <div>
                                                        <div>{item.discount_percentage}%</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            -{formatCurrency(item.discount_amount)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-end">
                                                {item.taxes && item.taxes.length > 0 ? (
                                                    <div>
                                                        {item.taxes.map((tax, taxIndex) => (
                                                            <div key={taxIndex} className="text-sm">
                                                                {tax.tax_name} ({tax.tax_rate}%)
                                                            </div>
                                                        ))}
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatCurrency(item.tax_amount)}
                                                        </div>
                                                    </div>
                                                ) : item.tax_percentage > 0 ? (
                                                    <div>
                                                        <div>{item.tax_percentage}%</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatCurrency(item.tax_amount)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-end font-semibold">
                                                {formatCurrency(item.total_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('Subtotal')}</span>
                                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                {invoice.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Discount')}</span>
                                        <span className="font-medium text-destructive">
                                            -{formatCurrency(invoice.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                {invoice.tax_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Tax')}</span>
                                        <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{t('Total Amount')}</span>
                                        <span className="text-lg font-bold">
                                            {formatCurrency(invoice.total_amount)}
                                        </span>
                                    </div>
                                </div>
                                {invoice.paid_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Paid Amount')}</span>
                                        <span className="font-medium text-foreground">
                                            {formatCurrency(invoice.paid_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="font-semibold">{t('Balance Due')}</span>
                                    <span className="text-lg font-bold">{formatCurrency(invoice.balance_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
