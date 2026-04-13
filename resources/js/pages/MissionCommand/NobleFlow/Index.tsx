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
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground flex items-center gap-3">
                        <Settings2 className="w-8 h-8 text-dion-cyan" />
                        nobleflow Studio
                    </h1>
                    <p className="text-muted-foreground dark:text-muted-foreground mt-2">
                        Visual No-Code Automation Engine. Turn your business logic into autonomous execution.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsCreating(true)}
                    className="bg-dion-cyan hover:bg-dion-cyan/90 text-foreground font-bold"
                >
                    <CopyPlus className="w-4 h-4 mr-2" />
                    Create Workflow
                </Button>
            </div>

            {/* List Active Workflows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((flow) => (
                    <Card key={flow.id} className="bg-muted/50 dark:bg-foreground border-border dark:border-border shadow-xl overflow-hidden group">
                        <CardHeader className="bg-gradient-to-r from-muted to-muted/50 dark:from-foreground dark:to-card/80 border-b border-border dark:border-border pb-4">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg font-bold text-foreground dark:text-foreground uppercase tracking-wider">
                                    {flow.name}
                                </CardTitle>
                                <Badge variant={flow.is_active ? 'default' : 'secondary'} className={flow.is_active ? 'bg-dion-cyan text-foreground' : ''}>
                                    {flow.is_active ? 'ACTIVE' : 'DRAFT'}
                                </Badge>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground font-mono">
                                TRIGGER: <span className="text-dion-amber">{triggers[flow.trigger_event] || flow.trigger_event}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 space-y-3">
                                <div className="text-xs tracking-widest text-muted-foreground font-semibold mb-2">EXECUTION CHAIN</div>
                                {flow.steps.map((step: any, idx: number) => (
                                    <div key={step.id} className="flex items-center gap-3 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-muted dark:bg-card text-muted-foreground flex items-center justify-center font-bold text-xs shadow-inner">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 px-3 py-2 bg-card dark:bg-foreground border border-border dark:border-border rounded-md font-mono text-foreground dark:text-muted-foreground/60">
                                            {actions[step.action_type] || step.action_type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-border dark:border-border bg-muted/50 dark:bg-foreground/50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm" className="border-dion-amber text-dion-amber hover:bg-dion-amber hover:text-foreground">
                                    <Play className="w-4 h-4 mr-1" /> Test Run
                                </Button>
                                <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-foreground hover:text-background">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {workflows.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border dark:border-border rounded-xl">
                        <Settings2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-foreground dark:text-muted-foreground/60">No Workflows Deployed</h3>
                        <p className="text-muted-foreground mt-2">The system is currently operating on manual mode. Create a workflow to automate tasks.</p>
                    </div>
                )}
            </div>
            
            {/* Visual Builder Modal Mockup (To be expanded) */}
            {isCreating && (
                <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl bg-muted/50 dark:bg-foreground border-border dark:border-border shadow-2xl">
                        <CardHeader>
                            <CardTitle>Deploy New nobleflow</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-center py-20">Visual Node Builder Component Initializing...</p>
                            <div className="flex justify-end gap-3 mt-4">
                                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
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

