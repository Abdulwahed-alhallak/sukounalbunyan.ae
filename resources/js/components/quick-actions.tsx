import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Search, Command, Home, Users, FileText, BarChart3, Bell,
    Settings, Shield, CreditCard, Briefcase, DollarSign,
    Package, Target, CalendarCheck, HelpCircle,
    ArrowRight, CornerDownLeft, Zap,
} from 'lucide-react';
import { PageProps } from '@/types';

interface QuickAction {
    id: string;
    title: string;
    section: string;
    icon: any;
    action: () => void;
    keywords?: string[];
}

export function QuickActions() {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props as any;
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const userType = auth?.user?.type || 'staff';

    // ── Build actions list ──
    const allActions = useMemo<QuickAction[]>(() => {
        const actions: QuickAction[] = [];

        // ── Navigation ──
        actions.push(
            { id: 'dashboard', title: t('Dashboard'), section: t('Navigation'), icon: Home, action: () => router.visit(route('dashboard')), keywords: ['home', 'main', 'لوحة'] },
            { id: 'notifications', title: t('Notifications'), section: t('Navigation'), icon: Bell, action: () => router.visit(route('notifications.index')), keywords: ['alerts', 'إشعارات'] },
            { id: 'reports', title: t('Report Center'), section: t('Navigation'), icon: BarChart3, action: () => router.visit(route('reports.index')), keywords: ['analytics', 'تقارير'] },
            { id: 'workflows', title: t('Workflow Automation'), section: t('Navigation'), icon: Zap, action: () => router.visit(route('workflows.index')), keywords: ['automation', 'أتمتة'] },
            { id: 'audit-logs', title: t('Audit Logs'), section: t('Navigation'), icon: Shield, action: () => router.visit(route('audit-logs.index')), keywords: ['security', 'compliance', 'تدقيق'] },
            { id: 'profile', title: t('My Profile'), section: t('Navigation'), icon: Settings, action: () => router.visit(route('profile.edit')), keywords: ['settings', 'account', 'الملف'] },
        );

        // ── SuperAdmin actions ──
        if (userType === 'superadmin') {
            actions.push(
                { id: 'users', title: t('Manage Users'), section: t('Administration'), icon: Users, action: () => router.visit(route('users.index')), keywords: ['members', 'مستخدمين'] },
                { id: 'plans', title: t('Manage Plans'), section: t('Administration'), icon: Package, action: () => router.visit(route('plan.index')), keywords: ['subscriptions', 'pricing', 'خطط'] },
                { id: 'audit-logs-admin', title: t('Audit Logs'), section: t('Security'), icon: Shield, action: () => router.visit(route('audit-logs.index')), keywords: ['security', 'compliance', 'تدقيق'] },
            );
        }

        // ── Company / Staff actions ──
        if (userType === 'company' || userType === 'staff') {
            try {
                actions.push(
                    { id: 'invoices', title: t('Sales Invoices'), section: t('Finance'), icon: FileText, action: () => router.visit(route('account.sales-invoices.index')), keywords: ['sales', 'billing', 'فواتير'] },
                    { id: 'purchases', title: t('Purchase Invoices'), section: t('Finance'), icon: CreditCard, action: () => router.visit(route('account.purchase-invoices.index')), keywords: ['buying', 'vendor', 'مشتريات'] },
                );
            } catch (_) { /* route may not exist */ }

            try {
                actions.push(
                    { id: 'projects', title: t('Projects'), section: t('Project Management'), icon: Briefcase, action: () => router.visit(route('project.index')), keywords: ['tasks', 'مشاريع'] },
                );
            } catch (_) { /* route may not exist */ }

            try {
                actions.push(
                    { id: 'employees', title: t('Employees'), section: t('HRM'), icon: Users, action: () => router.visit(route('hrm.employees.index')), keywords: ['staff', 'team', 'موظفين'] },
                    { id: 'attendance', title: t('Attendance'), section: t('HRM'), icon: CalendarCheck, action: () => router.visit(route('hrm.attendance.index')), keywords: ['presence', 'حضور'] },
                );
            } catch (_) { /* route may not exist */ }

            try {
                actions.push(
                    { id: 'leads', title: t('CRM Leads'), section: t('CRM'), icon: Target, action: () => router.visit(route('lead.index')), keywords: ['sales', 'pipeline', 'عملاء محتملين'] },
                    { id: 'deals', title: t('Deals'), section: t('CRM'), icon: DollarSign, action: () => router.visit(route('deal.index')), keywords: ['opportunities', 'صفقات'] },
                );
            } catch (_) { /* route may not exist */ }

            try {
                actions.push(
                    { id: 'support', title: t('Support Tickets'), section: t('Support'), icon: HelpCircle, action: () => router.visit(route('support-ticket.index')), keywords: ['help', 'tickets', 'دعم'] },
                );
            } catch (_) { /* route may not exist */ }
        }

        // ── Reports shortcuts ──
        actions.push(
            { id: 'rpt-profit-loss', title: t('Profit & Loss Report'), section: t('Reports'), icon: BarChart3, action: () => router.visit(route('reports.generate', 'profit_loss')), keywords: ['P&L', 'financial', 'أرباح'] },
            { id: 'rpt-sales', title: t('Sales Summary Report'), section: t('Reports'), icon: DollarSign, action: () => router.visit(route('reports.generate', 'sales_summary')), keywords: ['revenue', 'مبيعات'] },
        );

        return actions;
    }, [userType, t]);

    // ── Filter by query ──
    const filteredActions = useMemo(() => {
        if (!query) return allActions;
        const q = query.toLowerCase();
        return allActions.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.section.toLowerCase().includes(q) ||
            a.keywords?.some(k => k.toLowerCase().includes(q))
        );
    }, [allActions, query]);

    // ── Group by section ──
    const groupedActions = useMemo(() => {
        const groups: Record<string, QuickAction[]> = {};
        filteredActions.forEach(a => {
            if (!groups[a.section]) groups[a.section] = [];
            groups[a.section].push(a);
        });
        return groups;
    }, [filteredActions]);

    // ── Keyboard shortcut (Ctrl+K / Cmd+K) ──
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // ── Focus input when opened ──
    useEffect(() => {
        if (open) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // ── Keyboard navigation ──
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
            e.preventDefault();
            filteredActions[selectedIndex].action();
            setOpen(false);
        }
    }, [filteredActions, selectedIndex]);

    // ── Scroll to selected ──
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    if (!open) return null;

    let flatIndex = 0;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            {/* Dialog */}
            <div
                className="relative w-full max-w-[520px] overflow-hidden rounded-lg border border-border bg-card shadow-2xl animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder={t('Search actions, pages, reports...')}
                        className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline">ESC</kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-[320px] overflow-y-auto p-1.5" role="listbox">
                    {filteredActions.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-center">
                            <Search className="mb-3 h-6 w-6 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">{t('No results found')}</p>
                        </div>
                    ) : (
                        Object.entries(groupedActions).map(([section, actions]) => (
                            <div key={section} className="mb-1">
                                <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                                    {section}
                                </div>
                                {actions.map(action => {
                                    const idx = flatIndex++;
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            data-index={idx}
                                            role="option"
                                            aria-selected={idx === selectedIndex}
                                            onClick={() => { action.action(); setOpen(false); }}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                                                idx === selectedIndex
                                                    ? 'bg-muted text-foreground'
                                                    : 'text-muted-foreground hover:bg-muted/50'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                                            <span className="flex-1 truncate">{action.title}</span>
                                            {idx === selectedIndex && (
                                                <CornerDownLeft className="h-3 w-3 shrink-0 text-muted-foreground" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 font-mono">↑↓</kbd> {t('navigate')}</span>
                        <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 font-mono">↵</kbd> {t('select')}</span>
                        <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1 font-mono">esc</kbd> {t('close')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Command className="h-3 w-3" />
                        <span>{t('Quick Actions')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
