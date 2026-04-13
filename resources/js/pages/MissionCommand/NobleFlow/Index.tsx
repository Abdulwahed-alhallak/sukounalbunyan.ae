import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CopyPlus, Play, Settings2, Trash2 } from 'lucide-react';

interface nobleflowProps {
    workflows: any[];
    triggers: Record<string, string>;
    actions: Record<string, string>;
}

export default function nobleflowIndex({ workflows, triggers, actions }: nobleflowProps) {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
                        <Settings2 className="text-dion-cyan h-8 w-8" />
                        nobleflow Studio
                    </h1>
                    <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
                        Visual No-Code Automation Engine. Turn your business logic into autonomous execution.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-dion-cyan hover:bg-dion-cyan/90 font-bold text-foreground"
                >
                    <CopyPlus className="mr-2 h-4 w-4" />
                    Create Workflow
                </Button>
            </div>

            {/* List Active Workflows */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {workflows.map((flow) => (
                    <Card
                        key={flow.id}
                        className="group overflow-hidden border-border bg-muted/50 shadow-xl dark:border-border dark:bg-foreground"
                    >
                        <CardHeader className="border-b border-border bg-gradient-to-r from-muted to-muted/50 pb-4 dark:border-border dark:from-foreground dark:to-card/80">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg font-bold uppercase tracking-wider text-foreground dark:text-foreground">
                                    {flow.name}
                                </CardTitle>
                                <Badge
                                    variant={flow.is_active ? 'default' : 'secondary'}
                                    className={flow.is_active ? 'bg-dion-cyan text-foreground' : ''}
                                >
                                    {flow.is_active ? 'ACTIVE' : 'DRAFT'}
                                </Badge>
                            </div>
                            <div className="mt-2 font-mono text-sm text-muted-foreground">
                                TRIGGER:{' '}
                                <span className="text-dion-amber">
                                    {triggers[flow.trigger_event] || flow.trigger_event}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-3 p-4">
                                <div className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground">
                                    EXECUTION CHAIN
                                </div>
                                {flow.steps.map((step: any, idx: number) => (
                                    <div key={step.id} className="flex items-center gap-3 text-sm">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground shadow-inner dark:bg-card">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 rounded-md border border-border bg-card px-3 py-2 font-mono text-foreground dark:border-border dark:bg-foreground dark:text-muted-foreground/60">
                                            {actions[step.action_type] || step.action_type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-2 border-t border-border bg-muted/50 p-4 opacity-0 transition-opacity group-hover:opacity-100 dark:border-border dark:bg-foreground/50">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-dion-amber text-dion-amber hover:bg-dion-amber hover:text-foreground"
                                >
                                    <Play className="mr-1 h-4 w-4" /> Test Run
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-destructive text-destructive hover:bg-foreground hover:text-background"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {workflows.length === 0 && (
                    <div className="col-span-full rounded-xl border-2 border-dashed border-border py-20 text-center dark:border-border">
                        <Settings2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="text-xl font-bold text-foreground dark:text-muted-foreground/60">
                            No Workflows Deployed
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            The system is currently operating on manual mode. Create a workflow to automate tasks.
                        </p>
                    </div>
                )}
            </div>

            {/* Visual Builder Modal Mockup (To be expanded) */}
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-4xl border-border bg-muted/50 shadow-2xl dark:border-border dark:bg-foreground">
                        <CardHeader>
                            <CardTitle>Deploy New nobleflow</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="py-20 text-center text-muted-foreground">
                                Visual Node Builder Component Initializing...
                            </p>
                            <div className="mt-4 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsCreating(false)}>
                                    Cancel
                                </Button>
                                <Button className="bg-dion-cyan text-foreground">Save Workflow</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

import AuthenticatedLayout from '@/layouts/authenticated-layout';

// Ensure the page utilizes the authenticated layout
nobleflowIndex.layout = (page: any) => {
    return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};
