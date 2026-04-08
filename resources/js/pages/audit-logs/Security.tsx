import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    Shield, AlertTriangle, LogIn, LogOut, Lock, KeyRound,
    Search, Calendar, User, Monitor, Smartphone, Tablet,
    ChevronLeft, ArrowLeft,
} from 'lucide-react';

interface SecurityLogEntry {
    id: number;
    user_id: number | null;
    event: string;
    ip_address: string | null;
    browser: string | null;
    os: string | null;
    device_type: string | null;
    is_suspicious: boolean;
    details: string | null;
    created_at: string;
    user?: { id: number; name: string; email: string; type: string };
}

interface PaginatedData {
    data: SecurityLogEntry[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    logs: PaginatedData;
    filters: Record<string, string>;
    eventTypes: string[];
}

const secEventConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    login: { icon: LogIn, color: 'text-foreground', bg: 'bg-foreground/5', label: 'Login' },
    logout: { icon: LogOut, color: 'text-foreground', bg: 'bg-muted', label: 'Logout' },
    failed_login: { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Failed Login' },
    password_changed: { icon: KeyRound, color: 'text-foreground', bg: 'bg-foreground/5', label: 'Password Changed' },
    account_deleted: { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Account Deleted' },
    '2fa_enabled': { icon: Shield, color: 'text-foreground', bg: 'bg-foreground/5', label: '2FA Enabled' },
};

const deviceIcons: Record<string, any> = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
};

export default function SecurityLogs({ logs, filters, eventTypes }: Props) {
    const { t } = useTranslation();
    const [suspiciousOnly, setSuspiciousOnly] = useState(!!filters.suspicious_only);

    const handleFilter = (key: string, value: string | boolean) => {
        router.get(route('audit-logs.security'), {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const getConfig = (event: string) => {
        return secEventConfig[event] || { icon: Lock, color: 'text-muted-foreground', bg: 'bg-muted', label: event };
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-GB', {
            year: 'numeric', month: 'short', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={t('Security Audit Logs')} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <a href={route('audit-logs.index')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </a>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 border border-border">
                            <Shield className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{t('Security Audit')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('Monitor login attempts and security events')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {['login', 'logout', 'failed_login', 'password_changed', 'account_deleted'].map(event => {
                        const config = getConfig(event);
                        const EventIcon = config.icon;
                        const count = logs.data.filter(l => l.event === event).length;
                        return (
                            <div key={event}
                                onClick={() => handleFilter('event', filters.event === event ? '' : event)}
                                className={`cursor-pointer rounded-xl border p-3 transition hover:shadow-md ${
                                    filters.event === event ? 'border-foreground bg-foreground/5' : 'border-border bg-card'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}>
                                        <EventIcon className={`h-4 w-4 ${config.color}`} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-foreground">{count}</div>
                                        <div className="text-[10px] text-muted-foreground">{config.label}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            checked={suspiciousOnly}
                            onChange={e => {
                                setSuspiciousOnly(e.target.checked);
                                handleFilter('suspicious_only', e.target.checked ? 'true' : '');
                            }}
                            className="h-4 w-4 rounded border-border text-foreground focus:ring-ring"
                        />
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {t('Suspicious Only')}
                        </span>
                    </label>
                </div>

                {/* Security Log Table */}
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Event')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('User')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('IP Address')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Browser / OS')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Device')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Details')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Date')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            <Shield className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                            {t('No security logs found')}
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map(log => {
                                        const config = getConfig(log.event);
                                        const EventIcon = config.icon;
                                        const DeviceIcon = deviceIcons[log.device_type || 'desktop'] || Monitor;
                                        return (
                                            <tr key={log.id} className={`transition hover:bg-muted/30 ${log.is_suspicious ? 'bg-muted/50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
                                                        <EventIcon className="h-3 w-3" />
                                                        {config.label}
                                                        {log.is_suspicious && (
                                                            <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <div>
                                                            <div className="text-sm font-medium text-foreground">
                                                                {log.user?.name || 'Unknown'}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {log.user?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                                    {log.ip_address || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    <div>{log.browser || '—'}</div>
                                                    <div className="text-muted-foreground/70">{log.os || ''}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                                                </td>
                                                <td className="max-w-[200px] truncate px-4 py-3 text-xs text-muted-foreground">
                                                    {log.details || '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(log.created_at)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3">
                            <div className="text-sm text-muted-foreground">
                                {t('Showing')} {logs.from} - {logs.to} {t('of')} {logs.total}
                            </div>
                            <div className="flex items-center gap-1">
                                {logs.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`inline-flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-sm transition ${
                                            link.active
                                                ? 'bg-foreground text-background'
                                                : link.url
                                                ? 'text-muted-foreground hover:bg-accent'
                                                : 'cursor-not-allowed text-muted-foreground/50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
