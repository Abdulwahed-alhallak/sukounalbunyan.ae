import { useState, useCallback } from 'react';
import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Package, Edit, Trash2, Eye, Kanban, User, Target, Zap, Clock as LucideClock, ShieldAlert, Filter, Search, Grid, List as ListIcon, MoreVertical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { FilterButton } from '@/components/ui/filter-button';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
        user_id: urlParams.get('user_id') || ''
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(urlParams.get('view') as 'list' | 'grid' || 'list');

    const [modalState, setModalState] = useState<ProjectTaskModalState>({
        isOpen: false,
        mode: '',
        data: null
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
        const params = {...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode, project_id: project?.id};
        router.get(route('project.tasks.index'), params, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setFilters({ title: '', priority: '', date_range: '', user_id: '' });
        router.get(route('project.tasks.index'), {per_page: perPage, view: viewMode, project_id: project?.id});
    };

    const openModal = (mode: 'add' | 'edit' | 'view', data: ProjectTask | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'medium': return 'bg-muted-foreground/10 text-muted-foreground border-border/20';
            case 'low': return 'bg-foreground/10 text-foreground border-foreground/20';
            default: return 'bg-muted/500/10 text-muted-foreground border-border/20';
        }
    };

    const tableColumns = [
        {
            key: 'title',
            header: t('Mission Payload'),
            sortable: true,
            render: (value: string, task: ProjectTask) => (
                <div className="flex flex-col gap-0.5 max-w-[200px]">
                    <span className="font-black text-[10px] uppercase tracking-widest text-background/90 truncate">{value}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter truncate opacity-60">ID: {task.id}</span>
                </div>
            )
        },
        {
            key: 'milestone',
            header: t('Strategic Anchor'),
            render: (_: any, task: ProjectTask) => (
                <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-muted-foreground group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[150px]">
                        {task.milestone?.title || t('UNANCHORED')}
                    </span>
                </div>
            )
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
                                        <div className="h-7 w-7 rounded-lg border-2 border-[#0f172a] overflow-hidden shadow-lg hover:z-10 transition-transform">
                                            {user.avatar ? <img src={getImagePath(user.avatar)} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-card flex items-center justify-center"><User className="h-3 w-3 text-muted-foreground" /></div>}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="glass-effect border-white/10"><p className="text-[10px] font-black uppercase">{user.name}</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'stage',
            header: t('Mission Status'),
            render: (_: any, task: ProjectTask) => {
                const stage = taskStages.find(s => s.id === (task as any).stage_id);
                return (
                    <Badge className="text-[8px] font-black uppercase tracking-widest bg-card/5 border-white/10 text-muted-foreground">
                        {t(stage?.name || '-')}
                    </Badge>
                );
            }
        },
        {
            key: 'priority',
            header: t('Operational Priority'),
            sortable: true,
            render: (value: string) => (
                <Badge className={`text-[8px] font-black uppercase border tracking-widest ${getPriorityStyle(value)}`}>
                    {t(value)}
                </Badge>
            )
        },
        {
            key: 'actions',
            header: t('Tactical Hub'),
            render: (_: any, task: ProjectTask) => (
                <div className="flex gap-1 justify-end">
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => router.get(route('project.tasks.view', task.id))} className="h-8 w-8 p-0 text-muted-foreground hover:text-background hover:bg-card/10">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="glass-effect-dark border-white/10"><p className="text-xs">{t('View Intel')}</p></TooltipContent>
                        </Tooltip>
                        {auth.user?.permissions?.includes('edit-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => openModal('edit', task)} className="h-8 w-8 p-0 text-muted-foreground hover:text-muted-foreground hover:bg-foreground/60/10">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="glass-effect-dark border-white/10"><p className="text-xs">{t('Modify Protocol')}</p></TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('delete-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(task.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="glass-effect-dark border-white/10"><p className="text-xs">{t('Purge Vector')}</p></TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            )
        }
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={project ? [{ label: t('Project'), url: route('project.index') }, { label: project.name, url: route('project.show', project.id) }, { label: t('Tasks') }] : [{ label: t('Tasks') }]}
            pageTitle={t('Mission Deployment Grid')}
            pageActions={
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        {googleDriveButtons?.map(b => <div key={b.id} className="opacity-70 hover:opacity-100 transition-opacity">{b.component}</div>)}
                        {oneDriveButtons?.map(b => <div key={b.id} className="opacity-70 hover:opacity-100 transition-opacity">{b.component}</div>)}
                        {dropboxBtn?.map(b => <div key={b.id} className="opacity-70 hover:opacity-100 transition-opacity">{b.component}</div>)}
                    </div>
                    <div className="h-8 w-px bg-card/10 mx-2" />
                    {project && auth.user?.permissions?.includes('manage-project-task') && (
                        <Button size="sm" variant="outline" className="premium-button border-white/10 hover:bg-card/10" onClick={() => router.get(route('project.tasks.kanban', project.id))}>
                            <Kanban className="h-4 w-4 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('Mission Matrix')}</span>
                        </Button>
                    )}
                </div>
            }
        >
            <Head title={t('Tasks')} />

            <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <Card className="glass-effect-dark border-white/10 shadow-2xl overflow-hidden">
                    <CardContent className="p-6 bg-card/[0.02]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 max-w-md relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                <SearchInput 
                                    value={filters.title} 
                                    onChange={(v) => setFilters({...filters, title: v})} 
                                    onSearch={handleFilter} 
                                    placeholder={t('Search Sector...')} 
                                    className="pl-10 h-11 bg-foreground/50 border-white/5 focus:border-foreground/50 transition-all text-xs font-bold uppercase tracking-widest"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <ListGridToggle currentView={viewMode} routeName="project.tasks.index" filters={{...filters, per_page: perPage, project_id: project?.id}} />
                                <PerPageSelector routeName="project.tasks.index" filters={{...filters, view: viewMode, project_id: project?.id}} />
                                <Button
                                    variant={showFilters ? "secondary" : "outline"}
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`h-9 px-4 gap-2 transition-all ${showFilters ? 'bg-foreground/20 text-foreground border-foreground/30' : 'border-white/10 hover:bg-card/5'}`}
                                >
                                    <Filter className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('Filters')}</span>
                                    {Object.values(filters).filter(Boolean).length > 0 && (
                                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-foreground text-[8px] text-background">
                                            {Object.values(filters).filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                                {auth.user?.permissions?.includes('create-project-task') && (
                                    <Button size="sm" onClick={() => openModal('add')} className="premium-button px-6 h-9">
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('Deploy Task')}</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    {showFilters && (
                        <div className="overflow-hidden border-t border-white/5 bg-foreground/30 animate-in slide-in-from-top duration-300">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Priority Tier')}</label>
                                        <Select value={filters.priority} onValueChange={(v) => setFilters({...filters, priority: v})}>
                                            <SelectTrigger className="glass-effect-dark h-10 border-white/5 text-xs font-bold uppercase tracking-widest"><SelectValue placeholder={t('Filter Tier')} /></SelectTrigger>
                                            <SelectContent className="glass-effect-dark border-white/10">
                                                <SelectItem value="High" className="text-destructive">{t('High Velocity')}</SelectItem>
                                                <SelectItem value="Medium" className="text-muted-foreground">{t('Standard Op')}</SelectItem>
                                                <SelectItem value="Low" className="text-foreground">{t('Low Sustain')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Temporal Window')}</label>
                                        <DatePicker value={filters.date_range} onChange={(v) => setFilters({...filters, date_range: v})} placeholder={t('Select Window')} className="h-10 bg-card/50 border-white/5" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Assigned Operative')}</label>
                                        <Select value={filters.user_id} onValueChange={(v) => setFilters({...filters, user_id: v})}>
                                            <SelectTrigger className="glass-effect-dark h-10 border-white/5 text-xs font-bold uppercase tracking-widest"><SelectValue placeholder={t('Select Agent')} /></SelectTrigger>
                                            <SelectContent className="glass-effect-dark border-white/10">
                                                {teamMembers?.map(u => <SelectItem key={u.id} value={u.id.toString()} className="text-[10px] font-bold uppercase tracking-widest">{u.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end gap-3 pb-0.5">
                                        <Button onClick={handleFilter} size="sm" className="flex-1 h-10 bg-foreground/20 text-foreground hover:bg-foreground/30 border border-foreground/20 transition-all transform hover:scale-105">
                                            <Zap className="h-3.5 w-3.5 mr-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{t('Execute')}</span>
                                        </Button>
                                        <Button variant="ghost" onClick={clearFilters} size="sm" className="h-10 text-muted-foreground hover:text-background transition-colors">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{t('Reset')}</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    <CardContent className="p-0">
                        {viewMode === 'list' ? (
                            <div className="overflow-x-auto custom-scrollbar">
                                <DataTable data={tasks.data} columns={tableColumns} onSort={(f) => {
                                    const dir = sortField === f && sortDirection === 'asc' ? 'desc' : 'asc';
                                    setSortField(f); setSortDirection(dir);
                                    router.get(route('project.tasks.index'), {...filters, per_page: perPage, sort: f, direction: dir, view: viewMode, project_id: project?.id}, { preserveState: true, replace: true });
                                }} sortKey={sortField} sortDirection={sortDirection as 'asc' | 'desc'} className="bg-transparent" />
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                    {tasks.data?.map((task, idx) => (
                                        <div key={task.id} className="group animate-in fade-in zoom-in-95 duration-200" style={{ animationDelay: `${idx * 50}ms` }}>
                                            <Card className="premium-card bg-foreground/40 backdrop-blur-3xl border-white/5 hover:border-foreground/30 hover:bg-card/[0.05] transition-all duration-500 shadow-xl relative overflow-hidden h-full flex flex-col">
                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="p-2 rounded-lg bg-foreground/10 border border-foreground/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                                            <Target className="h-4 w-4 text-foreground" />
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-background transition-colors"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="glass-effect-dark border-white/10">
                                                                <DropdownMenuItem onClick={() => router.get(route('project.tasks.view', task.id))} className="text-[10px] font-black uppercase tracking-widest gap-2"><Eye className="h-3.5 w-3.5" />{t('View Intel')}</DropdownMenuItem>
                                                                {auth.user?.permissions?.includes('edit-project-task') && <DropdownMenuItem onClick={() => openModal('edit', task)} className="text-[10px] font-black uppercase tracking-widest gap-2"><Edit className="h-3.5 w-3.5" />{t('Modify Op')}</DropdownMenuItem>}
                                                                {auth.user?.permissions?.includes('delete-project-task') && <DropdownMenuItem onClick={() => openDeleteDialog(task.id)} className="text-[10px] font-black uppercase tracking-widest gap-2 text-destructive hover:!text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" />{t('Purge Vector')}</DropdownMenuItem>}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <h3 className="font-black text-xs uppercase tracking-widest text-background/90 line-clamp-2 mb-4 leading-relaxed tracking-tighter">{task.title}</h3>
                                                    <div className="space-y-3 mt-auto pt-4 border-t border-white/5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">{t('Priority Tier')}</span>
                                                            <Badge className={`text-[8px] font-black uppercase tracking-widest px-2 py-0 border ${getPriorityStyle(task.priority)}`}>{t(task.priority)}</Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">{t('Assigned')}</span>
                                                            <div className="flex -space-x-1.5">
                                                                {(task.assignedUsers || []).slice(0, 3)?.map(u => (
                                                                    <div key={u.id} className="h-6 w-6 rounded-lg border-2 border-[#0f172a] overflow-hidden group-hover:scale-110 transition-transform">{u.avatar ? <img src={getImagePath(u.avatar)} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-card flex items-center justify-center"><User className="h-2 w-2 text-muted-foreground" /></div>}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-50 pt-1">
                                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
                                                                {task.start_date ? formatDate(task.start_date) : '-'} — {task.end_date ? formatDate(task.end_date) : '-'}
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
                            <NoRecordsFound icon={Package} title={t('Vector Field Clear')} description={t('Operational grid is currently empty. Initialize a new mission vector to begin.')} hasFilters={!!(filters.title || filters.priority)} onClearFilters={clearFilters} createPermission="create-project-task" onCreateClick={() => openModal('add')} createButtonText={t('Initialize Vector')} className="py-32" />
                        )}
                    </CardContent>

                    <CardContent className="p-4 border-t border-white/5 bg-card/[0.01]">
                        <Pagination data={tasks || { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }} routeName="project.tasks.index" filters={{...filters, per_page: perPage, view: viewMode, project_id: project?.id}} />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && <Create onSuccess={closeModal} project={project} milestones={milestones} teamMembers={teamMembers} />}
                {modalState.mode === 'edit' && modalState.data && <EditTask onSuccess={() => { closeModal(); router.reload(); }} task={modalState.data} project={project} milestones={milestones} teamMembers={teamMembers} taskStages={taskStages} />}
            </Dialog>

            <ConfirmationDialog open={deleteState.isOpen} onOpenChange={closeDeleteDialog} title={t('Purge Mission Vector')} message={t('Irrevocable action authorized: Are you sure you want to permanently erase this task record from the strategic grid?')} confirmText={t('Purge')} onConfirm={confirmDelete} variant="destructive" />
        </AuthenticatedLayout>
    );
}

const Clock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);
