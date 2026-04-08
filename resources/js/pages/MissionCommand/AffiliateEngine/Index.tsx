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
        toast.success("Affiliate link copied to clipboard!");
    };

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground flex items-center gap-3">
                        <Network className="w-8 h-8 text-dion-magenta" />
                        Affiliate & Retention Engine
                        <Badge className="bg-dion-magenta/10 text-dion-magenta border-dion-magenta hover:bg-dion-magenta/20">ACTIVE</Badge>
                    </h1>
                    <p className="text-muted-foreground dark:text-muted-foreground mt-2">
                        Turn your workspace into an exponential growth engine. Invite vendors and earn recurring credits.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-foreground to-black dark:from-foreground dark:to-black border-border text-background overflow-hidden relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-dion-magenta/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-foreground/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

                    <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                        <h2 className="text-2xl font-bold mb-2">Your Unique Magic Link</h2>
                        <p className="text-muted-foreground mb-6 max-w-lg">
                            Share this link with your vendors, clients, or partners. For every successful premium subscription, you earn an instant $100 recurring credit.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-center w-full max-w-xl">
                            <div className="relative w-full flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    readOnly 
                                    value={referralLink} 
                                    className="pl-9 h-12 bg-card/10 border-border text-background focus-visible:ring-dion-magenta"
                                />
                            </div>
                            <Button 
                                onClick={copyToClipboard}
                                className="h-12 w-full sm:w-auto bg-dion-magenta hover:bg-dion-magenta/90 text-background px-8 font-bold"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50 dark:bg-foreground border-border dark:border-border flex flex-col justify-between">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Available Credits
                            <DollarSign className="w-4 h-4 text-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                        <div className="text-4xl font-black tracking-tighter text-foreground dark:text-foreground mb-2">
                            $4,250.00
                        </div>
                        <div className="text-sm text-foreground font-medium flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +12% this month
                        </div>
                        <Button className="w-full mt-6 bg-foreground dark:bg-muted text-background dark:text-black">
                            Apply to Billing
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground mt-10 mb-4">Referred Companies (Network)</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { name: 'Aurora Tech Solutions', plan: 'Professional', status: 'ACTIVE', revenue: '$100/mo' },
                    { name: 'Nova Marketing Agency', plan: 'Enterprise', status: 'ACTIVE', revenue: '$250/mo' },
                    { name: 'Zenith Logistics', plan: 'Starter', status: 'TRIAL', revenue: 'Pending' },
                    { name: 'Vertex Studios', plan: 'Professional', status: 'ACTIVE', revenue: '$100/mo' },
                ].map((company, i) => (
                    <Card key={i} className="bg-card dark:bg-foreground border-border dark:border-border hover:border-dion-magenta/50 transition-colors cursor-pointer group">
                        <CardContent className="p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-dion-magenta/10 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-muted dark:bg-foreground flex items-center justify-center font-bold text-foreground dark:text-muted-foreground/60">
                                    {company.name[0]}
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h4 className="font-bold text-foreground dark:text-foreground mb-1">{company.name}</h4>
                            <div className="flex items-center justify-between mt-4">
                                <Badge variant="outline" className={company.status === 'ACTIVE' ? 'border-border/50 text-foreground' : 'border-dion-amber/50 text-dion-amber'}>
                                    {company.status}
                                </Badge>
                                <span className="font-mono text-sm text-muted-foreground font-semibold">{company.revenue}</span>
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
