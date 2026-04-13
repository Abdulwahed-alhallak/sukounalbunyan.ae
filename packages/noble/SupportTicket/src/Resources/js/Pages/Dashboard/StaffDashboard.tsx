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
    UsersIcon,
    Clock,
    TrendingUp,
    Users,
    Calendar,
    Eye,
    AlertTriangle,
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

interface StaffDashboardProps {
    stats: {
        totalTickets: number;
        openTickets: number;
        closedTickets: number;
        todayTickets: number;
        resolutionRate: number;
        canViewTickets: boolean;
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

export default function StaffDashboard({ stats, monthlyData, recentTickets, statusData, slug }: StaffDashboardProps) {
    const { t } = useTranslation();

    const monthlyChartData = Object.entries(monthlyData)?.map(([month, value]) => ({
        month,
        tickets: value,
    }));

    const copyToClipboard = async () => {
        const ticketUrl = route('support-ticket.index', [slug]);
        await navigator.clipboard.writeText(ticketUrl);
        toast.success(t('Link copied to clipboard!'));
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Staff Dashboard') }]} pageTitle={t('Staff Dashboard')}>
            <Head title={t('Staff Dashboard')} />

            <div className="space-y-6">
                {!stats.canViewTickets ? (
                    <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                        <CardContent className="p-8 text-center">
                            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-destructive" />
                            <h2 className="mb-2 text-xl font-bold text-destructive">{t('Access Restricted')}</h2>
                            <p className="text-destructive">
                                {t(
                                    'You do not have permission to view support ticket data. Please contact your administrator.'
                                )}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Main Dashboard Card */}
                        <Card className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted opacity-50"></div>
                            <CardContent className="relative p-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold text-foreground">
                                            {t('Staff Support Dashboard')}
                                        </h2>
                                        <p className="max-w-md text-muted-foreground">
                                            {t('Manage company tickets and provide excellent customer support.')}
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                className="bg-foreground hover:bg-foreground/80"
                                                onClick={() => router.get(route('support-tickets.index'))}
                                            >
                                                <TicketIcon className="me-2 h-4 w-4" />
                                                {t('View All Tickets')}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
                                            <UsersIcon className="h-8 w-8 text-background" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Enhanced Stats Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card
                                className="cursor-pointer border-border bg-gradient-to-r from-muted/50 to-muted transition-all duration-200 hover:shadow-lg"
                                onClick={() => router.get(route('support-tickets.index'))}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-foreground">
                                        {t('Total Tickets')}
                                    </CardTitle>
                                    <TicketIcon className="h-6 w-6 text-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stats.totalTickets}</div>
                                    <p className="mt-1 text-xs text-foreground">{t('My tickets')}</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer border-border bg-gradient-to-r from-muted/50 to-muted transition-all duration-200 hover:shadow-lg"
                                onClick={() => router.get(route('support-tickets.index'))}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-foreground">
                                        {t('In Progress')}
                                    </CardTitle>
                                    <Clock className="h-6 w-6 text-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stats.openTickets}</div>
                                    <p className="mt-1 text-xs text-foreground">{t('Need attention')}</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="cursor-pointer border-border bg-gradient-to-r from-muted/50 to-muted transition-all duration-200 hover:shadow-lg"
                                onClick={() => router.get(route('support-tickets.index'))}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-foreground">
                                        {t('Resolved')}
                                    </CardTitle>
                                    <CheckCircleIcon className="h-6 w-6 text-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stats.closedTickets}</div>
                                    <p className="mt-1 text-xs text-foreground">
                                        {stats.resolutionRate}% {t('resolution rate')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-gradient-to-r from-muted/50 to-muted">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-foreground">
                                        {t("Today's Tickets")}
                                    </CardTitle>
                                    <Calendar className="h-6 w-6 text-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stats.todayTickets}</div>
                                    <p className="mt-1 text-xs text-foreground">{t('Created today')}</p>
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
                                                    stroke="#6366f1"
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
                                        {t('Ticket Status Distribution')}
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(route('support-tickets.index'))}
                                    >
                                        <Eye className="me-2 h-4 w-4" />
                                        {t('View All')}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {recentTickets && recentTickets.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentTickets?.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted"
                                                onClick={() => router.get(route('support-tickets.show', ticket.id))}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-medium text-foreground">
                                                            #{ticket.ticket_id}
                                                        </div>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                                ticket.status === 'In Progress'
                                                                    ? 'bg-muted text-foreground'
                                                                    : ticket.status === 'closed' ||
                                                                        ticket.status === 'Closed'
                                                                      ? 'bg-muted text-destructive'
                                                                      : ticket.status === 'On Hold'
                                                                        ? 'bg-muted text-foreground'
                                                                        : 'bg-muted text-foreground'
                                                            }`}
                                                        >
                                                            {ticket.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        {ticket.subject}
                                                    </div>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {ticket.name} • {ticket.category} •{' '}
                                                        {formatDateTime(ticket.created_at)}
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
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
