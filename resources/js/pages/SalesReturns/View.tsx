import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { SalesReturn } from './types';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { getStatusBadgeClasses } from './utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText, Download, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ViewProps {
    return: SalesReturn;
    auth: any;
    [key: string]: any;
}

function View() {
    const { t } = useTranslation();
    const { return: salesReturn, auth } = usePage<ViewProps>().props;

    const downloadPDF = () => {
        const printUrl = route('sales-returns.print', salesReturn.id) + '?download=pdf';
        window.open(printUrl, '_blank');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Sales Returns'), url: route('sales-returns.index') },
                { label: t('Sales Return Details') },
            ]}
            pageTitle={`${t('Sales Return')} #${salesReturn.return_number}`}
        >
            <Head title={`${t('Sales Return')} #${salesReturn.return_number}`} />

            <div className="space-y-6">
                {/* Return Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-lg text-muted-foreground">#{salesReturn.return_number}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={getStatusBadgeClasses(salesReturn.status)}>
                                    {t(salesReturn.status.toUpperCase())}
                                </span>
                                <div className="text-end">
                                    <div className="text-2xl font-bold">{formatCurrency(salesReturn.total_amount)}</div>
                                    <div className="text-sm text-muted-foreground">{t('Total Amount')}</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`grid grid-cols-1 gap-6 ${salesReturn.customer_details?.billing_address || salesReturn.customer_details?.shipping_address ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
                        >
                            <div>
                                <h3 className="mb-2 font-semibold">{t('CUSTOMER')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">{salesReturn.customer?.name}</div>
                                    <div className="text-muted-foreground">{salesReturn.customer?.email}</div>
                                </div>
                                {salesReturn.customer_details?.billing_address && (
                                    <div className="mt-3">
                                        <div className="mb-1 text-sm font-medium">{t('Billing Address')}</div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div>{salesReturn.customer_details.billing_address.name}</div>
                                            <div>{salesReturn.customer_details.billing_address.address_line_1}</div>
                                            <div>
                                                {salesReturn.customer_details.billing_address.city},{' '}
                                                {salesReturn.customer_details.billing_address.state}{' '}
                                                {salesReturn.customer_details.billing_address.zip_code}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {salesReturn.customer_details?.shipping_address && (
                                <div>
                                    <h3 className="mb-2 font-semibold">{t('SHIPPING ADDRESS')}</h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div>{salesReturn.customer_details.shipping_address.name}</div>
                                        <div>{salesReturn.customer_details.shipping_address.address_line_1}</div>
                                        <div>
                                            {salesReturn.customer_details.shipping_address.city},{' '}
                                            {salesReturn.customer_details.shipping_address.state}{' '}
                                            {salesReturn.customer_details.shipping_address.zip_code}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="mb-2 font-semibold">{t('DETAILS')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('Return Date')}</span>
                                        <span>{formatDate(salesReturn.return_date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('Warehouse')}</span>
                                        <span>{salesReturn.warehouse?.name || '-'}</span>
                                    </div>
                                </div>
                                <div className="mt-4 rounded bg-muted p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {auth.user?.permissions?.includes('print-sales-returns') && (
                                                <Button variant="outline" size="sm" onClick={downloadPDF}>
                                                    <Download className="me-2 h-4 w-4" />
                                                    {t('Download PDF')}
                                                </Button>
                                            )}
                                            {salesReturn.status === 'draft' &&
                                                auth.user?.permissions?.includes('approve-sales-returns-invoices') && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            router.post(
                                                                route('sales-returns.approve', salesReturn.id),
                                                                {},
                                                                {
                                                                    onSuccess: () => {
                                                                        router.reload();
                                                                    },
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle className="me-2 h-4 w-4" />
                                                        {t('Approve Return')}
                                                    </Button>
                                                )}
                                        </div>
                                        <div className="text-end">
                                            <div className="text-xl font-bold text-foreground">
                                                {formatCurrency(salesReturn.total_amount)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{t('Return Amount')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {salesReturn.notes && (
                            <div className="mt-4 border-t pt-4">
                                <span className="text-sm font-medium">{t('Notes')}:</span>
                                <span className="ms-2 text-sm text-muted-foreground">{salesReturn.notes}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Return Items */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">{t('Return Items')}</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-start text-sm font-semibold">{t('Product')}</th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Qty')}</th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">
                                            {t('Unit Price')}
                                        </th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Discount')}</th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Tax')}</th>
                                        <th className="px-4 py-3 text-end text-sm font-semibold">{t('Total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {salesReturn.items?.map((item, index) => (
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
                                            <td className="px-4 py-4 text-end">
                                                {item.return_quantity || item.quantity}
                                            </td>
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

                        {/* Return Summary */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('Subtotal')}</span>
                                    <span className="font-medium">{formatCurrency(salesReturn.subtotal)}</span>
                                </div>
                                {salesReturn.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Discount')}</span>
                                        <span className="font-medium text-destructive">
                                            -{formatCurrency(salesReturn.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                {salesReturn.tax_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Tax')}</span>
                                        <span className="font-medium">{formatCurrency(salesReturn.tax_amount)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{t('Total Return Amount')}</span>
                                        <span className="text-lg font-bold">
                                            {formatCurrency(salesReturn.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

export default View;
