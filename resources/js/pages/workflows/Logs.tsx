import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface LogEntry {
    id: number;
    trigger_module: string;
    trigger_event: string;
    triggerable_type: string | null;
    triggerable_id: number | null;
    status: string;
    actions_executed: any[] | null;
    error_message: string | null;
    duration_ms: number | null;
    created_at: string;
    rule?: { id: number; name: string } | null;
}

interface Props {
    logs: { data: LogEntry[]; total: number; links: any[] };
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    completed: { icon: CheckCircle, color: 'text-foreground', bg: 'bg-foreground/5' },
    failed: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
    running: { icon: Activity, color: 'text-foreground', bg: 'bg-muted' },
    pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function WorkflowLogs({ logs }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Workflows'), url: route('workflows.index') }, { label: t('Execution Logs') }]}>
            <Head title={t('Workflow Logs')} />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={route('workflows.index')} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-accent">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{t('Execution Logs')}</h1>
                        <p className="text-sm text-muted-foreground">{logs.total} {t('total executions')}</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Rule')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Trigger')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Status')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Duration')}</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('Date')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {logs.data.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                    <Zap className="mx-auto mb-2 h-8 w-8 opacity-30" /> {t('No logs yet')}
                                </td></tr>
                            ) : logs.data.map(log => {
                                const cfg = statusConfig[log.status] || statusConfig.pending;
                                const StatusIcon = cfg.icon;
                                return (
                                    <tr key={log.id} className="transition hover:bg-muted/20">
                                        <td className="px-4 py-3 text-sm font-medium text-foreground">{log.rule?.name || '—'}</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{log.trigger_module} → {log.trigger_event}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                                                <StatusIcon className="h-3 w-3" /> {log.status}
                                            </span>
                                            {log.error_message && <p className="mt-0.5 text-[10px] text-muted-foreground truncate max-w-[200px]">{log.error_message}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{log.duration_ms ? `${log.duration_ms}ms` : '—'}</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
