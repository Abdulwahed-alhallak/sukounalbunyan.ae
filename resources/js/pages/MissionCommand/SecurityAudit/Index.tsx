import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ShieldAlert,
    ShieldCheck,
    Search,
    Filter,
    Shield,
    AlertTriangle,
    Fingerprint,
    MapPin,
    MonitorSmartphone,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AuditLog {
    id: number;
    action: string;
    entity_type: string | null;
    user: { name: string; email: string };
    ip_address: string;
    risk_level: 'LOW' | 'MEDIUM' | 'CRITICAL';
    created_at: string;
}

export default function SecurityAuditIndex({ initialLogs = [] }: { initialLogs?: AuditLog[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const renderRiskBadge = (risk: string) => {
        switch (risk) {
            case 'CRITICAL':
                return <Badge className="border-destructive bg-muted text-destructive">CRITICAL</Badge>;
            case 'MEDIUM':
                return <Badge className="bg-dion-amber/10 text-dion-amber border-dion-amber">MEDIUM</Badge>;
            default:
                return <Badge className="border-border bg-muted text-foreground">LOW</Badge>;
        }
    };

    return (
        <div className="mx-auto max-w-[1600px] space-y-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
                        <Shield className="h-8 w-8 text-black dark:text-foreground" />
                        Zero-Trust Audit Log
                    </h1>
                    <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
                        Immutable, cryptographic tracking of all workspace mutations and access attempts.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-border dark:border-border">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button className="bg-foreground text-background dark:bg-card dark:text-black">
                        Export Forensics CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="border-destructive/20 bg-foreground/5 shadow-none">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/20">
                            <ShieldAlert className="h-6 w-6 text-destructive" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-destructive/80">Critical Events (24h)</p>
                            <h2 className="text-2xl font-bold text-destructive">3 Blocked</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border/20 bg-foreground/5 shadow-none">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/20">
                            <ShieldCheck className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground/80">System Health</p>
                            <h2 className="text-2xl font-bold text-foreground">Optimal</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-muted/50 shadow-none dark:border-border dark:bg-foreground">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted dark:bg-card">
                            <Fingerprint className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Identity Checks</p>
                            <h2 className="text-2xl font-bold text-foreground dark:text-foreground">1,242 verified</h2>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border bg-muted/50 dark:border-border dark:bg-foreground">
                <div className="flex items-center justify-between border-b border-border bg-card p-4 dark:border-border dark:bg-foreground">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search IP, User, or Action..."
                            className="border-border bg-muted/50 pl-9 dark:border-border dark:bg-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/50 font-mono text-xs uppercase tracking-wider text-muted-foreground dark:border-border dark:bg-foreground/50">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Action & Resource</th>
                                <th className="px-6 py-4">Context</th>
                                <th className="px-6 py-4">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mock Data for Beta Build */}
                            <tr className="border-b border-border bg-card transition-colors hover:bg-muted/50 dark:border-border dark:bg-foreground dark:hover:bg-foreground/50">
                                <td className="px-6 py-4 font-mono text-muted-foreground">Just now</td>
                                <td className="flex items-center gap-2 px-6 py-4 font-semibold">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground">
                                        S
                                    </div>
                                    Super Admin
                                </td>
                                <td className="px-6 py-4 font-mono text-foreground dark:text-muted-foreground/60">
                                    VIEW_SEC_AUDIT
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MonitorSmartphone className="h-3 w-3" /> Windows 11 / Chrome
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> IP: 127.0.0.1 (Local)
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{renderRiskBadge('LOW')}</td>
                            </tr>
                            <tr className="border-b border-border bg-card transition-colors hover:bg-muted/50 dark:border-border dark:bg-foreground dark:hover:bg-foreground/50">
                                <td className="px-6 py-4 font-mono text-muted-foreground">2 mins ago</td>
                                <td className="flex items-center gap-2 px-6 py-4 font-semibold">
                                    <div className="bg-dion-cyan/10 text-dion-cyan flex h-6 w-6 items-center justify-center rounded-full">
                                        E
                                    </div>
                                    Employee John
                                </td>
                                <td className="px-6 py-4 font-mono text-foreground dark:text-muted-foreground/60">
                                    DELETE_INVOICE [ID:405]
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MonitorSmartphone className="h-3 w-3" /> macOS / Safari
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> IP: 192.168.1.45
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{renderRiskBadge('CRITICAL')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

SecurityAuditIndex.layout = (page: any) => {
    return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};
