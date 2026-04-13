import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/helpers';
import { FolderKanban, ListTodo, CheckSquare, Clock } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    priority: string;
    project: string;
    stage: string;
    stage_color?: string;
    assignee: string;
    created_at: string;
    is_completed: boolean;
}

interface Project {
    id: number;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
}

interface ProjectProgress {
    name: string;
    progress: number;
    total_tasks: number;
    completed_tasks: number;
    status: string;
}

interface ClientDashboardProps {
    stats: {
        total_projects: number;
        total_tasks: number;
        completed_tasks: number;
        completion_rate: number;
        pending_tasks: number;
    };
    recentTasks: Task[];
    projectProgress: ProjectProgress[];
    clientProjects: Project[];
}

export default function ClientDashboard() {
    const { t } = useTranslation();
    const { stats, recentTasks, projectProgress, clientProjects } = usePage<ClientDashboardProps>().props;

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
            purple: 'bg-gradient-to-r from-muted/50 to-muted border-border',
            orange: 'bg-gradient-to-r from-muted/50 to-muted border-border',
        };
        const textColors = {
            blue: 'text-foreground',
            green: 'text-foreground',
            purple: 'text-foreground',
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
        <AuthenticatedLayout breadcrumbs={[{ label: t('Client Dashboard') }]} pageTitle={t('Client Dashboard')}>
            <Head title={t('Client Dashboard')} />

            <div className="space-y-6">
                {/* Client Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title={t('Projects')}
                        value={stats.total_projects}
                        subtitle="Active projects"
                        color="blue"
                        icon={FolderKanban}
                    />
                    <StatCard
                        title={t('Total Tasks')}
                        value={stats.total_tasks}
                        subtitle="All project tasks"
                        color="purple"
                        icon={ListTodo}
                    />
                    <StatCard
                        title={t('Completed')}
                        value={stats.completed_tasks}
                        subtitle="Tasks finished"
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
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Project Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Project Progress')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {projectProgress.length > 0 ? (
                                projectProgress?.map((project, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium">{project.name}</span>
                                                <Badge size="sm" className={`ms-2 ${getStatusColor(project.status)}`}>
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

                    {/* Projects List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('Projects')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {clientProjects.length > 0 ? (
                                    clientProjects?.map((project) => (
                                        <div key={project.id} className="space-y-2 rounded-lg border p-3">
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-sm font-medium">{project.name}</h4>
                                                <Badge size="sm" className={getStatusColor(project.status)}>
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                <div>
                                                    {t('Start')}: {formatDate(project.start_date)}
                                                </div>
                                                <div>
                                                    {t('End')}: {formatDate(project.end_date)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-muted-foreground">{t('No projects found')}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Project Updates */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{t('Recent Project Updates')}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {t('Latest activities and progress in your projects')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {recentTasks.length > 0 ? (
                                recentTasks?.map((task) => (
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
                                                <span className="text-muted-foreground">{t('Assignee')}:</span>
                                                <span className="truncate font-medium">{task.assignee}</span>
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
                                    <p className="text-muted-foreground">{t('No tasks found in your projects')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
