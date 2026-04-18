import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, PieChart, BarChart } from '@/components/charts';
import CalendarView from '@/components/calendar-view';
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Award,
    AlertTriangle,
    FileText,
    Building,
    Briefcase,
    CalendarDays,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    User as UserIcon,
} from 'lucide-react';
import { getImagePath } from '@/utils/helpers';

interface HrmProps {
    [key: string]: any;
    message: string;
    stats: {
        total_employees: number;
        present_today: number;
        absent_today: number;
        absent_yesterday: number;
        on_leave: number;
        pending_leaves: number;
        total_branches: number;
        total_departments: number;
        total_promotions: number;
        terminations: number;
        department_distribution: Array<{
            name: string;
            value: number;
        }>;
        calendar_events: Array<{
            id: number;
            title: string;
            startDate: string;
            endDate: string;
            time: string;
            description: string;
            type: string;
            color: string;
        }>;
        recent_leave_applications: Array<{
            id: number;
            employee_name: string;
            leave_type: string;
            start_date: string;
            end_date: string;
            total_days: number;
            status: string;
            created_at: string;
        }>;
        recent_announcements: Array<{
            id: number;
            title: string;
            description: string;
            created_at: string;
        }>;
        employees_on_leave_today: Array<{
            name: string;
            profile: string;
            leave_type: string;
            days: number;
        }>;
        employees_without_attendance: Array<{
            employee_id: string;
            profile: string;
            name: string;
            department: string;
        }>;
    };
}

