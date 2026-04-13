import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts';
import {
    Package,
    Users,
    CheckCircle,
    XCircle,
    UserCheck,
    Building2,
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';

interface AccountProps {
    message: string;
    stats?: {
        total_items: number;
        active_items: number;
        inactive_items: number;
        total_clients: number;
        total_vendors: number;
        total_customer_payment: number;
        total_vendor_payment: number;
    };
    monthlyVendorPayments?: Array<{ month: string; vendor_payments: number }>;
    monthlyCustomerPayments?: Array<{ month: string; customer_payments: number }>;
    recentRevenues?: Array<{ id: number; title: string; description: string; amount: number; date: string }>;
    recentExpenses?: Array<{ id: number; title: string; description: string; amount: number; date: string }>;
    recent_items?: Array<{
        id: number;
        name: string;
        created_at: string;
    }>;
}

export default function AccountIndex({
    message,
    stats,
    monthlyVendorPayments,
    monthlyCustomerPayments,
    recentRevenues,
    recentExpenses,
    recent_items,
}: AccountProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Account') }]}
            pageTitle={t('Account Dashboard')}
            pageTitleClass="text-lg"
        >
            <Head title={t('Account')} />

            {stats && (
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Clients')}</CardTitle>
                            <UserCheck className="h-8 w-8 text-foreground opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats.total_clients || 0}</div>
                            <p className="mt-1 text-xs text-foreground opacity-80">{t('Active clients')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Vendors')}</CardTitle>
                            <Building2 className="h-8 w-8 text-foreground opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats.total_vendors || 0}</div>
                            <p className="mt-1 text-xs text-foreground opacity-80">{t('Active vendors')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-foreground">
                                {t('Total Customer Payment')}
                            </CardTitle>
                            <ArrowDownCircle className="h-8 w-8 text-foreground opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {formatCurrency(stats.total_customer_payment || 0)}
                            </div>
                            <p className="mt-1 text-xs text-foreground opacity-80">{t('Received payments')}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-destructive">
                                {t('Total Vendor Payment')}
                            </CardTitle>
                            <ArrowUpCircle className="h-8 w-8 text-destructive opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">
                                {formatCurrency(stats.total_vendor_payment || 0)}
                            </div>
                            <p className="mt-1 text-xs text-destructive opacity-80">{t('Paid to vendors')}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="h-96">
                        <CardHeader>
                            <CardTitle className="text-base">{t('Monthly Customer Payments')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                data={monthlyCustomerPayments}
                                height={300}
                                showTooltip={true}
                                showGrid={true}
                                lines={[{ dataKey: 'customer_payments', color: '#10b77f', name: 'Customer Payments' }]}
                                xAxisKey="month"
                                showLegend={true}
                            />
                        </CardContent>
                    </Card>

                    {recentRevenues && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base">{t('Recent Revenue')}</CardTitle>
                                <span className="text-xs text-muted-foreground">{t('Last 5 days')}</span>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {recentRevenues.slice(0, 5)?.map((revenue) => (
                                        <div
                                            key={revenue.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">{revenue.title}</p>
                                                <p className="text-xs text-muted-foreground">{revenue.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(revenue.date)}
                                                </p>
                                            </div>
                                            <div className="font-bold text-foreground">
                                                {formatCurrency(revenue.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="h-96">
                        <CardHeader>
                            <CardTitle className="text-base">{t('Monthly Vendor Payments')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                data={monthlyVendorPayments}
                                height={300}
                                showTooltip={true}
                                showGrid={true}
                                lines={[{ dataKey: 'vendor_payments', color: '#ef4444', name: 'Vendor Payments' }]}
                                xAxisKey="month"
                                showLegend={true}
                            />
                        </CardContent>
                    </Card>

                    {recentExpenses && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base">{t('Recent Expenses')}</CardTitle>
                                <span className="text-xs text-muted-foreground">{t('Last 5 days')}</span>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {recentExpenses.slice(0, 5)?.map((expense) => (
                                        <div
                                            key={expense.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">{expense.title}</p>
                                                <p className="text-xs text-muted-foreground">{expense.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(expense.date)}
                                                </p>
                                            </div>
                                            <div className="font-bold text-destructive">
                                                {formatCurrency(expense.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
