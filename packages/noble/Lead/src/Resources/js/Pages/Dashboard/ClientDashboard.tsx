import { Tooltip } from '@/components/ui/tooltip';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Rocket, Calendar, Clock, DollarSign, Target } from 'lucide-react';
import CalendarView from '@/components/calendar-view';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { formatDate, formatCurrency } from '@/utils/helpers';

interface ClientDashboardProps {
    [key: string]: any;
    message: string;
    stats?: {
        total_deals: number;
        active_deals: number;
        won_deals: number;
        total_value: number;
    };
    recentDeals?: any[];
    calendarEvents?: any[];
    dealStatusChart?: any[];
}

export default function ClientDashboard({
    message,
    stats,
    recentDeals,
    calendarEvents,
    dealStatusChart,
}: ClientDashboardProps) {
    const { t } = useTranslation();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Dashboard') }]} pageTitle={t('Client Dashboard')}>
            <Head title={t('Client Dashboard')} />

            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Deals')}</CardTitle>
                            <Rocket className="h-5 w-5 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats?.total_deals || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Active Deals')}</CardTitle>
                            <Target className="h-5 w-5 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats?.active_deals || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Won Deals')}</CardTitle>
                            <TrendingUp className="h-5 w-5 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats?.won_deals || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-foreground">{t('Total Value')}</CardTitle>
                            <DollarSign className="h-5 w-5 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {formatCurrency(stats?.total_value || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Calendar */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {t('My Tasks Calendar')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CalendarView
                                events={
                                    calendarEvents?.map((event) => ({
                                        id: event.id,
                                        title: event.title,
                                        startDate: event.startDate,
                                        endDate: event.endDate,
                                        time: event.time || '00:00',
                                        color: 'hsl(var(--primary))',
                                        description: `${t('Task')}: ${event.title} - ${t('Deal')}: ${event.name || ''} - ${t('Status')}: ${t(event.status?.charAt(0).toUpperCase() + event.status?.slice(1) || 'Unknown')}`,
                                        type: 'Deal Task',
                                    })) || []
                                }
                                onEventClick={(event) => {}}
                                onDateClick={(date) => {}}
                            />
                        </CardContent>
                    </Card>

                    {/* Charts and Recent Activity */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-foreground" />
                                    {t('Deal Status')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {dealStatusChart && dealStatusChart.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={dealStatusChart}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                dataKey="value"
                                                nameKey="name"
                                            >
                                                {dealStatusChart?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                        <p className="text-sm">{t('No deal data available')}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-foreground" />
                                    {t('Recent Deals')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentDeals && recentDeals.length > 0 ? (
                                    <div className="max-h-80 space-y-3 overflow-y-auto">
                                        {recentDeals?.map((deal) => (
                                            <div
                                                key={deal.id}
                                                className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-foreground">{deal.name}</h4>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {deal.stage?.name}
                                                    </p>
                                                </div>
                                                <div className="text-end">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(deal.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <Clock className="mx-auto mb-3 h-12 w-12 opacity-30" />
                                        <p className="text-sm font-medium">{t('No recent deals')}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
