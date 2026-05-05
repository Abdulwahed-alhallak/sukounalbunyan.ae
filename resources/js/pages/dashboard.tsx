import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
    Activity, 
    ArrowUpRight, 
    Briefcase, 
    Clock, 
    Plus, 
    Users, 
    Zap,
    TrendingUp,
    ChevronRight,
    Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Dashboard() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <AuthenticatedLayout 
            header={t('Operational Overview')}
            pageTitle={t('Mission Control')}
            pageActions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        <Search className="me-2 h-4 w-4" />
                        {t('Search Data')}
                    </Button>
                    <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95">
                        <Plus className="me-2 h-4 w-4" />
                        {t('New Project')}
                    </Button>
                </div>
            }
        >
            <Head title={t('Dashboard')} />

            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* ─── Metric Grid ─── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card variant="premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs-bold text-muted-foreground/60">{t('Total Projects')}</CardTitle>
                            <Briefcase className="h-4 w-4 text-primary" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tighter">12</div>
                            <div className="mt-1 flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 py-0 px-1 text-[10px] font-bold">
                                    <TrendingUp className="me-1 h-3 w-3" />
                                    +2
                                </Badge>
                                <span className="text-[11px] font-medium text-muted-foreground/40">{t('vs last month')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs-bold text-muted-foreground/60">{t('Active Users')}</CardTitle>
                            <Users className="h-4 w-4 text-info" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tighter">840</div>
                            <div className="mt-1 flex items-center gap-1.5">
                                <Badge variant="secondary" className="bg-info/10 text-info hover:bg-info/20 py-0 px-1 text-[10px] font-bold">
                                    <Activity className="me-1 h-3 w-3" />
                                    +12%
                                </Badge>
                                <span className="text-[11px] font-medium text-muted-foreground/40">{t('Real-time sync')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs-bold text-muted-foreground/60">{t('System Uptime')}</CardTitle>
                            <Zap className="h-4 w-4 text-warning" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tighter">99.9%</div>
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-success">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/75 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                                </span>
                                {t('Operational')}
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="premium">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs-bold text-muted-foreground/60">{t('Efficiency Rank')}</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tighter">#1</div>
                            <div className="mt-1 text-[11px] font-medium text-muted-foreground/60">
                                {t('Top percentile in Saudi region')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ─── Main Content Grid ─── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                    {/* Activity Feed */}
                    <Card variant="premium" className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t('Project Activity')}</CardTitle>
                                <CardDescription>{t('Latest updates from your engineering teams.')}</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider h-8">
                                {t('View All')}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-4 transition-colors hover:bg-muted/30 p-2 -mx-2 rounded-xl group cursor-pointer">
                                        <div className="relative">
                                            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                                <AvatarImage src={`https://avatar.vercel.sh/${i}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -end-1 rounded-full bg-background p-0.5 shadow-sm">
                                                <div className="h-3 w-3 rounded-full bg-info shadow-[0_0_8px_rgba(var(--info),0.4)]" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[13px] font-bold text-foreground">
                                                    Sukoun Albunyan Engineering
                                                    <span className="ms-2 text-[11px] font-medium text-muted-foreground/40">
                                                        {t('committed to production')}
                                                    </span>
                                                </p>
                                                <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                                                    2m ago
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <code className="rounded bg-muted px-2 py-0.5 text-[11px] font-mono font-bold text-muted-foreground">
                                                    feat: premium-dashboard-sync
                                                </code>
                                                <ArrowUpRight className="h-3 w-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access / Stats */}
                    <Card variant="premium" className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>{t('Module Shortcuts')}</CardTitle>
                            <CardDescription>{t('Quick access to core business units.')}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {[
                                { name: 'Human Resources', color: 'bg-primary' },
                                { name: 'Projects & Tasks', color: 'bg-info' },
                                { name: 'Financial Control', color: 'bg-success' },
                            ].map((module) => (
                                <button
                                    key={module.name}
                                    className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40 hover:border-border group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-lg", module.color)} />
                                        <span className="text-[13px] font-bold text-foreground">
                                            {t(module.name)}
                                        </span>
                                    </div>
                                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground/30 group-hover:text-foreground transition-all rtl:rotate-180")} />
                                </button>
                            ))}

                            <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary to-info p-6 text-white shadow-xl shadow-info/10">
                                <h4 className="text-sm font-bold tracking-tight">{t('Enterprise Ready')}</h4>
                                <p className="mt-2 text-[12px] font-medium opacity-80 leading-relaxed">
                                    {t('Sukoun Albunyan is now running on Vercel Geist 2026 Engine. All systems fully optimized.')}
                                </p>
                                <Button className="mt-4 w-full bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-widest h-9">
                                    {t('View Insights')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
