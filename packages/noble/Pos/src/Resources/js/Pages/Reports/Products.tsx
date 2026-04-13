import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/helpers';
import { Package, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Cell,
    Pie,
} from 'recharts';
import { DataTable } from '@/components/ui/data-table';
import NoRecordsFound from '@/components/no-records-found';
import { PieChart as PieChartComponent } from '@/components/charts/PieChart';
import { BarChart as BarChartComponent } from '@/components/charts/BarChart';

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FFC658',
    '#FF7C7C',
    '#8DD1E1',
    '#D084D0',
];

interface ProductsReportProps {
    productData: Array<{
        name: string;
        sku: string;
        total_quantity: number;
        total_revenue: number;
        total_orders: number;
    }>;
}

export default function ProductsReport({ productData }: ProductsReportProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('POS'), url: route('pos.index') }, { label: t('Product Report') }]}
            pageTitle={t('Product Report')}
        >
            <Head title={t('Product Report')} />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-border bg-gradient-to-r from-muted/50 to-muted">
                        <div className="absolute end-2 top-2">
                            <Package className="h-5 w-5 text-foreground opacity-80" />
                        </div>
                        <CardHeader className="space-y-0 pb-1 pt-3 text-center">
                            <div className="text-2xl font-bold text-foreground">{productData?.length || 0}</div>
                        </CardHeader>
                        <CardContent className="pb-3 pt-1 text-center">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Products')}</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-border bg-gradient-to-r from-muted/50 to-muted">
                        <div className="absolute end-2 top-2">
                            <TrendingUp className="h-5 w-5 text-foreground opacity-80" />
                        </div>
                        <CardHeader className="space-y-0 pb-1 pt-3 text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {formatCurrency(productData?.reduce((sum, p) => sum + p.total_revenue, 0) || 0)}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 pt-1 text-center">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Revenue')}</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-border bg-gradient-to-r from-muted/50 to-muted">
                        <div className="absolute end-2 top-2">
                            <PieChart className="h-5 w-5 text-foreground opacity-80" />
                        </div>
                        <CardHeader className="space-y-0 pb-1 pt-3 text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {productData?.reduce((sum, p) => sum + p.total_quantity, 0) || 0}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 pt-1 text-center">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Quantity')}</CardTitle>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-border bg-gradient-to-r from-muted/50 to-muted">
                        <div className="absolute end-2 top-2">
                            <BarChart3 className="h-5 w-5 text-foreground opacity-80" />
                        </div>
                        <CardHeader className="space-y-0 pb-1 pt-3 text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {productData?.reduce((sum, p) => sum + p.total_orders, 0) || 0}
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 pt-1 text-center">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Orders')}</CardTitle>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Revenue Bar Chart */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart3 className="h-4 w-4" />
                                {t('Top 10 Products by Revenue')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center pb-0 pt-0">
                            {productData?.length > 0 ? (
                                <div className="w-full">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={
                                                productData?.slice(0, 10)?.map((product) => ({
                                                    name: product.name.substring(0, 15),
                                                    value: Number(product.total_revenue) || 0,
                                                })) || []
                                            }
                                            margin={{ bottom: 60 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                                interval={0}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex h-48 items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">{t('No revenue data available')}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quantity Pie Chart */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <PieChart className="h-4 w-4" />
                                {t('Quantity Distribution')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3 pt-0">
                            {productData?.length > 0 ? (
                                <div className="w-full">
                                    <ResponsiveContainer width="100%" height={320}>
                                        <RechartsPieChart>
                                            <Tooltip formatter={(value) => [value, t('Quantity')]} />
                                            <Pie
                                                data={productData?.slice(0, 10) || []}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name }) => name}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="total_quantity"
                                            >
                                                {(productData?.slice(0, 10) || [])?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex h-48 items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <PieChart className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                        <p className="text-sm">{t('No quantity data available')}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Data Table */}
                <Card className="shadow-sm">
                    <CardHeader className="bg-muted/50/50 border-b p-6">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Package className="h-5 w-5 text-foreground" />
                            {t('Product Performance Report')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-96 w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={productData || []}
                                    columns={[
                                        {
                                            key: 'name',
                                            header: t('Product Name'),
                                        },
                                        {
                                            key: 'sku',
                                            header: t('SKU'),
                                        },
                                        {
                                            key: 'total_quantity',
                                            header: t('Quantity Sold'),
                                        },
                                        {
                                            key: 'total_revenue',
                                            header: t('Total Revenue'),
                                            render: (value: number) => formatCurrency(value),
                                        },
                                        {
                                            key: 'total_orders',
                                            header: t('Orders'),
                                        },
                                    ]}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={Package}
                                            title={t('No products found')}
                                            description={t('No product data available for the selected period.')}
                                            hasFilters={false}
                                            onClearFilters={() => {}}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
