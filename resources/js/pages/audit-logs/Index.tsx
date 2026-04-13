import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    Shield,
    Activity,
    Download,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Calendar,
    Filter,
    User,
    FileText,
    AlertTriangle,
    Plus,
    Pencil,
    Trash2,
    LogIn,
} from 'lucide-react';

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
    method: string | null;
    route_name: string | null;
    created_at: string;
    user?: { id: number; name: string; email: string; type: string };
}

interface PaginatedData {
    data: AuditLogEntry[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    logs: PaginatedData;
    filters: Record<string, string>;
    modelTypes: { value: string; label: string }[];
    eventTypes: string[];
}

const eventConfig: Record<string, { icon: any; color: string; bg: string }> = {
    created: { icon: Plus, color: 'text-foreground', bg: 'bg-foreground/5' },
    updated: { icon: Pencil, color: 'text-foreground', bg: 'bg-muted' },
    deleted: { icon: Trash2, color: 'text-muted-foreground', bg: 'bg-muted' },
    login: { icon: LogIn, color: 'text-foreground', bg: 'bg-foreground/5' },
    exported: {
        icon: Download,
        color: 'text-foreground',
        bg: 'bg-muted',
    },
    approved: { icon: Shield, color: 'text-foreground', bg: 'bg-foreground/5' },
};

export default function AuditLogsIndex({ logs, filters, modelTypes, eventTypes }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilter = (key: string, value: string) => {
        router.get(
            route('audit-logs.index'),
            {
                ...filters,
                [key]: value || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('search', search);
    };

    const getEventConfig = (event: string) => {
        return (
            eventConfig[event] || {
                icon: Activity,
                color: 'text-muted-foreground',
                bg: 'bg-muted',
            }
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
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

    return (
        <AuthenticatedLayout>
            <Head title={t('Audit Logs')} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-foreground/5">
                            <Shield className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{t('Audit Logs')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {t('Track all system changes and user activities')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={route('audit-logs.security')}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            {t('Security Logs')}
                        </a>
                        <a
                            href={route('audit-logs.export', filters)}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                        >
                            <Download className="h-4 w-4" />
                            {t('Export CSV')}
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <div className="text-2xl font-bold text-foreground">{logs.total}</div>
                        <div className="text-xs text-muted-foreground">{t('Total Entries')}</div>
                    </div>
                    {['created', 'updated', 'deleted'].map((event) => {
                        const config = getEventConfig(event);
                        const count = logs.data.filter((l) => l.event === event).length;
                        return (
                            <div key={event} className="rounded-xl border border-border bg-card p-4">
                                <div className={`text-2xl font-bold ${config.color}`}>{count}</div>
                                <div className="text-xs capitalize text-muted-foreground">{t(event)}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Search & Filters */}
                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('Search by label, user, or IP...')}
                                className="w-full rounded-lg border border-border bg-background py-2 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
                            />
                        </form>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${showFilters ? 'border-foreground bg-foreground/10 text-foreground' : 'border-border bg-background text-foreground hover:bg-accent'}`}
                        >
                            <Filter className="h-4 w-4" />
                            {t('Filters')}
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-4">
                            <select
                                value={filters.event || ''}
                                onChange={(e) => handleFilter('event', e.target.value)}
                                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                            >
                                <option value="">{t('All Events')}</option>
                                {eventTypes.map((e) => (
                                    <option key={e} value={e}>
                                        {e}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filters.model_type || ''}
                                onChange={(e) => handleFilter('model_type', e.target.value)}
                                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                            >
                                <option value="">{t('All Models')}</option>
                                {modelTypes.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={filters.date_from || ''}
                                onChange={(e) => handleFilter('date_from', e.target.value)}
                                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                placeholder={t('Date From')}
                            />

                            <input
                                type="date"
                                value={filters.date_to || ''}
                                onChange={(e) => handleFilter('date_to', e.target.value)}
                                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                placeholder={t('Date To')}
                            />
                        </div>
                    )}
                </div>

                {/* Audit Log Table */}
                <div className="overflow-hidden rounded-xl border border-border/50 bg-card/60 shadow-xl backdrop-blur-md transition-all">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Event')}
                                    </th>
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('User')}
                                    </th>
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Model')}
                                    </th>
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Label')}
                                    </th>
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Changes')}
                                    </th>
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Context')}
                                    </th>
                                    <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Date')}
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('Details')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                            <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                            {t('No audit logs found')}
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => {
                                        const config = getEventConfig(log.event);
                                        const EventIcon = config.icon;
                                        return (
                                            <tr key={log.id} className="transition hover:bg-muted/30">
                                                <td className="px-4 py-3">
                                                    <div
                                                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.color}`}
                                                    >
                                                        <EventIcon className="h-3 w-3" />
                                                        {log.event}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10">
                                                            <User className="h-3.5 w-3.5 text-foreground" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-foreground">
                                                                {log.user_name || 'System'}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {log.user_type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <FileText className="h-3 w-3" />
                                                        {getModelBasename(log.auditable_type)}
                                                    </span>
                                                </td>
                                                <td className="max-w-[200px] truncate px-4 py-3 text-sm text-foreground">
                                                    {log.auditable_label || '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {log.changed_fields ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {log.changed_fields.slice(0, 4).map((f) => (
                                                                <span
                                                                    key={f}
                                                                    className="inline-flex items-center rounded-md border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold text-foreground/80"
                                                                >
                                                                    {f}
                                                                </span>
                                                            ))}
                                                            {log.changed_fields.length > 4 && (
                                                                <span className="rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                                                                    +{log.changed_fields.length - 4}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] italic text-muted-foreground/40">
                                                            {t('No data changes')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            {log.ip_address || '—'}
                                                        </span>
                                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/40">
                                                            {log.method} • {log.route_name || 'System'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(log.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <a
                                                        href={route('audit-logs.show', log.id)}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </a>
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
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
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
