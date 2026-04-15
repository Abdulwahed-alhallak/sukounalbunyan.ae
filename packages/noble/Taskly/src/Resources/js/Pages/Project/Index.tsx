import { useState, useMemo, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { usePageButtons } from '@/hooks/usePageButtons';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, Package, Eye, Copy, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { FilterButton } from '@/components/ui/filter-button';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, getImagePath, formatDate } from '@/utils/helpers';
import Create from './Create';
import EditItem from './Edit';
import DuplicateModal from './DuplicateModal';
import NoRecordsFound from '@/components/no-records-found';

interface ProjectItem {
    id: number;
    name: string;
    description?: string;
    budget?: number;
    start_date?: string;
    end_date?: string;
    status: 'Ongoing' | 'Onhold' | 'Finished';
    team_members?: Array<{
        id: number;
        name: string;
        avatar?: string;
    }>;
    task_count?: number;
    user_id: number;
    created_at: string;
}

interface ProjectIndexProps {
    items: {
        data: ProjectItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    users: Array<{
        id: number;
        name: string;
    }>;
    auth: {
        user: {
            permissions: string[];
        };
    };
    [key: string]: any;
}

export default function Index() {
    const { t } = useTranslation();
    const { items = [], users = [], auth } = usePage<ProjectIndexProps>().props;
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const [filters, setFilters] = useState({
        name: urlParams.get('name') || '',
        status: urlParams.get('status') || '',
        date: urlParams.get('date') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');
    const [showFilters, setShowFilters] = useState(false);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: string;
        data: ProjectItem | null;
    }>({
        isOpen: false,
        mode: '',
        data: null,
    });

    const [duplicateModalState, setDuplicateModalState] = useState<{
        isOpen: boolean;
        project: ProjectItem | null;
    }>({
        isOpen: false,
        project: null,
    });

    const pageButtons = usePageButtons('projectBtn', 'Test data');
    const googleDriveButtons = usePageButtons('googleDriveBtn', {
        module: 'Projects',
        settingKey: 'GoogleDrive Projects',
    });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Projects', settingKey: 'OneDrive Projects' });
    const dropboxBtn = usePageButtons('dropboxBtn', {
        module: 'Project Projects',
        settingKey: 'Dropbox Project Projects',
    });

    const renderTemplateButtons = useCallback((item: ProjectItem) => {
        const TemplateButtonComponent = () => {
            const buttons = usePageButtons('templateBtn', item, false);
            return buttons?.map((button) => <div key={button.id}>{button.component}</div>) || null;
        };
        return <TemplateButtonComponent />;
    }, []);

    const renderGridTemplateButtons = useCallback((item: ProjectItem) => {
        const buttons = usePageButtons('templateBtn', item, false);
        return buttons?.map((button) => <div key={button.id}>{button.component}</div>) || null;
    }, []);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'project.destroy',
        defaultMessage: t('Are you sure you want to delete this project item?'),
    });

