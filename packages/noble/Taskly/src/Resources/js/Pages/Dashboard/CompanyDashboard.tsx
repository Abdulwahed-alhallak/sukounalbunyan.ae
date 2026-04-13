import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, usePage, router } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, PieChart } from '@/components/charts';
import { FolderKanban, CheckSquare, Bug, Users, UserCheck, Activity, Target, Zap, ShieldAlert, TrendingUp } from 'lucide-react';

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
    const { stats, recentTasks, projectStatus, taskPriority, teamPerformance, monthlyProgress, bugStats } = usePage<CompanyDashboardProps>().props;

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-destructive text-background';
            case 'medium': return 'bg-muted-foreground text-background';
            case 'low': return 'bg-foreground text-background';
            default: return 'bg-muted/500 text-background';
        }
    };

    const getStageColor = (stage: string) => {
        switch (stage?.toLowerCase()) {
            case 'done': return 'bg-foreground/10 text-foreground border-foreground/20';
            case 'in progress': return 'bg-muted/500/10 text-foreground border-foreground/20';
            case 'review': return 'bg-foreground/10 text-foreground border-foreground/20';
            case 'todo': return 'bg-muted/500/10 text-muted-foreground border-border/20';
            default: return 'bg-muted/500/10 text-muted-foreground border-border/20';
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Project Dashboard') }]}
            pageTitle={t('Strategic Intel Terminal')}
        >
            <Head title={t('Project Dashboard')} />

            <div className="space-y-8 pb-12">
                {/* Tactical KPI Matrix */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <div onClick={() => router.get(route('project.index'))} className="premium-card group cursor-pointer p-6 bg-gradient-to-br from-muted/500/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-muted/500/20 flex items-center justify-center text-foreground group-hover:bg-muted/500 group-hover:text-background transition-all duration-500">
                                <FolderKanban className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Payload Active')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{stats.total_projects}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                {stats.overdue_projects > 0 ? `${stats.overdue_projects} ${t('Sector Anomalies')}` : t('Operational Integrity')}
                            </p>
                        </div>
                    </div>

                    <div onClick={() => router.get(route('project.tasks.index'))} className="premium-card group cursor-pointer p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-foreground/20 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                                <CheckSquare className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Mission Velocity')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{stats.completion_rate}%</h3>
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">
                                {stats.completed_tasks}/{stats.total_tasks} {t('Tasks Captured')}
                            </p>
                        </div>
                    </div>

                    <div onClick={() => router.get(route('project.bugs.index'))} className="premium-card group cursor-pointer p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-background transition-all duration-500">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Threat Density')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{bugStats.open}</h3>
                            <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                                {bugStats.resolved} {t('Threats Neutralized')}
                            </p>
                        </div>
                    </div>

                    <div onClick={() => router.get(route('users.index'))} className="premium-card group cursor-pointer p-6 bg-gradient-to-br from-muted/500/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-foreground/20 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Personnel Unit')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{stats.total_users}</h3>
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">{t('Registered Agents')}</p>
                        </div>
                    </div>

                    <div className="premium-card group p-6 bg-gradient-to-br from-foreground/10 via-transparent to-transparent hover:scale-[1.02] transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-muted-foreground/20 flex items-center justify-center text-muted-foreground group-hover:bg-muted-foreground group-hover:text-background transition-all duration-500">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Entity Breadth')}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black tracking-tight">{stats.total_clients}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{t('Sector Stakeholders')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Mission Flux Analytics */}
                    <div className="lg:col-span-8">
                        <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden h-full">
                            <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-foreground animate-pulse" />
                                        <CardTitle className="text-sm font-black uppercase tracking-widest">{t('Mission Flux Analytics')}</CardTitle>
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">{t('Operational Temporal Progression')}</p>
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
                                        { dataKey: 'created', color: '#3b82f6', name: 'Vector Created' },
                                        { dataKey: 'completed', color: '#10b77f', name: 'Vector Captured' }
                                    ]}
                                    xAxisKey="month"
                                    showLegend={true}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sector Status Matrix */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden text-background">
                            <CardHeader className="p-6 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-foreground" />
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">{t('Mission Status Matrix')}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <PieChart
                                        data={projectStatus.filter(item => item.value > 0)}
                                        dataKey="value"
                                        nameKey="name"
                                        height={180}
                                        donut={true}
                                        showTooltip={true}
                                    />
                                    <div className="grid grid-cols-1 gap-3">
                                        {projectStatus.filter(item => item.value > 0)?.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-card/5 border border-white/5 hover:bg-card/10 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-black">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden text-background">
                            <CardHeader className="p-6 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-xs font-black uppercase tracking-widest">{t('Personnel Capability Index')}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {teamPerformance.slice(0, 4)?.map((member, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-background">{member.name}</span>
                                            <span className="text-muted-foreground">{member.completed_tasks}/{member.total_tasks} {t('Tasks Captured')}</span>
                                        </div>
                                        <div className="relative w-full h-1.5 bg-card/5 rounded-full overflow-hidden">
                                            <div 
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-muted/500 to-foreground rounded-full"
                                                style={{ 
                                                    width: `${member.completion_rate}%`,
                                                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' 
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Real-Time Operational Feed */}
                <div>
                    <Card className="premium-card border-none bg-foreground/40 backdrop-blur-3xl overflow-hidden">
                        <CardHeader className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-foreground" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">{t('Real-Time Operational Feed')}</CardTitle>
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">
                                    {stats.completed_tasks} {t('of')} {stats.total_tasks} {t('vectors captured across global fleet')}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {recentTasks?.map((task) => (
                                    <div key={task.id} className="relative group overflow-hidden rounded-2xl bg-card/5 border border-white/5 p-6 hover:bg-card/10 transition-all duration-500">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-foreground/20 group-hover:bg-foreground transition-all duration-500" />
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-black text-xs uppercase tracking-tight truncate flex-1 pr-4 text-background">{task.title}</h4>
                                            {task.is_completed && (
                                                <div className="h-5 w-5 rounded-full bg-foreground/20 flex items-center justify-center text-foreground">
                                                    <CheckSquare className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('Threat Level')}</span>
                                                <Badge className={`${getPriorityColor(task.priority)} text-[8px] font-black uppercase px-2 py-0 h-4 border-none`}>
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('Operational Stage')}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${getStageColor(task.stage)}`}>
                                                    {task.stage}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate max-w-[50%]">{task.project}</span>
                                                <span className="text-[10px] font-black text-background uppercase tracking-tight">{task.assignee}</span>
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
