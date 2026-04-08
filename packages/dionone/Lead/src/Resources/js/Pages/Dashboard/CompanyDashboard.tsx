import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, TrendingUp, BarChart3, Rocket, Calendar, Clock, CalendarDays, Phone, Target, Award } from 'lucide-react';
import CalendarView from '@/components/calendar-view';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


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

export default function CompanyDashboard({ message, stats, recentDeals, recentLeads, calendarEvents, dealCallsChart, dealStageChart, pipelines }: LeadProps) {
    const { t } = useTranslation();
    const [selectedPipeline, setSelectedPipeline] = useState(pipelines?.[0]?.id?.toString() || '');
    
    return (
        <AuthenticatedLayout
            breadcrumbs={[{label: t('CRM')}]}
            pageTitle={t('Strategic Intel Terminal')}
        >
            <Head title={t('Dashboard')} />
            
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Global Market Vectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: t('Projected Deals'), value: stats?.total_deals || 0, icon: Rocket, color: 'text-foreground', bg: 'bg-muted/500/10', route: 'lead.deals.index' },
                        { title: t('Acquisition Leads'), value: stats?.total_leads || 0, icon: TrendingUp, color: 'text-foreground', bg: 'bg-foreground/10', route: 'lead.leads.index' },
                        { title: t('Operational Users'), value: stats?.total_users || 0, icon: Users, color: 'text-foreground', bg: 'bg-foreground/10', route: 'users.index' },
                        { title: t('Strategic Clients'), value: stats?.total_clients || 0, icon: Target, color: 'text-foreground', bg: 'bg-foreground/10', route: 'users.index', params: { role: 'client' } }
                    ]?.map((card, i) => (
                        <div 
                            key={i} 
                            onClick={() => router.get(route(card.route), card.params)}
                            className="premium-card glass-effect cursor-pointer group hover:-translate-y-1 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${card.bg}`}>
                                        <card.icon className={`h-6 w-6 ${card.color}`} />
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-foreground animate-pulse-slow" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{card.title}</p>
                                </div>
                            </CardContent>
                        </div>
                    ))}
                </div>

                {/* Main Visual Intelligence Sector */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mission Timeline Calendar */}
                    <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        <Card className="premium-card glass-effect h-full overflow-hidden border-none shadow-2xl">
                            <CardHeader className="p-6 border-b bg-muted/20 backdrop-blur-md">
                                <CardTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                                    <div className="p-2 bg-foreground/10 rounded-lg">
                                        <Calendar className="h-5 w-5 text-foreground" />
                                    </div>
                                    {t('Strategic Mission Timeline')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-6">
                                <CalendarView
                                    events={calendarEvents?.map(event => ({
                                        id: event.id,
                                        title: event.title,
                                        startDate: event.startDate,
                                        endDate: event.endDate,
                                        time: event.time || '00:00',
                                        color: 'hsl(var(--primary))',
                                        description: `${t('Task')}: ${event.title}`,
                                        type: 'Sector Action',
                                    })) || []}
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
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                            <Card className="premium-card glass-effect border-none shadow-xl overflow-hidden">
                                <CardHeader className="pb-2 border-b bg-muted/10">
                                    <CardTitle className="flex items-center gap-2 text-md">
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
                                                            <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[300px] flex items-center justify-center text-muted-foreground italic text-sm">
                                            {t('Telemetry unavailable')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Stage Amplitude Matrix */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                            <Card className="premium-card glass-effect border-none shadow-xl overflow-hidden">
                                <CardHeader className="pb-2 border-b bg-muted/10">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-md">
                                            <BarChart3 className="h-4 w-4 text-foreground" />
                                            {t('Stage Flow Amplitude')}
                                        </CardTitle>
                                        <Select 
                                            value={selectedPipeline} 
                                            onValueChange={(value) => {
                                                setSelectedPipeline(value);
                                                router.get(route('lead.index'), { pipeline_id: value }, { preserveState: true, only: ['dealStageChart'] });
                                            }}
                                        >
                                            <SelectTrigger className="w-32 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pipelines?.map((pipeline: any) => (
                                                    <SelectItem key={pipeline.id} value={pipeline.id.toString()}>{pipeline.name}</SelectItem>
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
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="opacity-10" />
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" className="text-[10px]" width={80} />
                                                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                                    <Bar dataKey="deals" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[300px] flex items-center justify-center text-muted-foreground italic text-sm">
                                            {t('Sensor data offline')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Strategic Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[
                        { title: t('Recent Acquisition Captured'), data: recentDeals, icon: Clock, type: 'deal' },
                        { title: t('Fresh Intel Identified'), data: recentLeads, icon: TrendingUp, type: 'lead' }
                    ]?.map((feed, i) => (
                        <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
                            <Card className="premium-card glass-effect border-none shadow-xl overflow-hidden h-full">
                                <CardHeader className="p-6 border-b bg-muted/20">
                                    <CardTitle className="flex items-center gap-3 text-lg">
                                        <feed.icon className="h-5 w-5 text-foreground" />
                                        {feed.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {feed.data && feed.data.length > 0 ? (
                                        <div className="space-y-4">
                                            {feed.data?.map((item: any) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-foreground/20 group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <Rocket className="h-5 w-5 text-foreground" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-sm">{item.name}</h4>
                                                            <p className="text-xs text-muted-foreground">{item.stage?.name || item.subject}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-mono text-muted-foreground italic">{formatDate(item.created_at)}</p>
                                                        {feed.type === 'deal' && item.price && (
                                                            <p className="text-xs font-bold text-foreground mt-1">{formatCurrency(item.price)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <feed.icon className="h-12 w-12 opacity-20 mb-4" />
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