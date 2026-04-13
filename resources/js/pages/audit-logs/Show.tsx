import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Shield,
    ArrowLeft,
    User,
    Calendar,
    Globe,
    Monitor,
    FileText,
    Plus,
    Pencil,
    Trash2,
    Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditLogEntry {
    id: number;
    user_id: number | null;
    user_type: string | null;
    user_name: string | null;
    event: string;
    auditable_type: string | null;
    auditable_id: number | null;
    auditable_label: string | null;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    changed_fields: string[] | null;
    ip_address: string | null;
    user_agent: string | null;
    method: string | null;
    route_name: string | null;
    company_id: number | null;
    created_at: string;
    user?: { id: number; name: string; email: string; type: string };
}

interface Props {
    auditLog: AuditLogEntry;
}

const eventConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    created: { icon: Plus, color: 'text-foreground', bg: 'bg-muted', label: 'Created' },
    updated: { icon: Pencil, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Updated' },
    deleted: { icon: Trash2, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Deleted' },
};

export default function AuditLogShow({ auditLog }: Props) {
    const { t } = useTranslation();
    const config = eventConfig[auditLog.event] || {
        icon: Activity,
        color: 'text-muted-foreground',
        bg: 'bg-muted/500/10',
        label: auditLog.event,
    };
    const EventIcon = config.icon;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getModelBasename = (type: string | null) => {
        if (!type) return '—';
        return type.split('\\').pop() || type;
    };

    const renderValue = (value: any): string => {
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${t('Audit Log')} #${auditLog.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('audit-logs.index')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border transition hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
                            <EventIcon className={`h-5 w-5 ${config.color}`} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">
                                {t('Audit Log')} #{auditLog.id}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {getModelBasename(auditLog.auditable_type)} —{' '}
                                {auditLog.auditable_label || `ID: ${auditLog.auditable_id}`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Details Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('Details')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}>
                                    <EventIcon className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('Event')}</div>
                                    <div className={`text-sm font-semibold capitalize ${config.color}`}>
                                        {auditLog.event}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/10">
                                    <User className="h-4 w-4 text-foreground" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('User')}</div>
                                    <div className="text-sm font-medium text-foreground">
                                        {auditLog.user_name || 'System'}
                                    </div>
                                    {auditLog.user && (
                                        <div className="text-xs text-muted-foreground">{auditLog.user.email}</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('Model')}</div>
                                    <div className="text-sm font-medium text-foreground">
                                        {getModelBasename(auditLog.auditable_type)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">ID: {auditLog.auditable_id}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('Date')}</div>
                                    <div className="text-sm font-medium text-foreground">
                                        {formatDate(auditLog.created_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/5">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('IP Address')}</div>
                                    <div className="font-mono text-sm text-foreground">
                                        {auditLog.ip_address || '—'}
                                    </div>
                                </div>
                            </div>

                            {auditLog.route_name && (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                        <Monitor className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">{t('Route')}</div>
                                        <div className="font-mono text-sm text-foreground">
                                            {auditLog.method} {auditLog.route_name}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {auditLog.changed_fields && auditLog.changed_fields.length > 0 && (
                                <div>
                                    <div className="mb-2 text-xs text-muted-foreground">{t('Changed Fields')}</div>
                                    <div className="flex flex-wrap gap-1">
                                        {auditLog.changed_fields.map((field) => (
                                            <span
                                                key={field}
                                                className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground"
                                            >
                                                {field}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Values Comparison */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('Data Changes')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {auditLog.event === 'created' && auditLog.new_values && (
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-foreground">{t('New Values')}</h3>
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border bg-muted/50">
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('Field')}
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('Value')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {Object.entries(auditLog.new_values).map(([key, value]) => (
                                                    <tr key={key} className="hover:bg-muted/20">
                                                        <td className="px-4 py-2 text-sm font-medium text-foreground">
                                                            {key}
                                                        </td>
                                                        <td className="break-all px-4 py-2 font-mono text-sm text-foreground">
                                                            {renderValue(value)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {auditLog.event === 'updated' && (
                                <div>
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border bg-muted/50">
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('Field')}
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('Old Value')}
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('New Value')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {auditLog.changed_fields?.map((field) => (
                                                    <tr key={field} className="hover:bg-muted/20">
                                                        <td className="px-4 py-2 text-sm font-medium text-foreground">
                                                            {field}
                                                        </td>
                                                        <td className="break-all px-4 py-2 font-mono text-sm text-muted-foreground">
                                                            {renderValue(auditLog.old_values?.[field])}
                                                        </td>
                                                        <td className="break-all px-4 py-2 font-mono text-sm text-foreground">
                                                            {renderValue(auditLog.new_values?.[field])}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {auditLog.event === 'deleted' && auditLog.old_values && (
                                <div>
                                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                                        {t('Deleted Values')}
                                    </h3>
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-border bg-muted/50">
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('Field')}
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                                                        {t('Value')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {Object.entries(auditLog.old_values).map(([key, value]) => (
                                                    <tr key={key} className="hover:bg-muted/20">
                                                        <td className="px-4 py-2 text-sm font-medium text-foreground">
                                                            {key}
                                                        </td>
                                                        <td className="break-all px-4 py-2 font-mono text-sm text-muted-foreground line-through">
                                                            {renderValue(value)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {!auditLog.old_values && !auditLog.new_values && (
                                <div className="flex flex-col items-center py-12 text-center">
                                    <Shield className="mb-3 h-10 w-10 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        {t('No detailed change data recorded for this event.')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
