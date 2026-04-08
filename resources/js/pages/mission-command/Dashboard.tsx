import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageProps } from '@/types';
import { Shield, Radio, Trophy, Activity, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MissionCommandDashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Mission Command | Dion Creative" />
            
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-background mb-2 flex items-center gap-3">
                        <Shield className="h-8 w-8 text-foreground" />
                        Mission Command
                    </h1>
                    <p className="text-muted-foreground">
                        Restricted Operations Hub. Top-level control of the Dion Creative SaaS ecosystem.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-card/50 border-foreground/20 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Students (Dion)</CardTitle>
                            <Users className="h-4 w-4 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,245</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-foreground/20 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                            <Activity className="h-4 w-4 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">99.9%</div>
                            <p className="text-xs text-muted-foreground">All nodes operational</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-foreground/20 backdrop-blur-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Push Broadcasts</CardTitle>
                            <Radio className="h-4 w-4 text-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">34</div>
                            <p className="text-xs text-muted-foreground">Total FCM sent</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Link href={route('mission-command.notifications.index')} className="group">
                        <Card className="h-full transition-all hover:bg-muted/50 hover:border-foreground cursor-pointer border-transparent">
                            <CardHeader>
                                <div className="p-3 bg-foreground/10 w-fit rounded-lg mb-3 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                                    <Radio className="h-6 w-6 text-foreground" />
                                </div>
                                <CardTitle>Firebase Push Hub</CardTitle>
                                <CardDescription>
                                    Broadcast real-time push notifications across all mobile and web devices instantly. Target specific user roles or departments.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href={route('mission-command.gamification.index')} className="group">
                        <Card className="h-full transition-all hover:bg-muted/50 hover:border-foreground cursor-pointer border-transparent">
                            <CardHeader>
                                <div className="p-3 bg-muted w-fit rounded-lg mb-3 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                                    <Trophy className="h-6 w-6 text-foreground" />
                                </div>
                                <CardTitle>Gamification Engine</CardTitle>
                                <CardDescription>
                                    Configure loyalty points, student tiers, and badge mechanics to incentivize ecosystem engagement.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
