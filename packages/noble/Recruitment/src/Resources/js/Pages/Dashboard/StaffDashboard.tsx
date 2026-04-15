import { Head, usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Users,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    UserCheck,
    Target,
    Activity,
    Star,
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';

interface StaffDashboardProps {
    [key: string]: any;
    dashboardData: {
        overview: {
            assignedInterviews: number;
            pendingInterviews: number;
            assignedOnboardings: number;
            completedOnboardings: number;
            conductedAssessments: number;
            submittedFeedbacks: number;
        };
        taskStatus: {
            pendingInterviews: number;
            completedInterviews: number;
            pendingOnboardings: number;
            completedOnboardings: number;
        };
        calendarEvents: Array<{
            id: number;
            title: string;
            date: string;
            time: string;
            status: string;
        }>;
        recentActivities: {
            recentInterviews: Array<{
                id: number;
                candidate_name: string;
                job_title: string;
                scheduled_date: string;
                status: string;
            }>;
            recentOnboardings: Array<{
                id: number;
                candidate_name: string;
                checklist_name: string;
                start_date: string;
                status: string;
            }>;
        };
        alerts: {
            overdueInterviews: number;
            pendingFeedbacks: number;
            upcomingInterviews: number;
        };
    };
    userSlug: string;
}

export default function StaffDashboard() {
    const { t } = useTranslation();
    const { dashboardData } = usePage<StaffDashboardProps>().props;

    const getStatusColor = (status: string) => {
        switch (status) {
            case '0':
                return 'bg-muted text-foreground'; // Scheduled
            case '1':
                return 'bg-muted text-foreground'; // Completed
            case '2':
                return 'bg-muted text-destructive'; // Cancelled
            case '3':
                return 'bg-muted text-foreground'; // No-show
            default:
                return 'bg-muted text-foreground';
        }
    };

    const getStatusText = (status: string) => {
        const options: any = { '0': 'Scheduled', '1': 'Completed', '2': 'Cancelled', '3': 'No-show' };
        return t(options[status] || 'Scheduled');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Recruitment'), url: route('recruitment.index') }, { label: t('Dashboard') }]}
            pageTitle={t('My Recruitment Dashboard')}
        >
            <Head title={t('Recruitment Dashboard')} />

            <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href={route('recruitment.interviews.index')}>
                        <Card className="cursor-pointer border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-foreground">
                                    {t('My Interviews')}
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {dashboardData.overview.assignedInterviews}
                                </div>
                                <p className="text-xs text-foreground">
                                    {dashboardData.overview.pendingInterviews} {t('pending')}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('recruitment.candidate-onboardings.index')}>
                        <Card className="cursor-pointer border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-foreground">
                                    {t('My Onboardings')}
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {dashboardData.overview.assignedOnboardings}
                                </div>
                                <p className="text-xs text-foreground">
                                    {dashboardData.overview.completedOnboardings} {t('completed')}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('recruitment.candidate-assessments.index')}>
                        <Card className="cursor-pointer border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-foreground">
                                    {t('Assessments')}
                                </CardTitle>
                                <Target className="h-4 w-4 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {dashboardData.overview.conductedAssessments}
                                </div>
                                <p className="text-xs text-foreground">{t('conducted')}</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={route('recruitment.interview-feedbacks.index')}>
                        <Card className="cursor-pointer border-border bg-gradient-to-br from-muted/50 to-muted transition-shadow hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-foreground">{t('Feedbacks')}</CardTitle>
                                <Star className="h-4 w-4 text-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {dashboardData.overview.submittedFeedbacks}
                                </div>
                                <p className="text-xs text-foreground">{t('submitted')}</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Alerts */}
                {(dashboardData.alerts.pendingFeedbacks > 0 || dashboardData.alerts.upcomingInterviews > 0) && (
                    <Card className="bg-muted/50/50 border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <AlertCircle className="h-5 w-5" />
                                {t('Attention Required')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dashboardData.alerts.pendingFeedbacks > 0 && (
                                    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {t('Pending Interview Feedbacks')}
                                                </p>
                                                <p className="text-sm text-foreground">
                                                    {dashboardData.alerts.pendingFeedbacks}{' '}
                                                    {t('feedbacks need submission')}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-border text-foreground hover:bg-muted"
                                        >
                                            {t('Review')}
                                        </Button>
                                    </div>
                                )}
                                {dashboardData.alerts.upcomingInterviews > 0 && (
                                    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-foreground" />
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {t('Upcoming Interviews')}
                                                </p>
                                                <p className="text-sm text-foreground">
                                                    {dashboardData.alerts.upcomingInterviews}{' '}
                                                    {t('interviews scheduled')}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-border text-foreground hover:bg-muted"
                                        >
                                            {t('View')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Interviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {t('Recent Interviews')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {dashboardData.recentActivities.recentInterviews.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.recentActivities.recentInterviews?.map((interview) => (
                                        <div
                                            key={interview.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{interview.candidate_name}</p>
                                                <p className="text-sm text-muted-foreground">{interview.job_title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {interview.scheduled_date
                                                        ? formatDate(interview.scheduled_date)
                                                        : '-'}
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-1 text-sm ${getStatusColor(interview.status)}`}
                                            >
                                                {getStatusText(interview.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-muted-foreground">{t('No recent interviews')}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Onboardings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                {t('Recent Onboardings')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {dashboardData.recentActivities.recentOnboardings.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.recentActivities.recentOnboardings?.map((onboarding) => (
                                        <div
                                            key={onboarding.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{onboarding.candidate_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {onboarding.checklist_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {onboarding.start_date ? formatDate(onboarding.start_date) : '-'}
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-1 text-sm ${getStatusColor(onboarding.status)}`}
                                            >
                                                {getStatusText(onboarding.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-muted-foreground">{t('No recent onboardings')}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Task Status Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-foreground" />
                            {t('My Task Progress')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Interview Progress */}
                            <div className="relative">
                                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted/500 rounded-lg p-2">
                                            <Calendar className="h-4 w-4 text-background" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">{t('Interview Tasks')}</span>
                                            <p className="text-xs text-foreground">{t('Assigned interviews')}</p>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="mb-1 flex gap-2">
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                                                {dashboardData.taskStatus.pendingInterviews} {t('Pending')}
                                            </span>
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                                                {dashboardData.taskStatus.completedInterviews} {t('Done')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-foreground">
                                            {dashboardData.overview.assignedInterviews} {t('Total')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Onboarding Progress */}
                            <div className="relative">
                                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted/500 rounded-lg p-2">
                                            <UserCheck className="h-4 w-4 text-background" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">{t('Onboarding Tasks')}</span>
                                            <p className="text-xs text-foreground">{t('Buddy assignments')}</p>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="mb-1 flex gap-2">
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                                                {dashboardData.taskStatus.pendingOnboardings} {t('Pending')}
                                            </span>
                                            <span className="rounded-full bg-muted px-2 py-1 text-xs text-foreground">
                                                {dashboardData.taskStatus.completedOnboardings} {t('Done')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-foreground">
                                            {dashboardData.overview.assignedOnboardings} {t('Total')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
