import { useState, useCallback } from 'react';
import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import {
    Plus,
    Package,
    Edit,
    Trash2,
    Eye,
    Kanban,
    User,
    Target,
    Zap,
    Clock as LucideClock,
    ShieldAlert,
    Filter,
    Search,
    Grid,
    List as ListIcon,
    MoreVertical,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { FilterButton } from '@/components/ui/filter-button';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Create from './Create';
import NoRecordsFound from '@/components/no-records-found';
import { ProjectTask, ProjectTasksIndexProps, ProjectTaskFilters, ProjectTaskModalState } from './types';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import EditTask from './Edit';
import ViewTask from './View';
import { formatDate, getImagePath } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';
import { Badge } from '@/components/ui/badge';

export default function Index() {
    const { t } = useTranslation();
    const { tasks, project, milestones, teamMembers, taskStages, auth } = usePage<ProjectTasksIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<ProjectTaskFilters>({
        title: urlParams.get('title') || '',
        priority: urlParams.get('priority') || '',
        date_range: urlParams.get('date_range') || '',
        user_id: urlParams.get('user_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>((urlParams.get('view') as 'list' | 'grid') || 'list');

    const [modalState, setModalState] = useState<ProjectTaskModalState>({
        isOpen: false,
        mode: '',
        data: null,
    });

    const [deleteState, setDeleteState] = useState({ isOpen: false, taskId: null as number | null });
    const [showFilters, setShowFilters] = useState(false);

    const openDeleteDialog = (taskId: number) => {
        setDeleteState({ isOpen: true, taskId });
    };

    const closeDeleteDialog = () => {
        setDeleteState({ isOpen: false, taskId: null });
    };

    const confirmDelete = async () => {
        if (deleteState.taskId) {
            try {
                await axios.delete(route('project.tasks.destroy', deleteState.taskId));
                router.reload();
                closeDeleteDialog();
                toast.success(t('The task has been deleted successfully.'));
            } catch (error) {
                toast.error(t('Failed to delete task'));
            }
        }
    };

    const googleDriveButtons = usePageButtons('googleDriveBtn', { module: 'Task', settingKey: 'GoogleDrive Task' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Task', settingKey: 'OneDrive Task' });
    const dropboxBtn = usePageButtons('dropboxBtn', { module: 'Project Task', settingKey: 'Dropbox Project Task' });

    const handleFilter = () => {
        const params = {
            ...filters,
            per_page: perPage,
            sort: sortField,
            direction: sortDirection,
            view: viewMode,
            project_id: project?.id,
        };
        router.get(route('project.tasks.index'), params, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setFilters({ title: '', priority: '', date_range: '', user_id: '' });
        router.get(route('project.tasks.index'), { per_page: perPage, view: viewMode, project_id: project?.id });
    };

    const openModal = (mode: 'add' | 'edit' | 'view', data: ProjectTask | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'medium':
                return 'bg-muted-foreground/10 text-muted-foreground border-border/20';
            case 'low':
                return 'bg-foreground/10 text-foreground border-foreground/20';
            default:
                return 'bg-muted/500/10 text-muted-foreground border-border/20';
        }
    };

    const tableColumns = [
        {
            key: 'title',
            header: t('Mission Payload'),
            sortable: true,
            render: (value: string, task: ProjectTask) => (
                <div className="flex max-w-[200px] flex-col gap-0.5">
                    <span className="truncate text-[10px] font-black uppercase tracking-widest text-background/90">
                        {value}
                    </span>
                    <span className="truncate text-[8px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">
                        ID: {task.id}
                    </span>
                </div>
            ),
        },
        {
            key: 'milestone',
            header: t('Strategic Anchor'),
            render: (_: any, task: ProjectTask) => (
                <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-muted-foreground transition-transform group-hover:scale-110" />
                    <span className="max-w-[150px] truncate text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {task.milestone?.title || t('UNANCHORED')}
                    </span>
                </div>
            ),
        },
        {
            key: 'assignedUser',
            header: t('Field Operatives'),
            render: (_: any, task: ProjectTask) => {
                const assignedUsers = task.assignedUsers || [];
                return (
                    <div className="flex -space-x-1.5">
                        {assignedUsers.slice(0, 3)?.map((user) => (
                            <TooltipProvider key={user.id}>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <div className="h-7 w-7 overflow-hidden rounded-lg border-2 border-[#0f172a] shadow-lg transition-transform hover:z-10">
                                            {user.avatar ? (
                                                <img
                                                    src={getImagePath(user.avatar)}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-card">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="glass-effect border-white/10">
                                        <p className="text-[10px] font-black uppercase">{user.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'stage',
            header: t('Mission Status'),
            render: (_: any, task: ProjectTask) => {
                const stage = taskStages.find((s) => s.id === (task as any).stage_id);
                return (
                    <Badge className="border-white/10 bg-card/5 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                        {t(stage?.name || '-')}
                    </Badge>
                );
            },
        },
        {
            key: 'priority',
            header: t('Operational Priority'),
            sortable: true,
            render: (value: string) => (
                <Badge className={`border text-[8px] font-black uppercase tracking-widest ${getPriorityStyle(value)}`}>
                    {t(value)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: t('Tactical Hub'),
            render: (_: any, task: ProjectTask) => (
                <div className="flex justify-end gap-1">
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.get(route('project.tasks.view', task.id))}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-card/10 hover:text-background"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="glass-effect-dark border-white/10">
                                <p className="text-xs">{t('View Intel')}</p>
                            </TooltipContent>
                        </Tooltip>
                        {auth.user?.permissions?.includes('edit-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openModal('edit', task)}
                                        className="hover:bg-foreground/60/10 h-8 w-8 p-0 text-muted-foreground hover:text-muted-foreground"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="glass-effect-dark border-white/10">
                                    <p className="text-xs">{t('Modify Protocol')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('delete-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openDeleteDialog(task.id)}
                                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="glass-effect-dark border-white/10">
                                    <p className="text-xs">{t('Purge Vector')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={
                project
                    ? [
                          { label: t('Project'), url: route('project.index') },
                          { label: project.name, url: route('project.show', project.id) },
                          { label: t('Tasks') },
                      ]
                    : [{ label: t('Tasks') }]
            }
            pageTitle={t('Mission Deployment Grid')}
            pageActions={
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        {googleDriveButtons?.map((b) => (
                            <div key={b.id} className="opacity-70 transition-opacity hover:opacity-100">
                                {b.component}
                            </div>
                        ))}
                        {oneDriveButtons?.map((b) => (
                            <div key={b.id} className="opacity-70 transition-opacity hover:opacity-100">
                                {b.component}
                            </div>
                        ))}
                        {dropboxBtn?.map((b) => (
                            <div key={b.id} className="opacity-70 transition-opacity hover:opacity-100">
                                {b.component}
                            </div>
                        ))}
                    </div>
                    <div className="mx-2 h-8 w-px bg-card/10" />
                    {project && auth.user?.permissions?.includes('manage-project-task') && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="premium-button border-white/10 hover:bg-card/10"
                            onClick={() => router.get(route('project.tasks.kanban', project.id))}
                        >
                            <Kanban className="mr-2 h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {t('Mission Matrix')}
                            </span>
                        </Button>
                    )}
                </div>
            }
        >
            <Head title={t('Tasks')} />

            <div className="mt-6 space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-5">
                <Card className="glass-effect-dark overflow-hidden border-white/10 shadow-2xl">
                    <CardContent className="bg-card/[0.02] p-6">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div className="group relative max-w-md flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
                                <SearchInput
                                    value={filters.title}
                                    onChange={(v) => setFilters({ ...filters, title: v })}
                                    onSearch={handleFilter}
                                    placeholder={t('Search Sector...')}
                                    className="h-11 border-white/5 bg-foreground/50 pl-10 text-xs font-bold uppercase tracking-widest transition-all focus:border-foreground/50"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <ListGridToggle
                                    currentView={viewMode}
                                    routeName="project.tasks.index"
                                    filters={{ ...filters, per_page: perPage, project_id: project?.id }}
                                />
                                <PerPageSelector
                                    routeName="project.tasks.index"
                                    filters={{ ...filters, view: viewMode, project_id: project?.id }}
                                />
                                <Button
                                    variant={showFilters ? 'secondary' : 'outline'}
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`h-9 gap-2 px-4 transition-all ${showFilters ? 'border-foreground/30 bg-foreground/20 text-foreground' : 'border-white/10 hover:bg-card/5'}`}
                                >
                                    <Filter className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {t('Filters')}
                                    </span>
                                    {Object.values(filters).filter(Boolean).length > 0 && (
                                        <span className="ml-1 rounded-full bg-foreground px-1.5 py-0.5 text-[8px] text-background">
                                            {Object.values(filters).filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                                {auth.user?.permissions?.includes('create-project-task') && (
                                    <Button
                                        size="sm"
                                        onClick={() => openModal('add')}
                                        className="premium-button h-9 px-6"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {t('Deploy Task')}
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    {showFilters && (
                        <div className="overflow-hidden border-t border-white/5 bg-foreground/30 duration-300 animate-in slide-in-from-top">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            {t('Priority Tier')}
                                        </label>
                                        <Select
                                            value={filters.priority}
                                            onValueChange={(v) => setFilters({ ...filters, priority: v })}
                                        >
                                            <SelectTrigger className="glass-effect-dark h-10 border-white/5 text-xs font-bold uppercase tracking-widest">
                                                <SelectValue placeholder={t('Filter Tier')} />
                                            </SelectTrigger>
                                            <SelectContent className="glass-effect-dark border-white/10">
                                                <SelectItem value="High" className="text-destructive">
                                                    {t('High Velocity')}
                                                </SelectItem>
                                                <SelectItem value="Medium" className="text-muted-foreground">
                                                    {t('Standard Op')}
                                                </SelectItem>
                                                <SelectItem value="Low" className="text-foreground">
                                                    {t('Low Sustain')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            {t('Temporal Window')}
                                        </label>
                                        <DatePicker
                                            value={filters.date_range}
                                            onChange={(v) => setFilters({ ...filters, date_range: v })}
                                            placeholder={t('Select Window')}
                                            className="h-10 border-white/5 bg-card/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            {t('Assigned Operative')}
                                        </label>
                                        <Select
                                            value={filters.user_id}
                                            onValueChange={(v) => setFilters({ ...filters, user_id: v })}
                                        >
                                            <SelectTrigger className="glass-effect-dark h-10 border-white/5 text-xs font-bold uppercase tracking-widest">
                                                <SelectValue placeholder={t('Select Agent')} />
                                            </SelectTrigger>
                                            <SelectContent className="glass-effect-dark border-white/10">
                                                {teamMembers?.map((u) => (
                                                    <SelectItem
                                                        key={u.id}
                                                        value={u.id.toString()}
                                                        className="text-[10px] font-bold uppercase tracking-widest"
                                                    >
                                                        {u.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end gap-3 pb-0.5">
                                        <Button
                                            onClick={handleFilter}
                                            size="sm"
                                            className="h-10 flex-1 transform border border-foreground/20 bg-foreground/20 text-foreground transition-all hover:scale-105 hover:bg-foreground/30"
                                        >
                                            <Zap className="mr-2 h-3.5 w-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {t('Execute')}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={clearFilters}
                                            size="sm"
                                            className="h-10 text-muted-foreground transition-colors hover:text-background"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {t('Reset')}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    <CardContent className="p-0">
                        {viewMode === 'list' ? (
                            <div className="custom-scrollbar overflow-x-auto">
                                <DataTable
                                    data={tasks.data}
                                    columns={tableColumns}
                                    onSort={(f) => {
                                        const dir = sortField === f && sortDirection === 'asc' ? 'desc' : 'asc';
                                        setSortField(f);
                                        setSortDirection(dir);
                                        router.get(
                                            route('project.tasks.index'),
                                            {
                                                ...filters,
                                                per_page: perPage,
                                                sort: f,
                                                direction: dir,
                                                view: viewMode,
                                                project_id: project?.id,
                                            },
                                            { preserveState: true, replace: true }
                                        );
                                    }}
                                    sortKey={sortField}
                                    sortDirection={sortDirection as 'asc' | 'desc'}
                                    className="bg-transparent"
                                />
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {tasks.data?.map((task, idx) => (
                                        <div
                                            key={task.id}
                                            className="group duration-200 animate-in fade-in zoom-in-95"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <Card className="premium-card relative flex h-full flex-col overflow-hidden border-white/5 bg-foreground/40 shadow-xl backdrop-blur-3xl transition-all duration-500 hover:border-foreground/30 hover:bg-card/[0.05]">
                                                <div className="flex flex-1 flex-col p-5">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="rounded-lg border border-foreground/20 bg-foreground/10 p-2 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                                            <Target className="h-4 w-4 text-foreground" />
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-muted-foreground transition-colors hover:text-background"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="glass-effect-dark border-white/10"
                                                            >
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.get(route('project.tasks.view', task.id))
                                                                    }
                                                                    className="gap-2 text-[10px] font-black uppercase tracking-widest"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                    {t('View Intel')}
                                                                </DropdownMenuItem>
                                                                {auth.user?.permissions?.includes(
                                                                    'edit-project-task'
                                                                ) && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => openModal('edit', task)}
                                                                        className="gap-2 text-[10px] font-black uppercase tracking-widest"
                                                                    >
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                        {t('Modify Op')}
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {auth.user?.permissions?.includes(
                                                                    'delete-project-task'
                                                                ) && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => openDeleteDialog(task.id)}
                                                                        className="gap-2 text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10 hover:!text-destructive"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                        {t('Purge Vector')}
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <h3 className="mb-4 line-clamp-2 text-xs font-black uppercase leading-relaxed tracking-tighter tracking-widest text-background/90">
                                                        {task.title}
                                                    </h3>
                                                    <div className="mt-auto space-y-3 border-t border-white/5 pt-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">
                                                                {t('Priority Tier')}
                                                            </span>
                                                            <Badge
                                                                className={`border px-2 py-0 text-[8px] font-black uppercase tracking-widest ${getPriorityStyle(task.priority)}`}
                                                            >
                                                                {t(task.priority)}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">
                                                                {t('Assigned')}
                                                            </span>
                                                            <div className="flex -space-x-1.5">
                                                                {(task.assignedUsers || []).slice(0, 3)?.map((u) => (
                                                                    <div
                                                                        key={u.id}
                                                                        className="h-6 w-6 overflow-hidden rounded-lg border-2 border-[#0f172a] transition-transform group-hover:scale-110"
                                                                    >
                                                                        {u.avatar ? (
                                                                            <img
                                                                                src={getImagePath(u.avatar)}
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-full w-full items-center justify-center bg-card">
                                                                                <User className="h-2 w-2 text-muted-foreground" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 pt-1 opacity-50">
                                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">
                                                                {task.start_date ? formatDate(task.start_date) : '-'} —{' '}
                                                                {task.end_date ? formatDate(task.end_date) : '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {tasks.data.length === 0 && (
                            <NoRecordsFound
                                icon={Package}
                                title={t('Vector Field Clear')}
                                description={t(
                                    'Operational grid is currently empty. Initialize a new mission vector to begin.'
                                )}
                                hasFilters={!!(filters.title || filters.priority)}
                                onClearFilters={clearFilters}
                                createPermission="create-project-task"
                                onCreateClick={() => openModal('add')}
                                createButtonText={t('Initialize Vector')}
                                className="py-32"
                            />
                        )}
                    </CardContent>

                    <CardContent className="border-t border-white/5 bg-card/[0.01] p-4">
                        <Pagination
                            data={tasks || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }}
                            routeName="project.tasks.index"
                            filters={{ ...filters, per_page: perPage, view: viewMode, project_id: project?.id }}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create
                        onSuccess={closeModal}
                        project={project}
                        milestones={milestones}
                        teamMembers={teamMembers}
                    />
                )}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditTask
                        onSuccess={() => {
                            closeModal();
                            router.reload();
                        }}
                        task={modalState.data}
                        project={project}
                        milestones={milestones}
                        teamMembers={teamMembers}
                        taskStages={taskStages}
                    />
                )}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Purge Mission Vector')}
                message={t(
                    'Irrevocable action authorized: Are you sure you want to permanently erase this task record from the strategic grid?'
                )}
                confirmText={t('Purge')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}

const Clock = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
