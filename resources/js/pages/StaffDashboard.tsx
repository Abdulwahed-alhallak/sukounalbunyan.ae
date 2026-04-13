import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    User,
    Clock,
    CheckCircle2,
    XCircle,
    CalendarClock,
    Briefcase,
    ListTodo,
    AlertTriangle,
    Headphones,
    TrendingUp,
    Bell,
    ArrowRight,
    BarChart3,
    CalendarCheck,
    CalendarOff,
    Target,
    DollarSign,
    Wallet,
    Zap,
    ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, any> = {
    BarChart3,
    Bell,
    CalendarCheck,
    CalendarOff,
    Briefcase,
    Target,
    Headphones,
};
const colorMap: Record<string, string> = {
    violet: '',
    blue: '',
    emerald: '',
    amber: '',
    indigo: '',
    purple: '',
    cyan: '',
};

interface Props {
    user: { name: string; type: string };
    employee?: { id: number; department: string | null; designation: string | null };
    tasks?: { total: number; completed: number; overdue: number; in_progress: number };
    attendance?: {
        clocked_in: string | null;
        clocked_out: string | null;
        status: string;
        monthly_present: number;
        monthly_absent: number;
        monthly_late: number;
    };
    leaves?: { pending: number; approved_this_month: number };
    tickets?: { open: number; total: number };
    recentActivity?: {
        id: number;
        module: string;
        title: string;
        message: string;
        category: string;
        is_read: boolean;
        time: string;
    }[];
    upcomingDeadlines?: { id: number; title: string; priority: string; due_date: string; days_left: number }[];
    lastPayslip?: { net_salary: number; basic_salary: number; month: string | null };
    quickLinks?: { label: string; url: string; icon: string; color: string }[];
}

