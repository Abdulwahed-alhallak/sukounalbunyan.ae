import { useState, useMemo, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { usePageButtons } from '@/hooks/usePageButtons';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit, Trash2, Package, Eye, Copy, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
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
        date: urlParams.get('date') || ''
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(urlParams.get('view') as 'list' | 'grid' || 'list');
    const [showFilters, setShowFilters] = useState(false);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: string;
        data: ProjectItem | null;
    }>({
        isOpen: false,
        mode: '',
        data: null
    });

    const [duplicateModalState, setDuplicateModalState] = useState<{
        isOpen: boolean;
        project: ProjectItem | null;
    }>({
        isOpen: false,
        project: null
    });

    const pageButtons = usePageButtons('projectBtn','Test data');
    const googleDriveButtons = usePageButtons('googleDriveBtn', { module: 'Projects', settingKey: 'GoogleDrive Projects' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Projects', settingKey: 'OneDrive Projects' });
    const dropboxBtn = usePageButtons('dropboxBtn', { module: 'Project Projects', settingKey: 'Dropbox Project Projects' });

    const renderTemplateButtons = useCallback((item: ProjectItem) => {
        const TemplateButtonComponent = () => {
            const buttons = usePageButtons('templateBtn', item, false);
            return buttons?.map((button) => (
                <div key={button.id}>{button.component}</div>
            )) || null;
        };
        return <TemplateButtonComponent />;
    }, []);

    const renderGridTemplateButtons = useCallback((item: ProjectItem) => {
        const buttons = usePageButtons('templateBtn', item, false);
        return buttons?.map((button) => (
            <div key={button.id}>{button.component}</div>
        )) || null;
    }, []);

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'project.destroy',
        defaultMessage: t('Are you sure you want to delete this project item?')
    });

    const handleFilter = () => {
        router.get(route('project.index'), {...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode}, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('project.index'), {...filters, per_page: perPage, sort: field, direction, view: viewMode}, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilters({ name: '', status: '', date: '' });
        router.get(route('project.index'), {per_page: perPage, view: viewMode});
    };

    const openModal = (mode: 'add' | 'edit', data: ProjectItem | null = null) => {
        setModalState({
            isOpen: true,
            mode,
            data
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            mode: '',
            data: null
        });
    };

    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true
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
                                            <div className="h-8 w-8 rounded-full border-2 border-background overflow-hidden">
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
                                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">+{teamMembers.length - maxVisible}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'budget',
            header: t('Budget'),
            render: (value: number) => value ? formatCurrency(value) : '-'
        },
        {
            key: 'start_date',
            header: t('Start Date'),
            render: (value: string) => value ? formatDate(value) : '-'
        },
        {
            key: 'end_date',
            header: t('End Date'),
            render: (value: string) => {
                if (!value) return '-';
                const isOverdue = new Date(value) < new Date();
                return (
                    <span className={isOverdue ? 'text-destructive' : ''}>
                        {formatDate(value)}
                    </span>
                );
            }
        },
        {
            key: 'status',
            header: t('Status'),
            render: (value: string) => {
                const statusColors = {
                    'Ongoing': 'bg-muted text-foreground',
                    'Onhold': 'bg-muted text-foreground',
                    'Finished': 'bg-muted text-foreground'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-sm ${statusColors[value as keyof typeof statusColors]}`}>
                        {t(value)}
                    </span>
                );
            }
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-project', 'edit-project', 'delete-project', 'duplicate-project'].includes(p)) ? [{
            key: 'actions',
            header: t('Actions'),
            render: (_: any, item: ProjectItem) => (
                <div className="flex gap-1">
                    {renderTemplateButtons(item)}
                    {auth.user?.permissions?.includes('duplicate-project') && (
                        <Tooltip key={`duplicate-${item.id}`} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setDuplicateModalState({ isOpen: true, project: item })} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
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
                                <Button variant="ghost" size="sm" onClick={() => router.get(route('project.show', item.id))} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
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
                                <Button variant="ghost" size="sm" onClick={() => openModal('edit', item)} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
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
            )
        }] : [])
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Project'), url: route('project.dashboard.index') },
            ]}
        >
            <Head title={t('Projects')} />

        <div className="space-y-8 pb-12">
            {/* Mission Command: Strategic Fleet Header */}
            <div className="relative overflow-hidden p-8 rounded-3xl bg-foreground/5 dark:bg-card/5 border border-border/50 dark:border-white/10 backdrop-blur-3xl group">
                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                    <Package className="h-64 w-64 text-foreground rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-foreground/15 flex items-center justify-center text-foreground shadow-inner">
                                <Package className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase text-foreground dark:text-foreground">
                                {t('Fleet Command')}
                                <span className="text-foreground italic">.</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium tracking-tight max-w-md">
                            {t('Strategic oversight of active mission protocols and resource allocation matrices.')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted dark:bg-foreground border border-border dark:border-border shadow-inner">
                             <ListGridToggle
                                currentView={viewMode}
                                routeName="project.index"
                                filters={{...filters, per_page: perPage}}
                                className="h-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            />
                        </div>

                        {auth.user?.permissions?.includes('create-project') && (
                            <Button 
                                size="sm" 
                                onClick={() => openModal('add')}
                                className="h-11 rounded-2xl bg-foreground text-background hover:opacity-90 font-black uppercase tracking-widest text-[10px] px-6 shadow-xl shadow-primary/20 border-t border-white/20 transition-all active:scale-95"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('Initialize Vector')}
                            </Button>
                        )}
                        
                        <div className="flex gap-2">
                             {googleDriveButtons?.map((button) => (
                                <div key={button.id}>{button.component}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-border/50 dark:border-white/5 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--foreground),0.1)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{items?.total || 0} {t('Active Signatures')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{users?.length || 0} {t('Deployed Personnel')}</span>
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Layer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t('Total Payload'), value: items?.total || 0, icon: Package, color: 'blue' },
                    { label: t('Operational'), value: items?.data?.filter(p => p.status === 'Ongoing').length || 0, icon: Plus, color: 'emerald' },
                    { label: t('Tactical Hold'), value: items?.data?.filter(p => p.status === 'Onhold').length || 0, icon: Trash2, color: 'rose' },
                    { label: t('Force Strength'), value: users?.length || 0, icon: Users, color: 'amber' }
                ]?.map((kpi, i) => (
                    <div key={i} className="premium-card p-6 group transition-all duration-500 overflow-hidden relative border border-border dark:border-white/5 shadow-sm hover:shadow-xl hover:border-foreground/20 hover:-translate-y-1">
                        <div className={`absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 text-${kpi.color}-500`}>
                            <kpi.icon className="h-24 w-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`h-10 w-10 rounded-xl bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-500 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <kpi.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">{kpi.label}</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black tracking-tighter group-hover:scale-105 transition-transform origin-left duration-500">{kpi.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="border border-border dark:border-white/5 bg-card dark:bg-foreground overflow-hidden rounded-3xl shadow-xl">
                {/* Tactical Control Bar */}
                <div className="p-6 bg-muted/50/50 dark:bg-foreground/30 backdrop-blur-3xl border-b border-border dark:border-white/5">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="w-full lg:flex-1 max-w-lg">
                            <SearchInput
                                value={filters.name}
                                onChange={(value) => setFilters({...filters, name: value})}
                                onSearch={handleFilter}
                                placeholder={t('Search mission database...')}
                                className="bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 h-11 rounded-2xl text-xs font-medium focus:ring-foreground/20"
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="h-11 px-3 rounded-2xl bg-muted/50 dark:bg-card/5 border border-border dark:border-white/10 flex items-center shadow-inner">
                                <PerPageSelector
                                    routeName="project.index"
                                    filters={{...filters, view: viewMode}}
                                />
                            </div>
                            <div className="relative">
                                <FilterButton
                                    showFilters={showFilters}
                                    onToggle={() => setShowFilters(!showFilters)}
                                    className={`h-11 w-11 rounded-2xl border transition-all duration-300 flex items-center justify-center shadow-lg ${showFilters ? 'bg-foreground text-background border-foreground shadow-primary/20' : 'bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 hover:border-foreground/50'}`}
                                />
                                {(() => {
                                    const activeFilters = [filters.status, filters.date].filter(Boolean).length;
                                    return activeFilters > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-destructive text-background text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in duration-300">
                                            {activeFilters}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Filter Drawer: Tactical Layout */}
                    {showFilters && (
                        <div className="mt-8 pt-8 border-t border-border dark:border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[.2em] ml-1">{t('Sector Status')}</label>
                                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                                    <SelectTrigger className="bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 h-10 px-4 rounded-xl text-xs font-bold transition-all hover:bg-muted dark:hover:bg-foreground/50">
                                        <SelectValue placeholder={t('All Statuses')} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl shadow-2xl">
                                        <SelectItem value="Ongoing" className="text-xs font-bold uppercase tracking-wider">{t('Ongoing')}</SelectItem>
                                        <SelectItem value="Onhold" className="text-xs font-bold uppercase tracking-wider">{t('Onhold')}</SelectItem>
                                        <SelectItem value="Finished" className="text-xs font-bold uppercase tracking-wider">{t('Finished')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[.2em] ml-1">{t('Mission Calendar')}</label>
                                <DatePicker
                                    value={filters.date}
                                    onChange={(value) => setFilters({...filters, date: value})}
                                    placeholder={t('Select target date')}
                                    className="bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 h-10 px-4 rounded-xl text-xs font-bold transition-all hover:bg-muted dark:hover:bg-foreground/50"
                                />
                            </div>
                            <div className="lg:col-span-2 flex items-end gap-3">
                                <Button onClick={handleFilter} className="flex-1 h-10 px-6 rounded-xl bg-foreground text-background font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 transition-all active:scale-95">{t('Calibrate Signals')}</Button>
                                <Button variant="ghost" onClick={clearFilters} className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">{t('Flush Filters')}</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                    {items.data?.map((project, idx) => (
                                        <div 
                                            key={project.id} 
                                            className="premium-card bg-card dark:bg-foreground border border-border dark:border-white/5 rounded-3xl overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                                        >
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-black tracking-tight text-sm uppercase truncate group-hover:text-foreground transition-colors">{project.name}</h3>
                                                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5 tracking-tighter">ID: {project.id}</p>
                                                    </div>
                                                    <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-none shadow-sm">
                                                        {t(project.status)}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('Budget')}</p>
                                                        <p className="font-black text-xs tracking-tight">{project.budget ? formatCurrency(project.budget) : '-'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('Tasks')}</p>
                                                        <p className="font-black text-xs tracking-tight">{project.task_count || 0}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-6">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('Timeline')}</p>
                                                        <p className="text-[10px] font-black tracking-tighter">
                                                            {project.start_date ? formatDate(project.start_date) : '-'} — {project.end_date ? formatDate(project.end_date) : '-'}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t('Team')}</p>
                                                        <div className="flex -space-x-2">
                                                            {project.team_members?.slice(0, 4)?.map((user) => (
                                                                <TooltipProvider key={user.id}>
                                                                    <Tooltip delayDuration={0}>
                                                                        <TooltipTrigger>
                                                                            <div className="h-7 w-7 rounded-xl border-2 border-background overflow-hidden bg-muted dark:bg-card shadow-sm transition-transform hover:scale-110 hover:z-10">
                                                                                <img
                                                                                    src={user.avatar ? getImagePath(user.avatar) : getImagePath('avatar.png')}
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
                                                            {project.team_members && project.team_members.length > 4 && (
                                                                <div className="h-7 w-7 rounded-xl bg-foreground/10 border-2 border-background flex items-center justify-center shadow-sm">
                                                                    <span className="text-[10px] font-black text-foreground">+{project.team_members.length - 4}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-5 border-t border-border dark:border-white/5">
                                                    <div className="flex items-center gap-1">
                                                        {renderGridTemplateButtons(project)}
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {auth.user?.permissions?.includes('duplicate-project') && (
                                                            <Button variant="ghost" size="sm" onClick={() => setDuplicateModalState({ isOpen: true, project })} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg">
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {auth.user?.permissions?.includes('view-project') && (
                                                            <Button variant="ghost" size="sm" onClick={() => router.get(route('project.show', project.id))} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {auth.user?.permissions?.includes('edit-project') && (
                                                            <Button variant="ghost" size="sm" onClick={() => openModal('edit', project)} className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/500/5 rounded-lg">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {auth.user?.permissions?.includes('delete-project') && (
                                                            <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(project.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg">
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
                                    title={t('No Project Vectors Found')}
                                    description={t('System clear. No active mission signatures detected.')}
                                    hasFilters={!!(filters.name || filters.status || filters.date)}
                                    onClearFilters={clearFilters}
                                    createPermission="create-project"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Authorize New Mission')}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 border-t border-border dark:border-white/5 bg-muted/50/30 dark:bg-card/5 backdrop-blur-md">
                    <Pagination
                        data={items}
                        routeName="project.index"
                        filters={{...filters, per_page: perPage, view: viewMode}}
                    />
                </div>
            </Card>
        </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create onSuccess={closeModal} users={users} />
                )}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditItem
                        item={modalState.data}
                        users={users}
                        onSuccess={closeModal}
                    />
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

            <Dialog open={duplicateModalState.isOpen} onOpenChange={() => setDuplicateModalState({ isOpen: false, project: null })}>
                <DuplicateModal
                    isOpen={duplicateModalState.isOpen}
                    project={duplicateModalState.project}
                    onClose={() => setDuplicateModalState({ isOpen: false, project: null })}
                />
            </Dialog>
        </AuthenticatedLayout>
    );
}
