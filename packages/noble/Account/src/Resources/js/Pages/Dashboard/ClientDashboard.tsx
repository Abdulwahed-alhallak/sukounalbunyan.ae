import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts';
import { CreditCard, DollarSign, TrendingUp, Receipt } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface ClientProps {
    stats: {
        total_payments: number;
        total_revenues: number;
        payment_count: number;
    };
    monthlyPayments?: Array<{ month: string; payments: number }>;
    recentReturnInvoices: Array<{
        id: number;
        invoice_number: string;
        amount: number;
        date: string;
        status: string;
    }>;
    recentCreditNotes: Array<{
        id: number;
        credit_note_number: string;
        amount: number;
        date: string;
        status: string;
    }>;
    customer: {
        name: string;
    };
}

export default function ClientDashboard({
    stats,
    monthlyPayments,
    recentReturnInvoices,
    recentCreditNotes,
    customer,
}: ClientProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Accounting') }, { label: t('Dashboard') }]}
            pageTitleClass="text-lg"
            pageTitle={t('Dashboard')}
        >
            <Head title={t('Dashboard')} />

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">
                            {t('Total Payments Made')}
                        </CardTitle>
                        <DollarSign className="h-8 w-8 text-foreground opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.total_payments)}</div>
                        <p className="mt-1 text-xs text-foreground opacity-80">{t('Total amount paid')}</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">{t('Total Revenue')}</CardTitle>
                        <TrendingUp className="h-8 w-8 text-foreground opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.total_revenues)}</div>
                        <p className="mt-1 text-xs text-foreground opacity-80">{t('Revenue generated')}</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">{t('Payment Count')}</CardTitle>
                        <CreditCard className="h-8 w-8 text-foreground opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.payment_count}</div>
                        <p className="mt-1 text-xs text-foreground opacity-80">{t('Total transactions')}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-base">{t('Monthly Payment Trend')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <LineChart
                        data={monthlyPayments}
                        height={300}
                        showTooltip={true}
                        showGrid={true}
                        lines={[{ dataKey: 'payments', color: '#3b82f6', name: t('Payments') }]}
                        xAxisKey="month"
                        showLegend={true}
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">{t('Recent Return Sales Invoice')}</CardTitle>
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 space-y-3 overflow-y-auto">
                            {recentReturnInvoices.length > 0 ? (
                                recentReturnInvoices?.map((invoice) => (
                                    <div
                                        key={invoice.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-muted p-2">
                                                <Receipt className="h-4 w-4 text-destructive" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{invoice.invoice_number}</p>
                                                <p className="text-xs text-muted-foreground">{invoice.status}</p>
                                                <p className="text-xs text-muted-foreground">{invoice.date}</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-destructive">
                                            {formatCurrency(invoice.amount)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Receipt className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>{t('No return invoices yet')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">{t('Recent Credit Notes')}</CardTitle>
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 space-y-3 overflow-y-auto">
                            {recentCreditNotes.length > 0 ? (
                                recentCreditNotes?.map((note) => (
                                    <div
                                        key={note.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-muted p-2">
                                                <CreditCard className="h-4 w-4 text-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{note.credit_note_number}</p>
                                                <p className="text-xs text-muted-foreground">{note.status}</p>
                                                <p className="text-xs text-muted-foreground">{note.date}</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-foreground">{formatCurrency(note.amount)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <CreditCard className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>{t('No credit notes yet')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