export default function StaffDashboard({
    user,
    employee,
    tasks,
    attendance,
    leaves,
    tickets,
    recentActivity,
    upcomingDeadlines,
    lastPayslip,
    quickLinks,
}: Props) {
    const { t } = useTranslation();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('Good Morning');
        if (hour < 18) return t('Good Afternoon');
        return t('Good Evening');
    };

    const taskCompletion = tasks && tasks.total > 0 ? Math.round((tasks.completed / tasks.total) * 100) : 0;

    const priorityColor: Record<string, string> = {
        high: 'text-foreground bg-foreground/5',
        medium: 'text-muted-foreground bg-muted',
        low: 'text-muted-foreground bg-muted',
    };

    const categoryColor: Record<string, string> = {
        info: 'bg-muted text-foreground',
        success: 'bg-muted text-foreground',
        warning: 'bg-muted text-muted-foreground',
        danger: 'bg-muted text-muted-foreground',
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Dashboard') }]} pageTitle={t('Dashboard')}>
            <Head title={t('My Dashboard')} />

            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-foreground/5">
                                <User className="h-7 w-7 text-foreground" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">
                                    {getGreeting()}, {user.name} 👋
                                </h1>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {employee?.department && <span>{employee.department}</span>}
                                    {employee?.designation && (
                                        <>
                                            <span className="text-border">•</span>
                                            <span>{employee.designation}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {lastPayslip && (
                            <div className="hidden rounded-lg bg-muted px-4 py-2 text-right sm:block">
                                <p className="text-[10px] text-muted-foreground">{t('Last Payslip')}</p>
                                <p className="text-lg font-bold text-foreground">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'SAR',
                                        minimumFractionDigits: 0,
                                    }).format(lastPayslip.net_salary)}
                                </p>
                                {lastPayslip.month && (
                                    <p className="text-[10px] text-muted-foreground">{lastPayslip.month}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {attendance && (
                        <Card className="relative overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted`}>
                                        {attendance.status === 'Present' ? (
                                            <CheckCircle2 className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                        ) : attendance.status === 'not_marked' ? (
                                            <Clock className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t("Today's Status")}</p>
                                        <p
                                            className={`text-sm font-semibold ${attendance.status === 'Present' ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            {attendance.status === 'not_marked'
                                                ? t('Not Marked')
                                                : t(attendance.status)}
                                        </p>
                                        {attendance.clocked_in && (
                                            <p className="text-[10px] text-muted-foreground">
                                                {t('In')}: {attendance.clocked_in}
                                                {attendance.clocked_out
                                                    ? ` — ${t('Out')}: ${attendance.clocked_out}`
                                                    : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {tasks && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <ListTodo className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t('My Tasks')}</p>
                                        <p className="text-lg font-bold text-foreground">{tasks.in_progress}</p>
                                        <p className="text-[10px] text-muted-foreground">{t('in progress')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {leaves && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <CalendarClock className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t('Leave Requests')}</p>
                                        <p className="text-lg font-bold text-foreground">{leaves.pending}</p>
                                        <p className="text-[10px] text-muted-foreground">{t('pending')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {tickets && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Headphones className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t('My Tickets')}</p>
                                        <p className="text-lg font-bold text-foreground">{tickets.open}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {tickets.total} {t('total')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Links */}
                {quickLinks && quickLinks.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                        {quickLinks.map((link) => {
                            const Icon = iconMap[link.icon] || Zap;
                            const gradient = colorMap[link.color] || colorMap.blue;
                            return (
                                <Link
                                    key={link.url}
                                    href={link.url}
                                    className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition hover:border-foreground/30 hover:shadow-md"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-foreground/5">
                                        <Icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
                                        {t(link.label)}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Task Progress */}
                    {tasks && tasks.total > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />{' '}
                                    {t('Task Progress')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('Completion')}</span>
                                        <span className="font-bold text-foreground">{taskCompletion}%</span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-foreground transition-all duration-500"
                                            style={{ width: `${taskCompletion}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-foreground">{tasks.completed}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('Done')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-foreground">{tasks.in_progress}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('In Progress')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3 text-center">
                                        <div className="text-xl font-bold text-muted-foreground">{tasks.overdue}</div>
                                        <div className="text-[10px] text-muted-foreground">{t('Overdue')}</div>
                                    </div>
                                </div>
                                {tasks.overdue > 0 && (
                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2 text-xs text-muted-foreground">
                                        <AlertTriangle className="h-4 w-4" strokeWidth={1.5} /> {tasks.overdue}{' '}
                                        {t('tasks are overdue — please prioritize!')}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Monthly Attendance */}
                    {attendance && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />{' '}
                                    {t('Monthly Attendance')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-lg bg-muted p-4 text-center">
                                        <CheckCircle2
                                            className="mx-auto mb-1 h-5 w-5 text-foreground"
                                            strokeWidth={1.5}
                                        />
                                        <div className="text-2xl font-bold text-foreground">
                                            {attendance.monthly_present}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Present')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-4 text-center">
                                        <XCircle
                                            className="mx-auto mb-1 h-5 w-5 text-muted-foreground"
                                            strokeWidth={1.5}
                                        />
                                        <div className="text-2xl font-bold text-muted-foreground">
                                            {attendance.monthly_absent}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Absent')}</div>
                                    </div>
                                    <div className="rounded-lg bg-muted p-4 text-center">
                                        <Clock
                                            className="mx-auto mb-1 h-5 w-5 text-muted-foreground"
                                            strokeWidth={1.5}
                                        />
                                        <div className="text-2xl font-bold text-muted-foreground">
                                            {attendance.monthly_late}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">{t('Late')}</div>
                                    </div>
                                </div>
                                {attendance.monthly_present + attendance.monthly_absent > 0 && (
                                    <div>
                                        <div className="mb-1 flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">{t('Attendance Rate')}</span>
                                            <span className="font-medium text-foreground">
                                                {Math.round(
                                                    (attendance.monthly_present /
                                                        (attendance.monthly_present + attendance.monthly_absent)) *
                                                        100
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-foreground"
                                                style={{
                                                    width: `${Math.round((attendance.monthly_present / (attendance.monthly_present + attendance.monthly_absent)) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Upcoming Deadlines */}
                    {upcomingDeadlines && upcomingDeadlines.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CalendarClock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />{' '}
                                    {t('Upcoming Deadlines')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {upcomingDeadlines.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between rounded-lg border border-border p-2.5 transition hover:bg-muted/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${priorityColor[task.priority] || priorityColor.medium}`}
                                                >
                                                    {task.priority}
                                                </span>
                                                <span className="max-w-[200px] truncate text-sm text-foreground">
                                                    {task.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    className={`font-medium ${task.days_left <= 1 ? 'text-foreground' : task.days_left <= 3 ? 'text-muted-foreground' : 'text-muted-foreground'}`}
                                                >
                                                    {task.due_date}
                                                </span>
                                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                                    {task.days_left}d
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Activity */}
                    {recentActivity && recentActivity.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />{' '}
                                        {t('Recent Activity')}
                                    </CardTitle>
                                    <Link
                                        href={route('notifications.index')}
                                        className="text-xs text-foreground hover:underline"
                                    >
                                        {t('View All')}
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {recentActivity.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-muted/30 ${!item.is_read ? 'border-l-2 border-foreground' : ''}`}
                                        >
                                            <div
                                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${categoryColor[item.category] || categoryColor.info}`}
                                            >
                                                <Bell className="h-3 w-3" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {item.title}
                                                </p>
                                                {item.message && (
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {item.message}
                                                    </p>
                                                )}
                                                <p className="mt-0.5 text-[10px] text-muted-foreground">{item.time}</p>
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
