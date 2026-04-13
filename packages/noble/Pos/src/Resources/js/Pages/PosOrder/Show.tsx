import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getCompanySetting } from '@/utils/helpers';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Download, ArrowLeft, User, Building2, Calendar, Package } from 'lucide-react';

interface PosItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
    product: {
        id: number;
        name: string;
        sku?: string;
        description?: string;
    };
    taxes?: Array<{
        id: number;
        tax_name: string;
        rate: number;
    }>;
}

interface PosSale {
    id: number;
    sale_number: string;
    customer_id?: number;
    customer?: {
        name: string;
        email?: string;
        phone?: string;
    };
    warehouse?: {
        name: string;
    };
    tax_amount?: number;
    pos_date: string;
    status?: string;
    created_at: string;
    items: PosItem[];
    notes?: string;
}

interface ShowProps {
    sale: PosSale;
}

export default function Show() {
    const { t } = useTranslation();
    const { sale } = usePage<ShowProps>().props;

    const downloadPDF = () => {
        const printUrl = route('pos-orders.print', sale.id) + '?download=pdf';
        window.open(printUrl, '_blank');
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'px-2 py-1 rounded-full text-sm bg-muted text-foreground';
            case 'pending':
                return 'px-2 py-1 rounded-full text-sm bg-muted text-foreground';
            case 'cancelled':
                return 'px-2 py-1 rounded-full text-sm bg-muted text-destructive';
            default:
                return 'px-2 py-1 rounded-full text-sm bg-muted text-foreground';
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('POS Orders'), url: route('pos.orders') }, { label: t('POS Sale Details') }]}
            pageTitle={`${t('POS Sale')} `}
        >
            <Head title={`${t('POS Sale')} ${sale.sale_number}`} />

            <div className="space-y-6">
                {/* Sale Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold">{sale.sale_number}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={getStatusBadgeClasses(sale.status || 'completed')}>
                                    {t((sale.status || 'completed').toUpperCase())}
                                </span>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{formatCurrency(sale.total_amount || 0)}</div>
                                    <div className="text-sm text-muted-foreground">{t('Total Amount')}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <h3 className="mb-2 font-semibold">{t('COMPANY')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="font-bold">
                                        {getCompanySetting('company_name') || 'YOUR COMPANY'}
                                    </div>
                                    <div className="text-muted-foreground">{getCompanySetting('company_address')}</div>
                                    <div className="text-muted-foreground">
                                        {getCompanySetting('company_city') || 'City'},{' '}
                                        {getCompanySetting('company_state') || 'State'}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {getCompanySetting('company_country') || 'Country'} -{' '}
                                        {getCompanySetting('company_zipcode') || 'Zipcode'}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {t('Phone')}: {getCompanySetting('company_telephone')}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {t('Email')}: {getCompanySetting('company_email')}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">{t('CUSTOMER')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">{sale.customer?.name || t('Walk-in Customer')}</div>
                                    <div className="text-muted-foreground">{sale.customer?.email || '-'}</div>
                                    {sale.customer?.phone && (
                                        <div className="text-muted-foreground">{sale.customer.phone}</div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <div className="mb-1 text-sm font-medium">{t('Warehouse')}</div>
                                    <div className="text-sm text-muted-foreground">
                                        <div>{sale.warehouse?.name || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold">{t('DETAILS')}</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('Sale Date')}</span>
                                        <span>{formatDate(sale.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">{t('Items')}</span>
                                        <span>{sale.items.length}</span>
                                    </div>
                                </div>
                                <div className="mt-4 rounded bg-muted/50 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={downloadPDF}>
                                                <Download className="mr-2 h-4 w-4" />
                                                {t('Download PDF')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {sale.notes && (
                            <div className="mt-4 border-t pt-4">
                                <span className="text-sm font-medium">{t('Notes')}:</span>
                                <span className="ml-2 text-sm text-muted-foreground">{sale.notes}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sale Items */}
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">{t('Sale Items')}</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left text-sm font-semibold">{t('Product')}</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">{t('Qty')}</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">
                                            {t('Unit Price')}
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">{t('Tax')}</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">
                                            {t('Tax Amount')}
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold">{t('Total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {sale.items?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4">
                                                <div className="font-medium">{item.product?.name}</div>
                                                {item.product?.sku && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {t('SKU:')} {item.product.sku}
                                                    </div>
                                                )}
                                                {item.product?.description && (
                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        {item.product.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">{item.quantity}</td>
                                            <td className="px-4 py-4 text-right">{formatCurrency(item.price)}</td>
                                            <td className="px-4 py-4 text-right">
                                                {item.taxes && item.taxes.length > 0 ? (
                                                    <div className="flex flex-wrap justify-end gap-1">
                                                        {item.taxes?.map((tax) => (
                                                            <Badge key={tax.id} variant="outline" className="text-xs">
                                                                {tax.tax_name} ({tax.rate}%)
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                {item.tax_amount > 0 ? (
                                                    <div className="text-sm">{formatCurrency(item.tax_amount)}</div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right font-semibold">
                                                {formatCurrency(item.total_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Sale Summary */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('Subtotal')}</span>
                                    <span className="font-medium">{formatCurrency(sale.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('Discount')}</span>
                                    <span className="font-medium text-destructive">
                                        -{formatCurrency(sale.discount_amount || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('Tax')}</span>
                                    <span className="font-medium">{formatCurrency(sale.tax_amount || 0)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{t('Total Amount')}</span>
                                        <span className="text-lg font-bold">
                                            {formatCurrency(sale.total_amount || 0)}
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