export default function HrmIndex({ message, stats }: HrmProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('HRM Dashboard') }]} pageTitle={t('HRM Dashboard')}>
            <Head title={t('HRM Dashboard')} />

            <div className="space-y-6">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div
                        onClick={() => (window.location.href = route('hrm.employees.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {t('Total Employees')}
                                </CardTitle>
                                <Users className="h-5 w-5 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-foreground">{stats.total_employees}</div>
                                <div className="mt-1 flex items-center text-xs text-foreground">
                                    <span>{t('Active employees')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.attendances.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {t('Present Today')}
                                </CardTitle>
                                <UserCheck className="h-5 w-5 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-foreground">{stats.present_today}</div>
                                <div className="mt-1 flex items-center text-xs text-foreground">
                                    <span>
                                        {stats.total_employees > 0 ? ((stats.present_today / stats.total_employees) * 100).toFixed(1) : "0.0"}%{' '}
                                        {t('attendance rate')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.attendances.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-destructive">
                                    {t('Absent Today')}
                                </CardTitle>
                                <UserX className="h-5 w-5 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-destructive">{stats.absent_today}</div>
                                <div className="mt-1 flex items-center text-xs text-destructive">
                                    {stats.absent_today > stats.absent_yesterday ? (
                                        <ArrowUpRight className="me-1 h-3 w-3" />
                                    ) : (
                                        <ArrowDownRight className="me-1 h-3 w-3" />
                                    )}
                                    <span>
                                        {stats.absent_today - stats.absent_yesterday > 0 ? '+' : ''}
                                        {stats.absent_today - stats.absent_yesterday} {t('from yesterday')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.leave-applications.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-foreground">{t('On Leave')}</CardTitle>
                                <Calendar className="h-5 w-5 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-foreground">{stats.on_leave}</div>
                                <div className="mt-1 flex items-center text-xs text-foreground">
                                    <span>
                                        {stats.pending_leaves} {t('pending approvals')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Secondary Metrics Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div
                        onClick={() => (window.location.href = route('hrm.branches.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {t('Total Branch')}
                                </CardTitle>
                                <Building className="h-5 w-5 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-foreground">{stats.total_branches}</div>
                                <div className="mt-1 flex items-center text-xs text-foreground">
                                    <span>{t('Active branches')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.departments.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {t('Total Department')}
                                </CardTitle>
                                <Briefcase className="h-5 w-5 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-foreground">{stats.total_departments}</div>
                                <div className="mt-1 flex items-center text-xs text-foreground">
                                    <span>{t('Across all branches')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.promotions.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {t('Total Promotions')}
                                </CardTitle>
                                <TrendingUp className="h-5 w-5 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-foreground">{stats.total_promotions}</div>
                                <div className="mt-1 flex items-center text-xs text-foreground">
                                    <span>{t('This year')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        onClick={() => (window.location.href = route('hrm.terminations.index'))}
                        className="cursor-pointer"
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-background via-muted/50 to-muted shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-semibold text-destructive">
                                    {t('Terminations')}
                                </CardTitle>
                                <TrendingDown className="h-5 w-5 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="tabular-nums text-3xl font-bold text-destructive">{stats.terminations}</div>
                                <div className="mt-1 flex items-center text-xs text-destructive">
                                    <span>{t('This month')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Attendance Trends Chart */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>{t('Attendance Trends')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={[
                                { month: 'Jan', present: 230, absent: 17, leave: 15 },
                                { month: 'Feb', present: 235, absent: 12, leave: 18 },
                                { month: 'Mar', present: 240, absent: 7, leave: 20 },
                                { month: 'Apr', present: 238, absent: 9, leave: 16 },
                                { month: 'May', present: 242, absent: 5, leave: 14 },
                                { month: 'Jun', present: 234, absent: 13, leave: 18 },
                                { month: 'Jul', present: 245, absent: 8, leave: 12 },
                                { month: 'Aug', present: 241, absent: 6, leave: 16 },
                                { month: 'Sep', present: 239, absent: 11, leave: 19 },
                                { month: 'Oct', present: 243, absent: 4, leave: 15 },
                                { month: 'Nov', present: 237, absent: 10, leave: 17 },
                                { month: 'Dec', present: 234, absent: 13, leave: 18 }
                            ]}
                            height={300}
                            showTooltip={true}
                            showGrid={true}
                            lines={[
                                { dataKey: 'present', color: '#10b77f', name: 'Present' },
                                { dataKey: 'absent', color: '#ef4444', name: 'Absent' },
                                { dataKey: 'leave', color: '#f59e0b', name: 'On Leave' }
                            ]}
                            xAxisKey="month"
                            showLegend={true}
                        />
                    </CardContent>
                </Card> */}

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Department Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Building className="h-5 w-5" />
                                {t('Department Distribution')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80 space-y-4 overflow-y-auto pe-2">
                                {stats.department_distribution && stats.department_distribution.length > 0 ? (
                                    stats.department_distribution?.map((dept, index) => {
                                        const maxValue = Math.max(
                                            ...stats.department_distribution?.map((d) => d.value)
                                        );
                                        const percentage = (dept.value / maxValue) * 100;
                                        const colors = [
                                            '#3b82f6',
                                            '#10b77f',
                                            '#f59e0b',
                                            '#8b5cf6',
                                            '#ef4444',
                                            '#06b6d4',
                                            '#f97316',
                                            '#84cc16',
                                        ];

                                        return (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {dept.name}
                                                    </span>
                                                    <span className="text-sm font-bold text-foreground">
                                                        {dept.value}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-muted">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: colors[index % 8],
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <Briefcase className="mx-auto mb-2 h-12 w-12 text-muted-foreground/60" />
                                            <p className="text-sm">{t('No departments found')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Briefcase className="h-5 w-5" />
                                {t('Quick Actions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80 space-y-3 overflow-y-auto pe-2">
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.employees.create'))}
                                >
                                    <Users className="me-2 h-4 w-4" />
                                    {t('Add New Employee')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.attendances.index'))}
                                >
                                    <Clock className="me-2 h-4 w-4" />
                                    {t('Mark Attendance')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.leave-applications.index'))}
                                >
                                    <Calendar className="me-2 h-4 w-4" />
                                    {t('Apply for Leave')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.payrolls.index'))}
                                >
                                    <CreditCard className="me-2 h-4 w-4" />
                                    {t('Process Payroll')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.promotions.index'))}
                                >
                                    <TrendingUp className="me-2 h-4 w-4" />
                                    {t('Create Promotion')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.resignations.index'))}
                                >
                                    <TrendingDown className="me-2 h-4 w-4" />
                                    {t('Create Resignation')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.holidays.index'))}
                                >
                                    <CalendarDays className="me-2 h-4 w-4" />
                                    {t('Create Holiday')}
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => (window.location.href = route('hrm.warnings.index'))}
                                >
                                    <AlertTriangle className="me-2 h-4 w-4" />
                                    {t('Create Warning')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Employee Status Sections */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Employees on Leave Today */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Calendar className="h-5 w-5" />
                                {t('Employees on Leave')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80 space-y-3 overflow-y-auto pe-2">
                                {stats.employees_on_leave_today && stats.employees_on_leave_today.length > 0 ? (
                                    stats.employees_on_leave_today?.map((employee, index) => {
                                        const colors = [
                                            'bg-foreground',
                                            'bg-muted/500',
                                            'bg-muted/500',
                                            'bg-foreground',
                                            'bg-foreground',
                                        ];
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                                                        {employee.profile ? (
                                                            <img
                                                                src={getImagePath(employee.profile)}
                                                                alt={employee.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className={`h-full w-full ${colors[index % 5]} flex items-center justify-center text-sm font-medium text-background`}
                                                            >
                                                                {employee.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {employee.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {employee.leave_type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {employee.days} {t('days')}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <Calendar className="mx-auto mb-2 h-12 w-12 text-muted-foreground/60" />
                                            <p className="text-sm">{t('No employees on leave today')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employees Without Attendance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <UserX className="h-5 w-5" />
                                {t('Missing Attendance Today')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80 space-y-3 overflow-y-auto pe-2">
                                {stats.employees_without_attendance && stats.employees_without_attendance.length > 0 ? (
                                    stats.employees_without_attendance?.map((employee, index) => {
                                        const colors = [
                                            'bg-muted/500',
                                            'bg-foreground',
                                            'bg-muted/500',
                                            'bg-foreground',
                                            'bg-destructive',
                                        ];
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                                                        {employee.profile ? (
                                                            <img
                                                                src={getImagePath(employee.profile)}
                                                                alt={employee.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className={`h-full w-full ${colors[index % 5]} flex items-center justify-center text-sm font-medium text-background`}
                                                            >
                                                                {employee.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {employee.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {employee.employee_id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <UserCheck className="mx-auto mb-2 h-12 w-12 text-muted-foreground/60" />
                                            <p className="text-sm">{t('All employees marked attendance')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar and Recent Activities */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Calendar View */}
                    <Card className="lg:col-span-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <CalendarDays className="h-5 w-5" />
                                {t('Events & Holidays Calendar')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CalendarView events={stats.calendar_events} />
                        </CardContent>
                    </Card>

                    {/* Recent Activities & Notifications */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Recent Leave Applications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <Calendar className="h-5 w-5" />
                                    {t('Recent Leave Applications')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80 space-y-3 overflow-y-auto">
                                    {stats.recent_leave_applications && stats.recent_leave_applications.length > 0 ? (
                                        stats.recent_leave_applications?.map((leave, index) => {
                                            const getStatusColor = (status: string) => {
                                                switch (status.toLowerCase()) {
                                                    case 'pending':
                                                        return {
                                                            icon: 'bg-muted/500',
                                                            badge: 'bg-muted text-foreground border-border',
                                                        };
                                                    case 'approved':
                                                        return {
                                                            icon: 'bg-muted/500',
                                                            badge: 'bg-muted text-foreground border-border',
                                                        };
                                                    case 'rejected':
                                                        return {
                                                            icon: 'bg-muted/500',
                                                            badge: 'bg-muted text-destructive border-border',
                                                        };
                                                    default:
                                                        return {
                                                            icon: 'bg-muted/500',
                                                            badge: 'bg-muted text-foreground border-border',
                                                        };
                                                }
                                            };
                                            const colors = getStatusColor(leave.status);
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between rounded-lg border border-border bg-card p-3"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`${colors.icon} rounded-full p-1.5`}>
                                                            <Calendar className="h-3 w-3 text-background" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {leave.employee_name} - {leave.leave_type}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {leave.start_date === leave.end_date
                                                                    ? `${new Date(leave.start_date).toLocaleDateString()} (${leave.total_days} day${leave.total_days > 1 ? 's' : ''})`
                                                                    : `${new Date(leave.start_date).toLocaleDateString()} - ${new Date(leave.end_date).toLocaleDateString()} (${leave.total_days} day${leave.total_days > 1 ? 's' : ''})`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`rounded-full px-2 py-1 text-sm ${colors.badge}`}>
                                                        {t(
                                                            leave.status.charAt(0).toUpperCase() + leave.status.slice(1)
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex h-40 items-center justify-center text-muted-foreground">
                                            <div className="text-center">
                                                <Calendar className="mx-auto mb-2 h-12 w-12 text-muted-foreground/60" />
                                                <p className="text-sm">{t('No recent leave applications')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Announcements */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <FileText className="h-5 w-5" />
                                    {t('Announcements')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-80 space-y-3 overflow-y-auto">
                                    {stats.recent_announcements && stats.recent_announcements.length > 0 ? (
                                        stats.recent_announcements?.map((announcement, index) => {
                                            const colors = [
                                                'bg-foreground',
                                                'bg-muted/500',
                                                'bg-muted/500',
                                                'bg-foreground',
                                                'bg-muted/500',
                                                'bg-foreground',
                                            ];
                                            const timeAgo = new Date(announcement.created_at).toLocaleDateString();
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
                                                >
                                                    <div className={`${colors[index % 6]} rounded-full p-1.5`}>
                                                        <FileText className="h-3 w-3 text-background" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{announcement.title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {announcement.description}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{timeAgo}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex h-40 items-center justify-center text-muted-foreground">
                                            <div className="text-center">
                                                <FileText className="mx-auto mb-2 h-12 w-12 text-muted-foreground/60" />
                                                <p className="text-sm">{t('No active announcements')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
