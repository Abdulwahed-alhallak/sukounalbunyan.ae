import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from '@/components/charts';
import { Building2, ShoppingCart, CreditCard, Crown } from "lucide-react";
import { formatCurrency } from '@/utils/helpers';

interface SuperAdminDashboardProps {
    stats: {
        order_payments: number;
        total_orders: number;
        total_plans: number;
        total_companies: number;
    };
    chartData: Array<{
        month: string;
        orders: number;
        payments: number;
    }>;
}

export default function SuperAdminDashboard({ stats, chartData }: SuperAdminDashboardProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Dashboard') }]}
            pageTitle={t('Dashboard')}
        >
            <Head title={t('Dashboard')} />

            <div className="relative space-y-6">
                {/* Premium Background Dots */}
                <div className="absolute inset-0 vercel-dots opacity-[0.1] -z-10" />

                {/* Header Section */}
                <div className="flex flex-col gap-1 mb-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{t('Overview')}</h2>
                    <p className="text-sm text-muted-foreground">{t('Real-time insights across your enterprise ecosystem.')}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="premium-card p-6 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-all duration-300">
                                    <ShoppingCart className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">{t('Total Orders')}</p>
                                    <p className="text-3xl font-black tracking-tighter text-foreground">{stats.total_orders}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-6 group animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:100ms]">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-all duration-300">
                                    <CreditCard className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">{t('Order Payments')}</p>
                                    <p className="text-3xl font-black tracking-tighter text-foreground">{formatCurrency(stats.order_payments)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-6 group animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:200ms]">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-all duration-300">
                                    <Crown className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">{t('Total Plans')}</p>
                                    <p className="text-3xl font-black tracking-tighter text-foreground">{stats.total_plans}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-6 group animate-in fade-in slide-in-from-bottom-4 duration-500 [animation-delay:300ms]">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 border border-border group-hover:border-foreground/20 transition-all duration-300">
                                    <Building2 className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">{t('Total Companies')}</p>
                                    <p className="text-3xl font-black tracking-tighter text-foreground">{stats.total_companies}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Chart */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>{t('Recent Orders (Monthly)')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <LineChart
                        data={chartData}
                        dataKey="orders"
                        height={300}
                        showTooltip={true}
                        showGrid={true}
                        lines={[
                            { dataKey: 'orders', color: 'hsl(var(--foreground))', name: 'Orders' }
                        ]}
                        xAxisKey="month"
                        showLegend={true}
                    />
                </CardContent>
            </Card>

        </AuthenticatedLayout>
    );
}
