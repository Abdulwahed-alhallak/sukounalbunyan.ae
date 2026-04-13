import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Users,
    TrendingUp,
    BarChart3,
    Rocket,
    Calendar,
    Clock,
    CalendarDays,
    Phone,
    Target,
    Award,
} from 'lucide-react';
import CalendarView from '@/components/calendar-view';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { formatDate, formatCurrency } from '@/utils/helpers';

interface LeadProps {
    message: string;
    stats?: {
        total_leads: number;
        total_deals: number;
        total_users: number;
        total_clients: number;
        converted_leads: number;
        won_deals: number;
    };
    recentDeals?: any[];
    recentLeads?: any[];
    calendarEvents?: any[];
    dealCallsChart?: any[];
    dealStageChart?: any[];
    pipelines?: any[];
}

export default function CompanyDashboard({
    message,
    stats,
    recentDeals,
    recentLeads,
    calendarEvents,
    dealCallsChart,
    dealStageChart,
    pipelines,
}: LeadProps) {
    const { t } = useTranslation();
    const [selectedPipeline, setSelectedPipeline] = useState(pipelines?.[0]?.id?.toString() || '');

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('CRM') }]} pageTitle={t('Strategic Intel Terminal')}>
            <Head title={t('Dashboard')} />

            <div className="space-y-8 duration-700 animate-in fade-in">
                {/* Global Market Vectors */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: t('Projected Deals'),
                            value: stats?.total_deals || 0,
                            icon: Rocket,
                            color: 'text-foreground',
                            bg: 'bg-muted/500/10',
                            route: 'lead.deals.index',
                        },
                        {
                            title: t('Acquisition Leads'),
                            value: stats?.total_leads || 0,
                            icon: TrendingUp,
                            color: 'text-foreground',
                            bg: 'bg-foreground/10',
                            route: 'lead.leads.index',
                        },
                        {
                            title: t('Operational Users'),
                            value: stats?.total_users || 0,
                            icon: Users,
                            color: 'text-foreground',
                            bg: 'bg-foreground/10',
                            route: 'users.index',
                        },
                        {
                            title: t('Strategic Clients'),
                            value: stats?.total_clients || 0,
                            icon: Target,
                            color: 'text-foreground',
                            bg: 'bg-foreground/10',
                            route: 'users.index',
                            params: { role: 'client' },
                        },
                    ]?.map((card, i) => (
                        <div
                            key={i}
                            onClick={() => router.get(route(card.route), card.params)}
                            className="premium-card glass-effect group cursor-pointer transition-transform duration-300 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className={`rounded-xl p-3 ${card.bg}`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </div>
                                    <TrendingUp className="animate-pulse-slow h-4 w-4 text-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                                    <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                                        {card.title}
                                    </p>
                                </div>
                            </CardContent>
                        </div>
                    ))}
                </div>

                {/* Main Visual Intelligence Sector */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Mission Timeline Calendar */}
                    <div className="delay-300 duration-700 animate-in fade-in slide-in-from-bottom-4 lg:col-span-2">
                        <Card className="premium-card glass-effect h-full overflow-hidden border-none shadow-2xl">
                            <CardHeader className="border-b bg-muted/20 p-6 backdrop-blur-md">
                                <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                                    <div className="rounded-lg bg-foreground/10 p-2">
                                        <Calendar className="h-5 w-5 text-foreground" />
                                    </div>
                                    {t('Strategic Mission Timeline')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <CalendarView
                                        events={
                                            calendarEvents?.map((event) => ({
                                                id: event.id,
                                                title: event.title,
                                                startDate: event.startDate,
                                                endDate: event.endDate,
                                                time: event.time || '00:00',
                                                color: 'hsl(var(--primary))',
                                                description: `${t('Task')}: ${event.title}`,
                                                type: 'Sector Action',
                                            })) || []
                                        }
                                        onEventClick={() => {}}
                                        onDateClick={() => {}}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Visualization Column */}
                    <div className="space-y-8">
                        {/* Status Distribution Radar */}
                        <div className="delay-400 duration-700 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="premium-card glass-effect overflow-hidden border-none shadow-xl">
                                <CardHeader className="border-b bg-muted/10 pb-2">
                                    <CardTitle className="text-md flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-foreground" />
                                        {t('Acquisition Flux Distribution')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {dealCallsChart && dealCallsChart.length > 0 ? (
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={dealCallsChart}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {dealCallsChart?.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    index === 0
                                                                        ? 'hsl(var(--primary))'
                                                                        : 'hsl(var(--primary) / 0.5)'
                                                                }
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="flex h-[300px] items-center justify-center text-sm italic text-muted-foreground">
                                            {t('Telemetry unavailable')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Stage Amplitude Matrix */}
                        <div className="delay-500 duration-700 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="premium-card glass-effect overflow-hidden border-none shadow-xl">
                                <CardHeader className="border-b bg-muted/10 pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-md flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-foreground" />
                                            {t('Stage Flow Amplitude')}
                                        </CardTitle>
                                        <Select
                                            value={selectedPipeline}
                                            onValueChange={(value) => {
                                                setSelectedPipeline(value);
                                                router.get(
                                                    route('lead.index'),
                                                    { pipeline_id: value },
                                                    { preserveState: true, only: ['dealStageChart'] }
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="h-8 w-32 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pipelines?.map((pipeline: any) => (
                                                    <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                                                        {pipeline.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {dealStageChart && dealStageChart.length > 0 ? (
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={dealStageChart} layout="vertical">
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        horizontal={false}
                                                        className="opacity-10"
                                                    />
                                                    <XAxis type="number" hide />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        className="text-[10px]"
                                                        width={80}
                                                    />
                                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                                    <Bar
                                                        dataKey="deals"
                                                        fill="hsl(var(--primary))"
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={20}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="flex h-[300px] items-center justify-center text-sm italic text-muted-foreground">
                                            {t('Sensor data offline')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Strategic Activity Feed */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {[
                        { title: t('Recent Acquisition Captured'), data: recentDeals, icon: Clock, type: 'deal' },
                        { title: t('Fresh Intel Identified'), data: recentLeads, icon: TrendingUp, type: 'lead' },
                    ]?.map((feed, i) => (
                        <div key={i} className="delay-600 duration-700 animate-in fade-in slide-in-from-bottom-4">
                            <Card className="premium-card glass-effect h-full overflow-hidden border-none shadow-xl">
                                <CardHeader className="border-b bg-muted/20 p-6">
                                    <CardTitle className="flex items-center gap-3 text-lg">
                                        <feed.icon className="h-5 w-5 text-foreground" />
                                        {feed.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {feed.data && feed.data.length > 0 ? (
                                        <div className="space-y-4">
                                            {feed.data?.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="group flex items-center justify-between rounded-xl border border-transparent bg-muted/30 p-4 transition-all hover:border-foreground/20 hover:bg-muted/50"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 transition-transform group-hover:scale-110">
                                                            <Rocket className="h-5 w-5 text-foreground" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold">{item.name}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.stage?.name || item.subject}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <p className="font-mono text-xs italic text-muted-foreground">
                                                            {formatDate(item.created_at)}
                                                        </p>
                                                        {feed.type === 'deal' && item.price && (
                                                            <p className="mt-1 text-xs font-bold text-foreground">
                                                                {formatCurrency(item.price)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <feed.icon className="mb-4 h-12 w-12 opacity-20" />
                                            <p className="text-sm font-medium">{t('No activity detected')}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
