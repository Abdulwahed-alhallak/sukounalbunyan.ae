import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, PieChart } from '@/components/charts';
import {
    FolderKanban,
    CheckSquare,
    Bug,
    Users,
    UserCheck,
    Activity,
    Target,
    Zap,
    ShieldAlert,
    TrendingUp,
} from 'lucide-react';

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

interface ChartData {
    name: string;
    value: number;
    color?: string;
}

interface TeamMember {
    name: string;
    total_tasks: number;
    completed_tasks: number;
    completion_rate: number;
}

interface CompanyDashboardProps {
    stats: {
        total_projects: number;
        total_tasks: number;
        total_bugs: number;
        total_users: number;
        total_clients: number;
        completed_tasks: number;
        completion_rate: number;
        overdue_projects: number;
    };
    recentTasks: Task[];
    projectStatus: ChartData[];
    taskPriority: ChartData[];
    teamPerformance: TeamMember[];
    monthlyProgress: Array<{ month: string; created: number; completed: number }>;
    bugStats: { open: number; resolved: number };
    [key: string]: any;
}

export default function CompanyDashboard() {
    const { t } = useTranslation();
    const { stats, recentTasks, projectStatus, taskPriority, teamPerformance, monthlyProgress, bugStats } =
        usePage<CompanyDashboardProps>().props;

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-destructive text-background';
            case 'medium':
                return 'bg-muted-foreground text-background';
            case 'low':
                return 'bg-foreground text-background';
            default:
                return 'bg-muted/500 text-background';
        }
    };

    const getStageColor = (stage: string) => {
        switch (stage?.toLowerCase()) {
            case 'done':
                return 'bg-foreground/10 text-foreground border-foreground/20';
            case 'in progress':
                return 'bg-muted/500/10 text-foreground border-foreground/20';
            case 'review':
                return 'bg-foreground/10 text-foreground border-foreground/20';
            case 'todo':
                return 'bg-muted/500/10 text-muted-foreground border-border/20';
            default:
                return 'bg-muted/500/10 text-muted-foreground border-border/20';
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Project Dashboard') }]}
            pageTitle={t('Project Dashboard')}
        >
            <Head title={t('Project Dashboard')} />

            <div className="space-y-8 pb-12">
                {/* KPI Metrics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <div
                        onClick={() => router.get(route('project.index'))}
                        className="premium-card from-muted/500/10 group cursor-pointer bg-gradient-to-br via-transparent to-transparent p-6 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="bg-muted/500/20 group-hover:bg-muted/500 flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-all duration-500 group-hover:text-background">
                                <FolderKanban className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Projects')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="tabular-nums text-3xl font-black tracking-tight">{stats.total_projects}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                {stats.overdue_projects > 0
                                    ? `${stats.overdue_projects} ${t('Overdue')}`
                                    : t('All On Track')}
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={() => router.get(route('project.tasks.index'))}
                        className="premium-card group cursor-pointer bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
                                <CheckSquare className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Completion Rate')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="tabular-nums text-3xl font-black tracking-tight">{stats.completion_rate}%</h3>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-foreground">
                                {stats.completed_tasks}/{stats.total_tasks} {t('Completed')}
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={() => router.get(route('project.bugs.index'))}
                        className="premium-card group cursor-pointer bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20 text-destructive transition-all duration-500 group-hover:bg-destructive group-hover:text-background">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Open Bugs')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="tabular-nums text-3xl font-black tracking-tight">{bugStats.open}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-destructive">
                                {bugStats.resolved} {t('Resolved')}
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={() => router.get(route('users.index'))}
                        className="premium-card from-muted/500/10 group cursor-pointer bg-gradient-to-br via-transparent to-transparent p-6 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/20 text-foreground transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Team Members')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="tabular-nums text-3xl font-black tracking-tight">{stats.total_users}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-foreground">
                                {t('Active Users')}
                            </p>
                        </div>
                    </div>

                    <div className="premium-card group bg-gradient-to-br from-foreground/10 via-transparent to-transparent p-6 transition-all duration-500 hover:scale-[1.02]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-foreground/20 text-muted-foreground transition-all duration-500 group-hover:bg-muted-foreground group-hover:text-background">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Clients')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="tabular-nums text-3xl font-black tracking-tight">{stats.total_clients}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                                {t('Total Clients')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Monthly Progress */}
                    <div className="lg:col-span-8">
                        <Card className="premium-card h-full overflow-hidden border-none bg-foreground/40 backdrop-blur-3xl">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 p-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 animate-pulse text-foreground" />
                                        <CardTitle className="text-sm font-black uppercase tracking-widest">
                                            {t('Monthly Progress')}
                                        </CardTitle>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">
                                        {t('Tasks created vs completed over time')}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <LineChart
                                    data={monthlyProgress}
                                    dataKey="created"
                                    height={350}
                                    showTooltip={true}
                                    showGrid={false}
                                    lines={[
                                        { dataKey: 'created', color: '#3b82f6', name: 'Created' },
                                        { dataKey: 'completed', color: '#10b77f', name: 'Completed' },
                                    ]}
                                    xAxisKey="month"
                                    showLegend={true}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Project Status */}
                    <div className="space-y-8 lg:col-span-4">
                        <Card className="premium-card overflow-hidden border-none bg-foreground/40 text-background backdrop-blur-3xl">
                            <CardHeader className="border-b border-white/5 p-6">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-foreground" />
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">
                                        {t('Project Status')}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <PieChart
                                        data={projectStatus.filter((item) => item.value > 0)}
                                        dataKey="value"
                                        nameKey="name"
                                        height={180}
                                        donut={true}
                                        showTooltip={true}
                                    />
                                    <div className="grid grid-cols-1 gap-3">
                                        {projectStatus
                                            .filter((item) => item.value > 0)
                                            ?.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-card/5 p-3 transition-all duration-300 hover:bg-card/10"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-2 w-2 rounded-full"
                                                            style={{
                                                                backgroundColor: item.color,
                                                                boxShadow: `0 0 10px ${item.color}`,
                                                            }}
                                                        ></div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-black">{item.value}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="premium-card overflow-hidden border-none bg-foreground/40 text-background backdrop-blur-3xl">
                            <CardHeader className="border-b border-white/5 p-6">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">
                                        {t('Team Performance')}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                {teamPerformance.slice(0, 4)?.map((member, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-background">{member.name}</span>
                                            <span className="text-muted-foreground">
                                                {member.completed_tasks}/{member.total_tasks} {t('Completed')}
                                            </span>
                                        </div>
                                        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-card/5">
                                            <div
                                                className="from-muted/500 absolute start-0 top-0 h-full rounded-full bg-gradient-to-r to-foreground"
                                                style={{
                                                    width: `${member.completion_rate}%`,
                                                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div>
                    <Card className="premium-card overflow-hidden border-none bg-foreground/40 backdrop-blur-3xl">
                        <CardHeader className="flex flex-col justify-between gap-4 border-b border-white/5 p-8 md:flex-row md:items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-foreground" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">
                                        {t('Recent Tasks')}
                                    </CardTitle>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">
                                    {stats.completed_tasks} {t('of')} {stats.total_tasks}{' '}
                                    {t('tasks completed across all projects')}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {recentTasks?.map((task) => (
                                    <div
                                        key={task.id}
                                        className="group relative overflow-hidden rounded-2xl border border-white/5 bg-card/5 p-6 transition-all duration-500 hover:bg-card/10"
                                    >
                                        <div className="absolute start-0 top-0 h-full w-1 bg-foreground/20 transition-all duration-500 group-hover:bg-foreground" />
                                        <div className="mb-4 flex items-start justify-between">
                                            <h4 className="flex-1 truncate pe-4 text-xs font-black uppercase tracking-tight text-background">
                                                {task.title}
                                            </h4>
                                            {task.is_completed && (
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/20 text-foreground">
                                                    <CheckSquare className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {t('Priority')}
                                                </span>
                                                <Badge
                                                    className={`${getPriorityColor(task.priority)} h-4 border-none px-2 py-0 text-[8px] font-black uppercase`}
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {t('Stage')}
                                                </span>
                                                <span
                                                    className={`rounded border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${getStageColor(task.stage)}`}
                                                >
                                                    {task.stage}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                                <span className="max-w-[50%] truncate text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {task.project}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-tight text-background">
                                                    {task.assignee}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
