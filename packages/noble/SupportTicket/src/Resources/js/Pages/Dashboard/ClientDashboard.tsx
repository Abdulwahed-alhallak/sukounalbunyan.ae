import { Tooltip } from '@/components/ui/tooltip';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TicketIcon,
    CheckCircleIcon,
    LinkIcon,
    BookOpenIcon,
    HelpCircleIcon,
    Clock,
    TrendingUp,
    Users,
    Calendar,
    Eye,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { toast } from 'sonner';
import { formatDateTime } from '@/utils/helpers';

interface ClientDashboardProps {
    [key: string]: any;
    stats: {
        totalTickets: number;
        openTickets: number;
        closedTickets: number;
        todayTickets: number;
        resolutionRate: number;
    };
    monthlyData: Record<string, number>;
    recentTickets: Array<{
        id: number;
        ticket_id: string;
        name: string;
        email: string;
        subject: string;
        status: string;
        category: string;
        created_at: string;
    }>;
    statusData: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    slug: string;
}

export default function ClientDashboard({ stats, monthlyData, recentTickets, statusData, slug }: ClientDashboardProps) {
    const { t } = useTranslation();

    const monthlyChartData = Object.entries(monthlyData)?.map(([month, value]) => ({
        month,
        tickets: value,
    }));

    const handleCreateTicket = () => {
        router.visit(route('support-tickets.create'));
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Client Dashboard') }]} pageTitle={t('Client Dashboard')}>
            <Head title={t('Client Dashboard')} />

            <div className="space-y-6">
                {/* Main Dashboard Card */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted opacity-50"></div>
                    <CardContent className="relative p-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">{t('My Support Tickets')}</h2>
                                <p className="max-w-md text-muted-foreground">
                                    {t('Track your support requests and get help from our team.')}
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        className="bg-foreground hover:bg-foreground/80"
                                        onClick={handleCreateTicket}
                                    >
                                        <TicketIcon className="me-2 h-4 w-4" />
                                        {t('Create New Ticket')}
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
                                    <TicketIcon className="h-8 w-8 text-background" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Client-Specific Stats with Rounded Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="rounded-2xl border-0 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('My Tickets')}</p>
                                    <p className="mt-2 text-3xl font-bold text-foreground">{stats.totalTickets}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{t('Total submitted')}</p>
                                </div>
                                <div className="rounded-full bg-muted p-3">
                                    <TicketIcon className="h-8 w-8 text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('In Progress')}</p>
                                    <p className="mt-2 text-3xl font-bold text-muted-foreground">{stats.openTickets}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{t('Being resolved')}</p>
                                </div>
                                <div className="rounded-full bg-muted p-3">
                                    <Clock className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('Resolved')}</p>
                                    <p className="mt-2 text-3xl font-bold text-foreground">{stats.closedTickets}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.resolutionRate}% {t('success rate')}
                                    </p>
                                </div>
                                <div className="rounded-full bg-muted p-3">
                                    <CheckCircleIcon className="h-8 w-8 text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('Today')}</p>
                                    <p className="mt-2 text-3xl font-bold text-foreground">{stats.todayTickets}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{t('New requests')}</p>
                                </div>
                                <div className="rounded-full bg-muted p-3">
                                    <Calendar className="h-8 w-8 text-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    {/* Monthly Tickets Chart */}
                    <Card className="xl:col-span-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                {t('My Ticket Trends - This Year')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyChartData}>
                                        <defs>
                                            <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="currentColor" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="currentColor" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="tickets"
                                            stroke="#3B82F6"
                                            fillOpacity={1}
                                            fill="url(#colorTickets)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card className="xl:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircleIcon className="h-5 w-5" />
                                {t('My Ticket Status')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                {statusData && statusData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        <p>{t('No ticket data available')}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tickets */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                {t('My Recent Tickets')}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentTickets && recentTickets.length > 0 ? (
                            <div className="space-y-4">
                                {recentTickets?.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="font-medium text-foreground">#{ticket.ticket_id}</div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        ticket.status === 'In Progress'
                                                            ? 'bg-muted text-foreground'
                                                            : ticket.status === 'closed' || ticket.status === 'Closed'
                                                              ? 'bg-muted text-destructive'
                                                              : ticket.status === 'On Hold'
                                                                ? 'bg-muted text-foreground'
                                                                : 'bg-muted text-foreground'
                                                    }`}
                                                >
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground">{ticket.subject}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {ticket.category} • {formatDateTime(ticket.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                <TicketIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
                                <p>{t('No recent tickets found')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
