import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Plus, Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { LineChart, PieChart } from '@/components/charts';

interface PosProps {
    [key: string]: any;
    stats: {
        today_sales: number;
        week_sales: number;
        month_sales: number;
        total_sales: number;
        total_revenue: number;
        avg_transaction: number;
        total_products: number;
        low_stock_products: number;
        total_customers: number;
        walk_in_sales: number;
    };
    topProducts: Array<{
        name: string;
        total_quantity: number;
        total_revenue: number;
    }>;
    recentSales: Array<{
        id: number;
        sale_number: string;
        total: number;
        created_at: string;
        customer?: { name: string };
        warehouse?: { name: string };
    }>;
    salesByStatus: Record<string, number>;
    last10DaysSales: Array<{
        date: string;
        sales: number;
    }>;
    outOfStockProductsList: Array<{
        product_name: string;
        sku: string;
        warehouse_name: string;
        stock: number;
    }>;
}

export default function PosIndex({
    stats,
    topProducts,
    recentSales,
    salesByStatus,
    last10DaysSales,
    outOfStockProductsList,
}: PosProps) {
    const { t } = useTranslation();

    const StatCard = ({ title, value, subtitle, color = 'blue', icon: Icon }: any) => {
        const glowColors = {
            blue: 'text-blue-500',
            green: 'text-emerald-500',
            red: 'text-rose-500',
            purple: 'text-purple-500',
            orange: 'text-amber-500',
        };
        const currentGlow = glowColors[color as keyof typeof glowColors] || glowColors.blue;

        return (
            <div className="premium-card group relative overflow-hidden border border-border p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl dark:border-white/5">
                <div className={`absolute -bottom-6 -end-6 opacity-[0.03] transition-opacity duration-700 group-hover:opacity-[0.1] ${currentGlow}`}>
                    <Icon className="h-24 w-24" />
                </div>
                <div className="relative z-10 mb-4 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted shadow-inner transition-transform duration-500 group-hover:scale-110 ${currentGlow.replace('text-', 'text- opacity-10 bg-')}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                        {title}
                    </span>
                </div>
                <div className="relative z-10">
                    <h3 className="tabular-nums origin-left text-3xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-105">
                        {value}
                    </h3>
                    {subtitle && (
                        <p className="mt-1 text-[10px] font-bold tracking-tight text-muted-foreground opacity-80">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const statusChartData = Object.entries(salesByStatus || {})?.map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count as number,
    }));

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('POS') }]} pageTitle={t('POS Dashboard')}>
            <Head title={t('POS Dashboard')} />

            <div className="space-y-6">
                {/* Enhanced Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title={t('Today Revenue')}
                        value={formatCurrency(stats.today_sales)}
                        subtitle={t('Current day revenue')}
                        color="green"
                        icon={DollarSign}
                    />
                    <StatCard
                        title={t('Total Sales')}
                        value={stats.total_sales}
                        subtitle={`${formatCurrency(stats.total_revenue)} ${t('revenue')}`}
                        color="blue"
                        icon={ShoppingCart}
                    />
                    <StatCard
                        title={t('Avg Transaction')}
                        value={formatCurrency(stats.avg_transaction)}
                        subtitle={`${stats.total_customers} ${t('customers')}`}
                        color="purple"
                        icon={Users}
                    />
                    <StatCard title={t('Total Products')} value={stats.total_products} color="orange" icon={Package} />
                </div>

                {/* Last 10 Days Sales Report */}
                <Card className="premium-card">
                    <CardHeader>
                        <CardTitle>{t('Last 10 Days Sales Report')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={last10DaysSales}
                            height={300}
                            showTooltip={true}
                            showGrid={true}
                            lines={[{ dataKey: 'sales', color: '#3b82f6', name: t('Daily Sales') }]}
                            xAxisKey="date"
                            showLegend={true}
                        />
                    </CardContent>
                </Card>

                {/* Out of Stock Products Warehouse Wise */}
                <Card className="premium-card">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertTriangle className="me-2 h-5 w-5 text-destructive" />
                            {t('Out of Stock Products (Warehouse Wise)')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {outOfStockProductsList?.length > 0 ? (
                                outOfStockProductsList?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse"></div>
                                            <div>
                                                <h4 className="font-medium text-foreground">
                                                    {item.product_name} ({item.sku})
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('Warehouse')}: {item.warehouse_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Badge variant="destructive" className="font-bold">
                                                {item.stock} {t('units')}
                                            </Badge>
                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('Out of Stock')}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
                                    <p>{t('No out of stock products')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Top Selling Products */}
                    <Card className="premium-card overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-foreground" />
                                {t('Top Selling Products')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {topProducts && topProducts.length > 0 ? (
                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {topProducts.slice(0, 5)?.map((product, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-lg bg-muted/30 p-4 transition-all hover:bg-muted/60 hover:translate-x-1"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-foreground">{product.name}</h4>
                                                <p className="mt-1 text-xs text-muted-foreground font-medium">
                                                    {product.total_quantity} {t('units sold')}
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="text-sm font-black text-foreground">
                                                    {formatCurrency(product.total_revenue)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <Package className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                    <p className="text-sm font-medium">{t('No product data')}</p>
                                    <p className="text-xs">{t('Top products will appear here')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="premium-card overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-foreground" />
                                {t('Recent Transactions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {recentSales && recentSales.length > 0 ? (
                                <div className="max-h-80 space-y-3 overflow-y-auto">
                                    {recentSales.slice(0, 5)?.map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="flex items-center justify-between rounded-lg bg-muted/30 p-4 transition-all hover:bg-muted/60 hover:translate-x-1"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-foreground">
                                                    {sale.sale_number}
                                                </h4>
                                                <p className="mt-1 text-xs text-muted-foreground font-medium">
                                                    {sale.customer?.name || t('Walk-in')}
                                                </p>
                                            </div>
                                            <div className="text-end">
                                                <p className="text-sm font-black text-blue-500">{formatCurrency(sale.total)}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                                                    {formatDate(sale.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <ShoppingCart className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                    <p className="text-sm font-medium">{t('No recent sales')}</p>
                                    <p className="text-xs">{t('New transactions will appear here')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
