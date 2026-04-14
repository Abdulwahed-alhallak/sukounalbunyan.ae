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

export default function GamificationEngine({ rules, leaderboard }: { rules: Rule[]; leaderboard: LeaderboardUser[] }) {
    const {
        data: rulesData,
        setData: setRulesData,
        post: postRules,
        processing: processingRules,
    } = useForm({
        rules: rules || [],
    });

    const {
        data: newRule,
        setData: setNewRule,
        post: postNewRule,
        processing: processingNewRule,
        reset,
    } = useForm({
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
            },
        });
    };

    const getTierColor = (tier: string) => {
        switch (tier.toLowerCase()) {
            case 'bronze':
                return 'text-foreground bg-muted border-border';
            case 'silver':
                return 'text-muted-foreground bg-muted/10 border-border/30';
            case 'gold':
                return 'text-foreground bg-muted border-border';
            case 'platinum':
                return 'text-muted-foreground bg-foreground/5 border-border';
            case 'diamond':
                return 'text-muted-foreground bg-muted border-border';
            default:
                return 'text-muted-foreground bg-muted/500/10 border-border/30';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gamification Engine | Mission Command" />

            <div className="mx-auto flex max-w-6xl flex-col space-y-6">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-3">
                        <Trophy className="h-8 w-8 text-foreground" />
                    </div>
                    <div>
                        <h1 className="mb-1 text-3xl font-bold tracking-tight text-background">
                            Gamification Mechanics
                        </h1>
                        <p className="text-muted-foreground">
                            Define points for system actions, define psychological hooks, and monitor the leaderboard.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Rules Section */}
                    <div className="space-y-6 md:col-span-2">
                        <Card className="border-foreground/20 bg-card shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>Points Allocation Matrix</CardTitle>
                                    <CardDescription>Adjust how much XP users gain per activity.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => setIsCreating(!isCreating)}>
                                    <Plus className="me-2 h-4 w-4" /> New Logic
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isCreating && (
                                    <form
                                        onSubmit={saveNewRule}
                                        className="mb-6 flex flex-col space-y-3 rounded-lg border border-dashed border-border bg-muted/30 p-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Event Key (e.g. login_daily)</Label>
                                                <Input
                                                    value={newRule.event_name}
                                                    onChange={(e) => setNewRule('event_name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Points Reward</Label>
                                                <Input
                                                    type="number"
                                                    value={newRule.points_reward}
                                                    onChange={(e) =>
                                                        setNewRule('points_reward', Number(e.target.value))
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>User-Friendly Description</Label>
                                            <Input
                                                value={newRule.description}
                                                onChange={(e) => setNewRule('description', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <Button type="submit" disabled={processingNewRule}>
                                                Attach New Logic Rule
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                <form onSubmit={saveRules}>
                                    <div className="space-y-4">
                                        {rulesData.rules.map((rule, index) => (
                                            <div
                                                key={rule.id}
                                                className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-muted/20"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-base font-semibold">
                                                            {rule.event_name}
                                                        </Label>
                                                        {!rule.is_active && (
                                                            <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] text-destructive">
                                                                INACTIVE
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {rule.description}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Star className="h-4 w-4 fill-foreground/10 text-foreground" />
                                                        <Input
                                                            type="number"
                                                            className="h-8 w-20 text-end"
                                                            value={rule.points_reward}
                                                            onChange={(e) =>
                                                                handleRuleUpdate(
                                                                    index,
                                                                    'points_reward',
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <Switch
                                                        checked={rule.is_active}
                                                        onCheckedChange={(val) =>
                                                            handleRuleUpdate(index, 'is_active', val)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {rulesData.rules.length > 0 && (
                                        <div className="mt-6 flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={processingRules}
                                                className="bg-foreground hover:bg-foreground/90"
                                            >
                                                Synchronize Framework
                                            </Button>
                                        </div>
                                    )}
                                    {rulesData.rules.length === 0 && !isCreating && (
                                        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                                            No gamification rules are loaded. Create one to begin tracking XP.
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard Section */}
                    <div>
                        <Card className="h-full border-border bg-card shadow-xl">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-foreground" /> Global Leaderboard
                                </CardTitle>
                                <CardDescription>
                                    Top 10 highest ranking users in theNobleArchitecture ecosystem.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {leaderboard && leaderboard.length > 0 ? (
                                    <div className="divide-y divide-border/40">
                                        {leaderboard.map((lb, i) => (
                                            <div
                                                key={lb.id}
                                                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/30"
                                            >
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? 'bg-foreground text-black' : i === 1 ? 'bg-muted text-black' : i === 2 ? 'bg-muted text-background' : 'bg-muted text-muted-foreground'}`}
                                                >
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 truncate">
                                                    <div className="truncate text-sm font-medium text-foreground">
                                                        {lb.user?.name}
                                                    </div>
                                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                                        <span>Lvl {lb.level}</span>
                                                        <span className="opacity-50">|</span>
                                                        <span className="font-mono">
                                                            {lb.points.toLocaleString()} XP
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-wider ${getTierColor(lb.tier)}`}
                                                >
                                                    {lb.tier}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                        <Medal className="mb-3 h-12 w-12 opacity-20" />
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
