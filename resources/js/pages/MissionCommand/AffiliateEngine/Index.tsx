import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Network, Link as LinkIcon, Copy, Share2, Users, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AffiliateEngineIndex() {
    const [referralLink] = useState('https://dion.sy/join?ref=DN_8471X8');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Affiliate link copied to clipboard!');
    };

    return (
        <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
                        <Network className="text-dion-magenta h-8 w-8" />
                        Affiliate & Retention Engine
                        <Badge className="bg-dion-magenta/10 text-dion-magenta border-dion-magenta hover:bg-dion-magenta/20">
                            ACTIVE
                        </Badge>
                    </h1>
                    <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
                        Turn your workspace into an exponential growth engine. Invite vendors and earn recurring
                        credits.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="relative col-span-1 overflow-hidden border-border bg-gradient-to-br from-foreground to-black text-background dark:from-foreground dark:to-black md:col-span-2">
                    {/* Decorative Background Elements */}
                    <div className="bg-dion-magenta/20 absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/2 rounded-full bg-foreground/20 blur-[60px]"></div>

                    <CardContent className="relative z-10 flex h-full flex-col justify-center p-8">
                        <h2 className="mb-2 text-2xl font-bold">Your Unique Magic Link</h2>
                        <p className="mb-6 max-w-lg text-muted-foreground">
                            Share this link with your vendors, clients, or partners. For every successful premium
                            subscription, you earn an instant $100 recurring credit.
                        </p>

                        <div className="flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row">
                            <div className="relative w-full flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    readOnly
                                    value={referralLink}
                                    className="focus-visible:ring-dion-magenta h-12 border-border bg-card/10 pl-9 text-background"
                                />
                            </div>
                            <Button
                                onClick={copyToClipboard}
                                className="bg-dion-magenta hover:bg-dion-magenta/90 h-12 w-full px-8 font-bold text-background sm:w-auto"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-between border-border bg-muted/50 dark:border-border dark:bg-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                            Available Credits
                            <DollarSign className="h-4 w-4 text-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                        <div className="mb-2 text-4xl font-black tracking-tighter text-foreground dark:text-foreground">
                            $4,250.00
                        </div>
                        <div className="flex items-center text-sm font-medium text-foreground">
                            <TrendingUp className="mr-1 h-4 w-4" /> +12% this month
                        </div>
                        <Button className="mt-6 w-full bg-foreground text-background dark:bg-muted dark:text-black">
                            Apply to Billing
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h3 className="mb-4 mt-10 text-xl font-bold tracking-tight text-foreground dark:text-foreground">
                Referred Companies (Network)
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    { name: 'Aurora Tech Solutions', plan: 'Professional', status: 'ACTIVE', revenue: '$100/mo' },
                    { name: 'Nova Marketing Agency', plan: 'Enterprise', status: 'ACTIVE', revenue: '$250/mo' },
                    { name: 'Zenith Logistics', plan: 'Starter', status: 'TRIAL', revenue: 'Pending' },
                    { name: 'Vertex Studios', plan: 'Professional', status: 'ACTIVE', revenue: '$100/mo' },
                ].map((company, i) => (
                    <Card
                        key={i}
                        className="hover:border-dion-magenta/50 group cursor-pointer border-border bg-card transition-colors dark:border-border dark:bg-foreground"
                    >
                        <CardContent className="relative overflow-hidden p-5">
                            <div className="from-dion-magenta/10 absolute right-0 top-0 -mr-4 -mt-4 h-16 w-16 rounded-bl-[100px] bg-gradient-to-br to-transparent transition-transform group-hover:scale-150"></div>
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-foreground dark:bg-foreground dark:text-muted-foreground/60">
                                    {company.name[0]}
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <h4 className="mb-1 font-bold text-foreground dark:text-foreground">{company.name}</h4>
                            <div className="mt-4 flex items-center justify-between">
                                <Badge
                                    variant="outline"
                                    className={
                                        company.status === 'ACTIVE'
                                            ? 'border-border/50 text-foreground'
                                            : 'border-dion-amber/50 text-dion-amber'
                                    }
                                >
                                    {company.status}
                                </Badge>
                                <span className="font-mono text-sm font-semibold text-muted-foreground">
                                    {company.revenue}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

AffiliateEngineIndex.layout = (page: any) => {
    return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};
