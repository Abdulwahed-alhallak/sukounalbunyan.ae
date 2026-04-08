import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Trophy, TrendingUp, Medal, Star, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Interfaces for props
interface Rule {
    id: number;
    event_name: string;
    description: string;
    points_reward: number;
    is_active: boolean;
}

interface LeaderboardUser {
    id: number;
    user: { name: string; email: string };
    points: number;
    level: number;
    tier: string;
}

export default function GamificationEngine({ rules, leaderboard }: { rules: Rule[], leaderboard: LeaderboardUser[] }) {
    const { data: rulesData, setData: setRulesData, post: postRules, processing: processingRules } = useForm({
        rules: rules || []
    });

    const { data: newRule, setData: setNewRule, post: postNewRule, processing: processingNewRule, reset } = useForm({
        event_name: '',
        description: '',
        points_reward: 10,
        is_active: true,
    });

    const [isCreating, setIsCreating] = useState(false);

    const handleRuleUpdate = (index: number, field: keyof Rule, value: any) => {
        const newRules = [...rulesData.rules];
        newRules[index] = { ...newRules[index], [field]: value };
        setRulesData('rules', newRules);
    };

    const saveRules = (e: React.FormEvent) => {
        e.preventDefault();
        postRules(route('mission-command.gamification.rules.update'));
    };

    const saveNewRule = (e: React.FormEvent) => {
        e.preventDefault();
        postNewRule(route('mission-command.gamification.rules.create'), {
            onSuccess: () => {
                reset();
                setIsCreating(false);
            }
        });
    };

    const getTierColor = (tier: string) => {
        switch (tier.toLowerCase()) {
            case 'bronze': return 'text-foreground bg-muted border-border';
            case 'silver': return 'text-muted-foreground bg-muted/10 border-border/30';
            case 'gold': return 'text-foreground bg-muted border-border';
            case 'platinum': return 'text-muted-foreground bg-foreground/5 border-border';
            case 'diamond': return 'text-muted-foreground bg-muted border-border';
            default: return 'text-muted-foreground bg-muted/500/10 border-border/30';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gamification Engine | Mission Command" />
            
            <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-muted rounded-lg">
                        <Trophy className="h-8 w-8 text-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-background mb-1">
                            Gamification Mechanics
                        </h1>
                        <p className="text-muted-foreground">
                            Define points for system actions, define psychological hooks, and monitor the leaderboard.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Rules Section */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-card shadow-lg border-foreground/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>Points Allocation Matrix</CardTitle>
                                    <CardDescription>Adjust how much XP users gain per activity.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => setIsCreating(!isCreating)}>
                                    <Plus className="w-4 h-4 mr-2" /> New Logic
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isCreating && (
                                    <form onSubmit={saveNewRule} className="mb-6 p-4 bg-muted/30 rounded-lg border border-dashed border-border flex flex-col space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Event Key (e.g. login_daily)</Label>
                                                <Input value={newRule.event_name} onChange={e => setNewRule('event_name', e.target.value)} required />
                                            </div>
                                            <div>
                                                <Label>Points Reward</Label>
                                                <Input type="number" value={newRule.points_reward} onChange={e => setNewRule('points_reward', Number(e.target.value))} required />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>User-Friendly Description</Label>
                                            <Input value={newRule.description} onChange={e => setNewRule('description', e.target.value)} required />
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" disabled={processingNewRule}>Attach New Logic Rule</Button>
                                        </div>
                                    </form>
                                )}

                                <form onSubmit={saveRules}>
                                    <div className="space-y-4">
                                        {rulesData.rules.map((rule, index) => (
                                            <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/20 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-base font-semibold">{rule.event_name}</Label>
                                                        {!rule.is_active && <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">INACTIVE</span>}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{rule.description}</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Star className="w-4 h-4 text-foreground fill-foreground/10" />
                                                        <Input 
                                                            type="number" 
                                                            className="w-20 text-right h-8"
                                                            value={rule.points_reward}
                                                            onChange={(e) => handleRuleUpdate(index, 'points_reward', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <Switch 
                                                        checked={rule.is_active} 
                                                        onCheckedChange={(val) => handleRuleUpdate(index, 'is_active', val)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {rulesData.rules.length > 0 && (
                                        <div className="mt-6 flex justify-end">
                                            <Button type="submit" disabled={processingRules} className="bg-foreground hover:bg-foreground/90">
                                                Synchronize Framework
                                            </Button>
                                        </div>
                                    )}
                                    {rulesData.rules.length === 0 && !isCreating && (
                                        <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                                            No gamification rules are loaded. Create one to begin tracking XP.
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard Section */}
                    <div>
                        <Card className="bg-card shadow-xl border-border h-full">
                            <CardHeader className="bg-muted/20 border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-foreground" /> Global Leaderboard
                                </CardTitle>
                                <CardDescription>Top 10 highest ranking users in the DionONE ecosystem.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {leaderboard && leaderboard.length > 0 ? (
                                    <div className="divide-y divide-border/40">
                                        {leaderboard.map((lb, i) => (
                                            <div key={lb.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-foreground text-black' : i === 1 ? 'bg-muted text-black' : i === 2 ? 'bg-muted text-background' : 'bg-muted text-muted-foreground'}`}>
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 truncate">
                                                    <div className="font-medium text-sm text-foreground truncate">{lb.user?.name}</div>
                                                    <div className="text-xs text-muted-foreground flex gap-2">
                                                        <span>Lvl {lb.level}</span>
                                                        <span className="opacity-50">|</span>
                                                        <span className="font-mono">{lb.points.toLocaleString()} XP</span>
                                                    </div>
                                                </div>
                                                <div className={`text-xs px-2 py-1 rounded-md border font-semibold tracking-wider uppercase ${getTierColor(lb.tier)}`}>
                                                    {lb.tier}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                                        <Medal className="w-12 h-12 mb-3 opacity-20" />
                                        <p>The leaderboard is currently empty.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
