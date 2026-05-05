import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/helpers';
import {
    FolderOpen, Plus, Search, Building2,
    FileText, LayoutGrid, List,
} from 'lucide-react';

// ── Status badge ───────────────────────────────────────
function statusBadge(status: string) {
    const map: Record<string, string> = {
        active:    'bg-emerald-100 text-emerald-700 border-emerald-200',
        completed: 'bg-blue-100 text-blue-700 border-blue-200',
        on_hold:   'bg-amber-100 text-amber-700 border-amber-200',
        cancelled: 'bg-red-100 text-red-600 border-red-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

const STATUS_LABELS: Record<string, string> = {
    active: 'Active', completed: 'Completed', on_hold: 'On Hold', cancelled: 'Cancelled',
};

// ── Project Card ───────────────────────────────────────
function ProjectCard({ project }: { project: any }) {
    const { t } = useTranslation();
    const totalInvoiced  = project.contracts?.reduce((s: number, c: any) => s + parseFloat(c.total_invoiced || 0), 0) ?? 0;
    const totalPaid      = project.contracts?.reduce((s: number, c: any) => s + parseFloat(c.paid_amount    || 0), 0) ?? 0;
    const balanceDue     = Math.max(0, totalInvoiced - totalPaid);
    const activeCount    = project.active_contracts_count ?? 0;

    return (
        <Link href={route('rental-projects.show', project.id)}>
            <div className="group relative bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                {/* Color accent bar */}
                <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: project.color ?? '#6366F1' }}
                />

                <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-sm"
                                style={{ backgroundColor: project.color ?? '#6366F1' }}
                            >
                                {project.name?.[0]?.toUpperCase() ?? 'P'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{project.name}</p>
                                {project.code && (
                                    <p className="text-xs text-muted-foreground">{project.code}</p>
                                )}
                            </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusBadge(project.status)}`}>
                            {STATUS_LABELS[project.status] ?? project.status}
                        </span>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: project.customer?.color ?? '#94a3b8' }}
                        >
                            {project.customer?.name?.[0]?.toUpperCase() ?? 'C'}
                        </div>
                        <span className="text-sm text-muted-foreground truncate">
                            {project.customer?.name ?? '—'}
                        </span>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">{t('Contracts')}</p>
                            <p className="font-semibold text-sm">{project.contracts_count ?? 0}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">{t('Active')}</p>
                            <p className="font-semibold text-sm text-emerald-600">{activeCount}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">{t('Balance')}</p>
                            <p className={`font-semibold text-sm ${balanceDue > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                                {formatCurrency(balanceDue)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ── Main Page ──────────────────────────────────────────
export default function Index() {
    const { t } = useTranslation();
    const { projects, customers, filters } = usePage<any>().props;

    const [search, setSearch]       = useState(filters?.search ?? '');
    const [customerId, setCustomerId] = useState(filters?.customer_id ?? 'all');
    const [status, setStatus]       = useState(filters?.status ?? 'all');
    const [view, setView]           = useState<'grid' | 'list'>('grid');

    const applyFilters = () => {
        router.get(route('rental-projects.index'), {
            search:      search || undefined,
            customer_id: customerId !== 'all' ? customerId : undefined,
            status:      status    !== 'all' ? status    : undefined,
        }, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setSearch(''); setCustomerId('all'); setStatus('all');
        router.get(route('rental-projects.index'));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Rental') }, { label: t('Projects') }]}
            pageTitle={t('Rental Projects')}
        >
            <Head title={t('Rental Projects')} />

            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex flex-wrap gap-2 flex-1">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 w-48"
                            placeholder={t('Search projects...')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        />
                    </div>
                    {/* Customer filter */}
                    <Select value={customerId} onValueChange={v => setCustomerId(v)}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder={t('All Clients')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All Clients')}</SelectItem>
                            {customers.map((c: any) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="h-3 w-3 rounded-full inline-block shrink-0"
                                            style={{ backgroundColor: c.color ?? '#94a3b8' }}
                                        />
                                        {c.name}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Status filter */}
                    <Select value={status} onValueChange={v => setStatus(v)}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder={t('All Status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All Status')}</SelectItem>
                            <SelectItem value="active">{t('Active')}</SelectItem>
                            <SelectItem value="completed">{t('Completed')}</SelectItem>
                            <SelectItem value="on_hold">{t('On Hold')}</SelectItem>
                            <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" onClick={applyFilters}>{t('Filter')}</Button>
                    {(search || customerId || status) && (
                        <Button size="sm" variant="ghost" onClick={clearFilters}>{t('Clear')}</Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <Button
                        size="icon" variant={view === 'grid' ? 'default' : 'outline'}
                        onClick={() => setView('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon" variant={view === 'list' ? 'default' : 'outline'}
                        onClick={() => setView('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button asChild className="gap-2">
                        <Link href={route('rental-projects.create')}>
                            <Plus className="h-4 w-4" />
                            {t('New Project')}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* ── Projects Grid/List ── */}
            {projects.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <FolderOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{t('No projects yet')}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        {t('Create a project to group rental contracts under a client site.')}
                    </p>
                    <Button asChild>
                        <Link href={route('rental-projects.create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t('Create First Project')}
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className={
                    view === 'grid'
                        ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'flex flex-col gap-3'
                }>
                    {projects.data.map((project: any) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {projects.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {projects.links.map((link: any, i: number) => (
                        <Button
                            key={i}
                            size="sm"
                            variant={link.active ? 'default' : 'outline'}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
