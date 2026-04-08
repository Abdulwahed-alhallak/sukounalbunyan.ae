import React, { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ShieldCheck, Search, Filter, Shield, AlertTriangle, Fingerprint, MapPin, MonitorSmartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AuditLog {
    id: number;
    action: string;
    entity_type: string | null;
    user: { name: string, email: string };
    ip_address: string;
    risk_level: 'LOW' | 'MEDIUM' | 'CRITICAL';
    created_at: string;
}

export default function SecurityAuditIndex({ initialLogs = [] }: { initialLogs?: AuditLog[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const renderRiskBadge = (risk: string) => {
        switch (risk) {
            case 'CRITICAL': return <Badge className="bg-muted text-destructive border-destructive">CRITICAL</Badge>;
            case 'MEDIUM': return <Badge className="bg-dion-amber/10 text-dion-amber border-dion-amber">MEDIUM</Badge>;
            default: return <Badge className="bg-muted text-foreground border-border">LOW</Badge>;
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-foreground flex items-center gap-3">
                        <Shield className="w-8 h-8 text-black dark:text-foreground" />
                        Zero-Trust Audit Log
                    </h1>
                    <p className="text-muted-foreground dark:text-muted-foreground mt-2">
                        Immutable, cryptographic tracking of all workspace mutations and access attempts.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-border dark:border-border">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-foreground text-background dark:bg-card dark:text-black">
                        Export Forensics CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-foreground/5 border-destructive/20 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-foreground/20 flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-destructive/80">Critical Events (24h)</p>
                            <h2 className="text-2xl font-bold text-destructive">3 Blocked</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-foreground/5 border-border/20 shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-foreground/20 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground/80">System Health</p>
                            <h2 className="text-2xl font-bold text-foreground">Optimal</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50 dark:bg-foreground border-border dark:border-border shadow-none">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted dark:bg-card flex items-center justify-center">
                            <Fingerprint className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Identity Checks</p>
                            <h2 className="text-2xl font-bold text-foreground dark:text-foreground">1,242 verified</h2>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/50 dark:bg-foreground border-border dark:border-border">
                <div className="p-4 border-b border-border dark:border-border flex justify-between items-center bg-card dark:bg-foreground">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search IP, User, or Action..." 
                            className="pl-9 bg-muted/50 dark:bg-foreground border-border dark:border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/50 dark:bg-foreground/50 uppercase border-b border-border dark:border-border font-mono tracking-wider">
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
                            <tr className="bg-card dark:bg-foreground border-b border-border dark:border-border hover:bg-muted/50 dark:hover:bg-foreground/50 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground font-mono">Just now</td>
                                <td className="px-6 py-4 font-semibold flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-foreground">S</div>
                                    Super Admin
                                </td>
                                <td className="px-6 py-4 font-mono text-foreground dark:text-muted-foreground/60">
                                    VIEW_SEC_AUDIT
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1"><MonitorSmartphone className="w-3 h-3"/> Windows 11 / Chrome</div>
                                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/> IP: 127.0.0.1 (Local)</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{renderRiskBadge('LOW')}</td>
                            </tr>
                            <tr className="bg-card dark:bg-foreground border-b border-border dark:border-border hover:bg-muted/50 dark:hover:bg-foreground/50 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground font-mono">2 mins ago</td>
                                <td className="px-6 py-4 font-semibold flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-dion-cyan/10 flex items-center justify-center text-dion-cyan">E</div>
                                    Employee John
                                </td>
                                <td className="px-6 py-4 font-mono text-foreground dark:text-muted-foreground/60">
                                    DELETE_INVOICE [ID:405]
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1"><MonitorSmartphone className="w-3 h-3"/> macOS / Safari</div>
                                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3"/> IP: 192.168.1.45</div>
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
