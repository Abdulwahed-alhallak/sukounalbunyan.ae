import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart } from '@/components/charts';
import { CheckSquare, Clock, AlertTriangle, ListTodo, Calendar, Target } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    priority: string;
    project: string;
    stage: string;
    stage_color?: string;
    due_date?: string;
    created_at?: string;
    is_completed: boolean;
    is_overdue?: boolean;
}

interface ChartData {
    name: string;
    value: number;
    color?: string;
}

interface StaffProject {
    name: string;
    total_tasks: number;
    completed_tasks: number;
    progress: number;
    status: string;
}

interface StaffDashboardProps {
    [key: string]: any;
    stats: {
        total_tasks: number;
        completed_tasks: number;
        pending_tasks: number;
        overdue_tasks: number;
        completion_rate: number;
    };
    todayTasks: Task[];
    latestTasks: Task[];
    taskPriority: ChartData[];
    staffProjects: StaffProject[];
}

export default function StaffDashboard() {
    const { t } = useTranslation();
    const {
        stats,
        todayTasks = [],
        latestTasks = [],
        taskPriority,
        staffProjects,
    } = usePage<StaffDashboardProps>().props;

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-muted/500 text-background';
            case 'medium':
                return 'bg-muted/500 text-background';
            case 'low':
                return 'bg-muted/500 text-background';
            default:
                return 'bg-muted-foreground text-background';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'finished':
                return 'bg-muted text-foreground';
            case 'ongoing':
                return 'bg-muted text-foreground';
            case 'onhold':
                return 'bg-muted text-foreground';
            default:
                return 'bg-muted text-foreground';
        }
    };

    const StatCard = ({ title, value, subtitle, color = 'blue', icon: Icon }: any) => {
        const colorClasses = {
            blue: 'bg-gradient-to-r from-muted/50 to-muted border-border',
            green: 'bg-gradient-to-r from-muted/50 to-muted border-border',
            red: 'bg-gradient-to-r from-muted/50 to-muted border-border',
            orange: 'bg-gradient-to-r from-muted/50 to-muted border-border',
        };
        const textColors = {
            blue: 'text-foreground',
            green: 'text-foreground',
            red: 'text-destructive',
            orange: 'text-foreground',
        };
        return (
            <Card className={`relative overflow-hidden ${colorClasses[color as keyof typeof colorClasses]}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${textColors[color as keyof typeof textColors]}`}>
                        {title}
                    </CardTitle>
                    {Icon && <Icon className={`h-8 w-8 ${textColors[color as keyof typeof textColors]} opacity-80`} />}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${textColors[color as keyof typeof textColors]}`}>{value}</div>
                    {subtitle && (
                        <p className={`text-xs ${textColors[color as keyof typeof textColors]} mt-1 opacity-80`}>
                            {subtitle}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Staff Dashboard') }]} pageTitle={t('Staff Dashboard')}>
            <Head title={t('Staff Dashboard')} />

            <div className="space-y-6">
                {/* Staff Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title={t('My Tasks')}
                        value={stats.total_tasks}
                        subtitle="Assigned to me"
                        color="blue"
                        icon={ListTodo}
                    />
                    <StatCard
                        title={t('Completed')}
                        value={stats.completed_tasks}
                        subtitle={`${stats.completion_rate}% completion rate`}
                        color="green"
                        icon={CheckSquare}
                    />
                    <StatCard
                        title={t('Pending')}
                        value={stats.pending_tasks}
                        subtitle="Tasks remaining"
                        color="orange"
                        icon={Clock}
                    />
                    <StatCard
                        title={t('Overdue')}
                        value={stats.overdue_tasks}
                        subtitle="Need attention"
                        color="red"
                        icon={AlertTriangle}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Task Priority Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Task Priority')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <PieChart
                                    data={taskPriority.filter((item) => item.value > 0)}
                                    dataKey="value"
                                    nameKey="name"
                                    height={200}
                                    donut={true}
                                    showTooltip={true}
                                />
                                <div className="space-y-2">
                                    {taskPriority
                                        .filter((item) => item.value > 0)
                                        ?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded bg-muted/50 p-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    ></div>
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                </div>
                                                <span className="text-base font-bold">{item.value}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Projects */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Projects')}</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-80 space-y-4 overflow-y-auto">
                            {staffProjects.length > 0 ? (
                                staffProjects?.map((project, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{project.name}</span>
                                                <Badge size="sm" className={getStatusColor(project.status)}>
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {project.completed_tasks}/{project.total_tasks}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted">
                                            <div
                                                className="h-2 rounded-full bg-foreground"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-end text-xs text-muted-foreground">
                                            {project.progress}% {t('completed')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center text-muted-foreground">{t('No projects assigned')}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Latest Assigned Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{t('Latest Assigned Tasks')}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t('Your 6 most recently assigned tasks')}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {(latestTasks || []).length > 0 ? (
                                (latestTasks || [])?.map((task) => (
                                    <div key={task.id} className="space-y-3 rounded-lg border p-4">
                                        <div className="flex items-start justify-between">
                                            <h4 className="truncate text-sm font-medium">{task.title}</h4>
                                            {task.is_completed && <span className="text-xs text-foreground">✓</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">{t('Priority')}:</span>
                                                <Badge size="sm" className={getPriorityColor(task.priority)}>
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">{t('Stage')}:</span>
                                                <Badge
                                                    size="sm"
                                                    variant="secondary"
                                                    style={
                                                        task.stage_color
                                                            ? { backgroundColor: task.stage_color, color: '#fff' }
                                                            : {}
                                                    }
                                                >
                                                    {task.stage}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">{t('Project')}:</span>
                                                <span className="truncate font-medium">{task.project}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-8 text-center">
                                    <p className="text-muted-foreground">{t('No tasks assigned yet')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
