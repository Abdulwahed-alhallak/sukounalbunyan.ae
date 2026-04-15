import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    Bell,
    BellOff,
    Check,
    CheckCheck,
    Archive,
    Trash2,
    FileText,
    Users,
    Briefcase,
    DollarSign,
    AlertCircle,
    Shield,
    Inbox,
    Filter,
    ExternalLink,
} from 'lucide-react';

interface NotificationItem {
    id: number;
    type: string;
    category: string;
    title: string;
    message: string | null;
    icon: string | null;
    action_url: string | null;
    action_label: string | null;
    read_at: string | null;
    created_at: string;
    triggered_by?: { id: number; name: string } | null;
}

interface PaginatedData {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    notifications: PaginatedData;
    filters: Record<string, string>;
    types: string[];
    unreadCount: number;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    invoice: { icon: FileText, color: 'text-foreground', bg: 'bg-muted' },
    hrm: { icon: Users, color: 'text-foreground', bg: 'bg-muted' },
    crm: { icon: DollarSign, color: 'text-foreground', bg: 'bg-muted' },
    project: { icon: Briefcase, color: 'text-foreground', bg: 'bg-muted' },
    system: { icon: Shield, color: 'text-foreground', bg: 'bg-muted' },
    pos: { icon: DollarSign, color: 'text-foreground', bg: 'bg-muted' },
    support: { icon: AlertCircle, color: 'text-foreground', bg: 'bg-muted' },
};

const categoryColors: Record<string, string> = {
    info: 'border-s-foreground/30',
    success: 'border-s-foreground/20',
    warning: 'border-s-foreground/40',
    danger: 'border-s-foreground/50',
};

export default function NotificationsIndex({ notifications, filters, types, unreadCount }: Props) {
    const { t } = useTranslation();

    const handleFilter = (key: string, value: string) => {
        router.get(
            route('notifications.index'),
            {
                ...filters,
                [key]: value || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleMarkAsRead = (id: number) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const handleMarkAllRead = () => {
        router.post(route('notifications.mark-all-read'), {}, { preserveScroll: true });
    };

    const handleArchive = (id: number) => {
        router.post(route('notifications.archive', id), {}, { preserveScroll: true });
    };

    const handleArchiveAllRead = () => {
        router.post(route('notifications.archive-read'), {}, { preserveScroll: true });
    };

    const getTypeConfig = (type: string) => {
        return typeConfig[type] || { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted/500/10' };
    };

    const formatDate = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return t('Just now');
        if (minutes < 60) return `${minutes}m ${t('ago')}`;
        if (hours < 24) return `${hours}h ${t('ago')}`;
        if (days < 7) return `${days}d ${t('ago')}`;
        return new Date(date).toLocaleDateString('en-GB', { month: 'short', day: '2-digit' });
    };

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Notifications') }]} pageTitle={t('Notifications')}>
            <Head title={t('Notifications')} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-foreground/5">
                                <Bell className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                            </div>
                            {unreadCount > 0 && (
                                <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{t('Notification Center')}</h1>
                            <p className="text-sm text-muted-foreground">
                                {unreadCount > 0 ? `${unreadCount} ${t('unread notifications')}` : t('All caught up!')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                {t('Mark All Read')}
                            </button>
                        )}
                        <button
                            onClick={handleArchiveAllRead}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        >
                            <Archive className="h-3.5 w-3.5" />
                            {t('Archive Read')}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => handleFilter('filter', f === 'all' ? '' : f)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                (filters.filter || '') === (f === 'all' ? '' : f)
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                        >
                            {t(f.charAt(0).toUpperCase() + f.slice(1))}
                        </button>
                    ))}
                    <span className="mx-1 text-border">|</span>
                    <button
                        onClick={() => handleFilter('type', '')}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            !filters.type
                                ? 'bg-foreground text-background'
                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                    >
                        {t('All Types')}
                    </button>
                    {types.map((type) => {
                        const conf = getTypeConfig(type);
                        return (
                            <button
                                key={type}
                                onClick={() => handleFilter('type', type)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                    filters.type === type
                                        ? 'bg-foreground text-background'
                                        : `${conf.bg} ${conf.color} hover:opacity-80`
                                }`}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>

                {/* Notifications List */}
                <div className="space-y-2">
                    {notifications.data.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Inbox className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">{t('No notifications')}</h3>
                            <p className="text-sm text-muted-foreground">{t("You're all caught up!")}</p>
                        </div>
                    ) : (
                        notifications.data.map((notification) => {
                            const config = getTypeConfig(notification.type);
                            const IconComponent = config.icon;
                            const isUnread = !notification.read_at;

                            return (
                                <div
                                    key={notification.id}
                                    className={`group relative overflow-hidden rounded-xl border border-s-4 transition hover:shadow-md ${isUnread ? 'border-border bg-card' : 'border-border/50 bg-card/50'} ${categoryColors[notification.category] || 'border-s-border'} `}
                                >
                                    <div className="flex items-start gap-3 p-4">
                                        {/* Icon */}
                                        <div
                                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
                                        >
                                            <IconComponent className={`h-4 w-4 ${config.color}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p
                                                        className={`text-sm ${isUnread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    {notification.message && (
                                                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                            {notification.message}
                                                        </p>
                                                    )}
                                                </div>
                                                {isUnread && (
                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground" />
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center gap-3">
                                                <span className="text-[10px] text-muted-foreground">
                                                    {formatDate(notification.created_at)}
                                                </span>
                                                {notification.triggered_by && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {t('by')} {notification.triggered_by.name}
                                                    </span>
                                                )}
                                                <span
                                                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${config.bg} ${config.color}`}
                                                >
                                                    {notification.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                            {notification.action_url && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                                                    title={notification.action_label || t('View')}
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            {isUnread && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    title={t('Mark as read')}
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleArchive(notification.id)}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                                                title={t('Archive')}
                                            >
                                                <Archive className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                        <div className="text-sm text-muted-foreground">
                            {t('Showing')} {notifications.from}–{notifications.to} {t('of')} {notifications.total}
                        </div>
                        <div className="flex items-center gap-1">
                            {notifications.links.map((link, i) => (
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
        </AuthenticatedLayout>
    );
}