    const handleFilter = () => {
        router.get(
            route('project.index'),
            { ...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(
            route('project.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFilters({ name: '', status: '', date: '' });
        router.get(route('project.index'), { per_page: perPage, view: viewMode });
    };

    const openModal = (mode: 'add' | 'edit', data: ProjectItem | null = null) => {
        setModalState({
            isOpen: true,
            mode,
            data,
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            mode: '',
            data: null,
        });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true,
        },
        {
            key: 'user',
            header: t('Users'),
            render: (_: any, item: ProjectItem) => {
                const teamMembers = item.team_members || [];
                const maxVisible = 4;

                if (teamMembers.length === 0) return '-';

                return (
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                            {teamMembers.slice(0, maxVisible)?.map((user) => (
                                <TooltipProvider key={user.id}>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-background">
                                                {user.avatar ? (
                                                    <img
                                                        src={getImagePath(user.avatar)}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={getImagePath('avatar.png')}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{user.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                            {teamMembers.length > maxVisible && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted">
                                    <span className="text-xs text-muted-foreground">
                                        +{teamMembers.length - maxVisible}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'budget',
            header: t('Budget'),
            render: (value: number) => (value ? formatCurrency(value) : '-'),
        },
        {
            key: 'start_date',
            header: t('Start Date'),
            render: (value: string) => (value ? formatDate(value) : '-'),
        },
        {
            key: 'end_date',
            header: t('End Date'),
            render: (value: string) => {
                if (!value) return '-';
                const isOverdue = new Date(value) < new Date();
                return <span className={isOverdue ? 'text-destructive' : ''}>{formatDate(value)}</span>;
            },
        },
        {
            key: 'status',
            header: t('Status'),
            render: (value: string) => {
                const statusColors = {
                    Ongoing: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                    Onhold: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                    Finished: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                };
                return (
                    <Badge
                        variant="outline"
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${statusColors[value as keyof typeof statusColors] || 'bg-muted text-foreground border-border'}`}
                    >
                        {t(value)}
                    </Badge>
                );
            },
        },
        ...(auth.user?.permissions?.some((p: string) =>
            ['view-project', 'edit-project', 'delete-project', 'duplicate-project'].includes(p)
        )
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, item: ProjectItem) => (
                          <div className="flex gap-1">
                              {renderTemplateButtons(item)}
                              {auth.user?.permissions?.includes('duplicate-project') && (
                                  <Tooltip key={`duplicate-${item.id}`} delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => setDuplicateModalState({ isOpen: true, project: item })}
                                              className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                          >
                                              <Copy className="h-4 w-4" />
                                          </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('Duplicate')}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              )}

                              {auth.user?.permissions?.includes('view-project') && (
                                  <Tooltip key={`view-${item.id}`} delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => router.get(route('project.show', item.id))}
                                              className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                          >
                                              <Eye className="h-4 w-4" />
                                          </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('View')}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              )}
                              {auth.user?.permissions?.includes('edit-project') && (
                                  <Tooltip key={`edit-${item.id}`} delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openModal('edit', item)}
                                              className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                          >
                                              <Edit className="h-4 w-4" />
                                          </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('Edit')}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              )}
                              {auth.user?.permissions?.includes('delete-project') && (
                                  <Tooltip key={`delete-${item.id}`} delayDuration={0}>
                                      <TooltipTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => openDeleteDialog(item.id)}
                                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                          >
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>{t('Delete')}</p>
                                      </TooltipContent>
                                  </Tooltip>
                              )}
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Project'), url: route('project.dashboard.index') }]}>
            <Head title={t('Projects')} />

            <div className="space-y-8 pb-12">
                {/* Mission Command: Strategic Fleet Header */}
                <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-foreground/5 p-8 backdrop-blur-3xl dark:border-white/10 dark:bg-card/5">
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute end-0 top-0 p-12 opacity-[0.03] transition-transform duration-1000 group-hover:scale-125">
                        <Package className="h-64 w-64 rotate-12 text-foreground" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
                        <div className="space-y-2 text-center lg:text-start">
                            <div className="mb-1 flex items-center justify-center gap-3 lg:justify-start">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/15 text-foreground shadow-inner">
                                    <Package className="h-5 w-5" />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground dark:text-foreground">
                                    {t('Projects')}
                                    <span className="italic text-foreground">.</span>
                                </h1>
                            </div>
                            <p className="max-w-md text-sm font-medium tracking-tight text-muted-foreground">
                                {t('Manage and track all your projects, budgets, and team assignments.')}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-muted p-1.5 shadow-inner dark:border-border dark:bg-foreground">
                                <ListGridToggle
                                    currentView={viewMode}
                                    routeName="project.index"
                                    filters={{ ...filters, per_page: perPage }}
                                    className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                />
                            </div>

                            {auth.user?.permissions?.includes('create-project') && (
                                <Button
                                    size="sm"
                                    onClick={() => openModal('add')}
                                    className="h-11 rounded-2xl border-t border-white/20 bg-foreground px-6 text-[10px] font-black uppercase tracking-widest text-background shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                                >
                                    <Plus className="me-2 h-4 w-4" />
                                    {t('New Project')}
                                </Button>
                            )}

                            <div className="flex gap-2">
                                {googleDriveButtons?.map((button) => (
                                    <div key={button.id}>{button.component}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-border/50 pt-6 dark:border-white/5 lg:justify-start">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--foreground),0.1)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                {items?.total || 0} {t('Total Projects')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                {users?.length || 0} {t('Team Members')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tactical Metrics Layer */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: t('All Projects'), value: items?.total || 0, icon: Package, color: 'blue' },
                        {
                            label: t('Ongoing'),
                            value: items?.data?.filter((p) => p.status === 'Ongoing').length || 0,
                            icon: Plus,
                            color: 'emerald',
                        },
                        {
                            label: t('On Hold'),
                            value: items?.data?.filter((p) => p.status === 'Onhold').length || 0,
                            icon: Trash2,
                            color: 'rose',
                        },
                        { label: t('Team Members'), value: users?.length || 0, icon: Users, color: 'amber' },
                    ]?.map((kpi, i) => (
                        <div
                            key={i}
                            className="premium-card group relative overflow-hidden border border-border p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl dark:border-white/5"
                        >
                            <div
                                className={`absolute -bottom-6 -end-6 opacity-[0.03] transition-opacity duration-700 group-hover:opacity-[0.08] text-${kpi.color}-500`}
                            >
                                <kpi.icon className="h-24 w-24" />
                            </div>
                            <div className="relative z-10 mb-4 flex items-center justify-between">
                                <div
                                    className={`h-10 w-10 rounded-xl bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-500 shadow-inner transition-transform duration-500 group-hover:scale-110`}
                                >
                                    <kpi.icon className="h-5 w-5" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                                    {kpi.label}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="tabular-nums origin-left text-3xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-105">
                                    {kpi.value}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl dark:border-white/5 dark:bg-foreground">
                    {/* Tactical Control Bar */}
                    <div className="bg-muted/50/50 border-b border-border p-6 backdrop-blur-3xl dark:border-white/5 dark:bg-foreground/30">
                        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                            <div className="w-full max-w-lg lg:flex-1">
                                <SearchInput
                                    value={filters.name}
                                    onChange={(value) => setFilters({ ...filters, name: value })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search projects...')}
                                    className="h-11 rounded-2xl border-border bg-card/50 text-xs font-medium focus:ring-foreground/20 dark:border-white/10 dark:bg-foreground/20"
                                />
                            </div>
                            <div className="flex w-full items-center gap-4 lg:w-auto">
                                <div className="flex h-11 items-center rounded-2xl border border-border bg-muted/50 px-3 shadow-inner dark:border-white/10 dark:bg-card/5">
                                    <PerPageSelector
                                        routeName="project.index"
                                        filters={{ ...filters, view: viewMode }}
                                    />
                                </div>
                                <div className="relative">
                                    <FilterButton
                                        showFilters={showFilters}
                                        onToggle={() => setShowFilters(!showFilters)}
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg transition-all duration-300 ${showFilters ? 'border-foreground bg-foreground text-background shadow-primary/20' : 'border-border bg-card/50 hover:border-foreground/50 dark:border-white/10 dark:bg-foreground/20'}`}
                                    />
                                    {(() => {
                                        const activeFilters = [filters.status, filters.date].filter(Boolean).length;
                                        return (
                                            activeFilters > 0 && (
                                                <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-destructive text-[9px] font-black text-background shadow-lg duration-300 animate-in zoom-in">
                                                    {activeFilters}
                                                </span>
                                            )
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Filter Drawer: Tactical Layout */}
                        {showFilters && (
                            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border pt-8 duration-500 animate-in slide-in-from-top-4 dark:border-white/5 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="ms-1 text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground">
                                        {t('Project Status')}
                                    </label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value) => setFilters({ ...filters, status: value })}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl border-border bg-card/50 px-4 text-xs font-bold transition-all hover:bg-muted dark:border-white/10 dark:bg-foreground/20 dark:hover:bg-foreground/50">
                                            <SelectValue placeholder={t('All Statuses')} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-2xl">
                                            <SelectItem
                                                value="Ongoing"
                                                className="text-xs font-bold uppercase tracking-wider"
                                            >
                                                {t('Ongoing')}
                                            </SelectItem>
                                            <SelectItem
                                                value="Onhold"
                                                className="text-xs font-bold uppercase tracking-wider"
                                            >
                                                {t('Onhold')}
                                            </SelectItem>
                                            <SelectItem
                                                value="Finished"
                                                className="text-xs font-bold uppercase tracking-wider"
                                            >
                                                {t('Finished')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="ms-1 text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground">
                                        {t('Date Filter')}
                                    </label>
                                    <DatePicker
                                        value={filters.date}
                                        onChange={(value) => setFilters({ ...filters, date: value })}
                                        placeholder={t('Select target date')}
                                        className="h-10 rounded-xl border-border bg-card/50 px-4 text-xs font-bold transition-all hover:bg-muted dark:border-white/10 dark:bg-foreground/20 dark:hover:bg-foreground/50"
                                    />
                                </div>
                                <div className="flex items-end gap-3 lg:col-span-2">
                                    <Button
                                        onClick={handleFilter}
                                        className="h-10 flex-1 rounded-xl bg-foreground px-6 text-[10px] font-black uppercase tracking-widest text-background shadow-lg shadow-primary/10 transition-all active:scale-95"
                                    >
                                        {t('Apply Filters')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:bg-destructive/5 hover:text-destructive"
                                    >
                                        {t('Clear Filters')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mission Data Projection */}
                    <div className="p-0">
                        {viewMode === 'list' ? (
                            <div className="w-full">
                                <DataTable
                                    data={items.data}
                                    columns={tableColumns}
                                    onSort={handleSort}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="border-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={Package}
                                            title={t('No projects found')}
                                            description={t('Your project list is currently empty.')}
                                            hasFilters={!!(filters.name || filters.status || filters.date)}
                                            onClearFilters={clearFilters}
                                            createPermission="create-project"
                                            onCreateClick={() => openModal('add')}
                                            createButtonText={t('Create Project')}
                                            className="h-80"
                                        />
                                    }
                                />
                            </div>
                        ) : (
                            <div className="p-8">
                                {items.data.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                        {items.data?.map((project, idx) => (
                                            <div
                                                key={project.id}
                                                className="premium-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:bg-foreground"
                                            >
                                                <div className="flex flex-1 flex-col p-6">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="truncate text-sm font-black uppercase tracking-tight transition-colors group-hover:text-foreground">
                                                                {project.name}
                                                            </h3>
                                                            <p className="mt-0.5 text-[10px] font-bold tracking-tighter text-muted-foreground">
                                                                ID: {project.id}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded-lg border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-sm"
                                                        >
                                                            {t(project.status)}
                                                        </Badge>
                                                    </div>

                                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                                {t('Budget')}
                                                            </p>
                                                            <p className="text-xs font-black tracking-tight">
                                                                {project.budget ? formatCurrency(project.budget) : '-'}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                                {t('Tasks')}
                                                            </p>
                                                            <p className="text-xs font-black tracking-tight">
                                                                {project.task_count || 0}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-6 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                                {t('Timeline')}
                                                            </p>
                                                            <p className="text-[10px] font-black tracking-tighter">
                                                                {project.start_date
                                                                    ? formatDate(project.start_date)
                                                                    : '-'}{' '}
                                                                —{' '}
                                                                {project.end_date ? formatDate(project.end_date) : '-'}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                                {t('Team')}
                                                            </p>
                                                            <div className="flex -space-x-2">
                                                                {project.team_members?.slice(0, 4)?.map((user) => (
                                                                    <TooltipProvider key={user.id}>
                                                                        <Tooltip delayDuration={0}>
                                                                            <TooltipTrigger>
                                                                                <div className="h-7 w-7 overflow-hidden rounded-xl border-2 border-background bg-muted shadow-sm transition-transform hover:z-10 hover:scale-110 dark:bg-card">
                                                                                    <img
                                                                                        src={
                                                                                            user.avatar
                                                                                                ? getImagePath(
                                                                                                      user.avatar
                                                                                                  )
                                                                                                : getImagePath(
                                                                                                      'avatar.png'
                                                                                                  )
                                                                                        }
                                                                                        alt={user.name}
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="text-[10px] font-black uppercase">
                                                                                {user.name}
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                ))}
                                                                {project.team_members &&
                                                                    project.team_members.length > 4 && (
                                                                        <div className="flex h-7 w-7 items-center justify-center rounded-xl border-2 border-background bg-foreground/10 shadow-sm">
                                                                            <span className="text-[10px] font-black text-foreground">
                                                                                +{project.team_members.length - 4}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-5 dark:border-white/5">
                                                        <div className="flex items-center gap-1">
                                                            {renderGridTemplateButtons(project)}
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                            {auth.user?.permissions?.includes('duplicate-project') && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setDuplicateModalState({
                                                                            isOpen: true,
                                                                            project,
                                                                        })
                                                                    }
                                                                    className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            {auth.user?.permissions?.includes('view-project') && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        router.get(route('project.show', project.id))
                                                                    }
                                                                    className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            {auth.user?.permissions?.includes('edit-project') && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openModal('edit', project)}
                                                                    className="hover:bg-muted/500/5 h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            {auth.user?.permissions?.includes('delete-project') && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openDeleteDialog(project.id)}
                                                                    className="h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <NoRecordsFound
                                        icon={Package}
                                        title={t('No Projects Found')}
                                        description={t('Your project list is currently empty. Create your first project to get started.')}
                                        hasFilters={!!(filters.name || filters.status || filters.date)}
                                        onClearFilters={clearFilters}
                                        createPermission="create-project"
                                        onCreateClick={() => openModal('add')}
                                        createButtonText={t('Create Project')}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="bg-muted/50/30 border-t border-border px-8 py-6 backdrop-blur-md dark:border-white/5 dark:bg-card/5">
                        <Pagination
                            data={items}
                            routeName="project.index"
                            filters={{ ...filters, per_page: perPage, view: viewMode }}
                        />
                    </div>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} users={users} />}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditItem item={modalState.data} users={users} onSuccess={closeModal} />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Project')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />

            <Dialog
                open={duplicateModalState.isOpen}
                onOpenChange={() => setDuplicateModalState({ isOpen: false, project: null })}
            >
                <DuplicateModal
                    isOpen={duplicateModalState.isOpen}
                    project={duplicateModalState.project}
                    onClose={() => setDuplicateModalState({ isOpen: false, project: null })}
                />
            </Dialog>
        </AuthenticatedLayout>
    );
}
