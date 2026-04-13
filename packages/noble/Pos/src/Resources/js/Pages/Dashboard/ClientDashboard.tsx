import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Package, TrendingUp, Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { LineChart } from '@/components/charts';

interface ClientDashboardProps {
    stats: {
        total_purchases: number;
        total_spent: number;
        avg_order_value: number;
    };
    recentPurchases: Array<{
        id: number;
        sale_number: string;
        total: number;
        created_at: string;
        warehouse?: { name: string };
    }>;
    purchasedProducts: Array<{
        name: string;
        sku: string;
        total_quantity: number;
        total_spent: number;
        orders_count: number;
    }>;
    monthlySpending: Array<{
        month: string;
        spending: number;
    }>;
}

export default function ClientDashboard({
    stats,
    recentPurchases,
    purchasedProducts,
    monthlySpending,
}: ClientDashboardProps) {
    const { t } = useTranslation();

    const StatCard = ({ title, value, subtitle, color = 'blue', icon: Icon }: any) => {
        const colorClasses = {
            blue: 'bg-gradient-to-r from-muted/50 to-muted border-border',
            green: 'bg-gradient-to-r from-muted/50 to-muted border-border',
            purple: 'bg-gradient-to-r from-muted/50 to-muted border-border',
        };
        const textColors = {
            blue: 'text-foreground',
            green: 'text-foreground',
            purple: 'text-foreground',
        };
        const iconColors = {
            blue: 'text-foreground',
            green: 'text-foreground',
            purple: 'text-foreground',
        };
        return (
            <Card className={`relative overflow-hidden ${colorClasses[color as keyof typeof colorClasses]}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${textColors[color as keyof typeof textColors]}`}>
                        {title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${iconColors[color as keyof typeof iconColors]}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${textColors[color as keyof typeof textColors]}`}>{value}</div>
                    {subtitle && (
                        <p className={`text-xs ${textColors[color as keyof typeof textColors]} mt-1 opacity-80`}>
                            {subtitle}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('My Purchases') }]} pageTitle={t('My Purchase Dashboard')}>
            <Head title={t('My Purchase Dashboard')} />

            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        title={t('Total Purchases')}
                        value={stats.total_purchases}
                        subtitle={t('Orders placed')}
                        color="blue"
                        icon={ShoppingCart}
                    />
                    <StatCard
                        title={t('Total Spent')}
                        value={formatCurrency(stats.total_spent)}
                        subtitle={t('Lifetime spending')}
                        color="green"
                        icon={DollarSign}
                    />
                    <StatCard
                        title={t('Avg Order Value')}
                        value={formatCurrency(stats.avg_order_value)}
                        subtitle={t('Per transaction')}
                        color="purple"
                        icon={TrendingUp}
                    />
                </div>

                {/* Daily Spending Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('My Spending Trend (Last 10 Days)')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={monthlySpending}
                            height={300}
                            showTooltip={true}
                            showGrid={true}
                            lines={[{ dataKey: 'spending', color: '#3b82f6', name: 'Daily Spending' }]}
                            xAxisKey="month"
                            showLegend={true}
                        />
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* My Purchased Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-foreground" />
                                {t('My Purchased Products')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {purchasedProducts && purchasedProducts.length > 0 ? (
                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {purchasedProducts.slice(0, 10)?.map((product, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-foreground">{product.name}</h4>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {product.total_quantity} {t('units')} • {product.orders_count}{' '}
                                                    {t('orders')}
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="text-sm font-bold text-foreground">
                                                    {formatCurrency(product.total_spent)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Package className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                    <p className="text-sm font-medium">{t('No purchases yet')}</p>
                                    <p className="text-xs">{t('Your purchased products will appear here')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-foreground" />
                                {t('Recent Transactions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentPurchases && recentPurchases.length > 0 ? (
                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {recentPurchases.slice(0, 5)?.map((purchase) => (
                                        <div
                                            key={purchase.id}
                                            className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-foreground">
                                                    {purchase.sale_number}
                                                </h4>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {purchase.warehouse?.name || '-'}
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="text-sm font-bold">{formatCurrency(purchase.total)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(purchase.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <ShoppingCart className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                    <p className="text-sm font-medium">{t('No recent purchases')}</p>
                                    <p className="text-xs">{t('Your transactions will appear here')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
