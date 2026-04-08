import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useFlashMessages } from '@/hooks/useFlashMessages';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Edit as EditIcon, Trash2, Eye, Users as UsersIcon, Download, FileImage, Tag, MoreVertical, Calendar, Kanban, List, ShoppingCart, Globe, CheckSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import KanbanBoard from '@/components/kanban-board';
import Create from './Create';
import EditLead from './Edit';
import View from './View';
import LabelView from './LabelView';
import NoRecordsFound from '@/components/no-records-found';
import { Lead, LeadsIndexProps, LeadFilters, LeadModalState } from './types';
import { formatDate, formatTime, formatDateTime, formatCurrency, getImagePath } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';


export default function Index() {
    const { t } = useTranslation();
    const { leads, auth, users = [], pipelines, stages, labels, sources, products } = usePage<LeadsIndexProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState<LeadFilters>({
        name: urlParams.get('name') || '',
        email: urlParams.get('email') || '',
        subject: urlParams.get('subject') || '',
        is_active: urlParams.get('is_active') || '',
        user_id: urlParams.get('user_id') || '',
        pipeline_id: urlParams.get('pipeline_id') || (pipelines?.[0]?.id?.toString() || ''),
        stage_id: urlParams.get('stage_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>(urlParams.get('view') as 'list' | 'kanban' || 'list');
    const [modalState, setModalState] = useState<LeadModalState>({
        isOpen: false,
        mode: '',
        data: null
    });
    const [viewingItem, setViewingItem] = useState<Lead | null>(null);
    const [labelingItem, setLabelingItem] = useState<Lead | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const googleDriveButtons = usePageButtons('googleDriveBtn', { module: 'Lead', settingKey: 'GoogleDrive Lead' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Lead', settingKey: 'OneDrive Lead' });
    const dropboxBtn = usePageButtons('dropboxBtn', { module: 'Lead', settingKey: 'Dropbox Lead' });


    useFlashMessages();

    const { deleteState, openDeleteDialog, closeDeleteDialog, confirmDelete } = useDeleteHandler({
        routeName: 'lead.leads.destroy',
        defaultMessage: t('Are you sure you want to delete this lead?')
    });

    const handleFilter = () => {
        router.get(route('lead.leads.index'), {...filters, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode}, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('lead.leads.index'), {...filters, per_page: perPage, sort: field, direction, view: viewMode}, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            email: '',
            subject: '',
            is_active: '',
            user_id: '',
            pipeline_id: '',
            stage_id: '',
        });
        router.get(route('lead.leads.index'), {per_page: perPage, view: viewMode});
    };

    const openModal = async (mode: 'add' | 'edit', data: Lead | null = null) => {
        if (mode === 'edit' && data) {
            try {
                const response = await fetch(route('lead.leads.edit', data.id));
                const editData = await response.json();
                setModalState({ isOpen: true, mode, data: editData });
            } catch (error) {
                setModalState({ isOpen: true, mode, data });
            }
        } else {
            setModalState({ isOpen: true, mode, data });
        }
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    const handleMove = (leadId: number, fromStage: string, toStage: string) => {
        router.post(route('lead.leads.order'), {
            lead_id: leadId,
            stage_id: toStage,
            order: [leadId]
        }, {
            preserveState: true,
            onSuccess: () => {
                router.reload({ only: ['leads'] });
            }
        });
    };

    const getKanbanData = () => {
        const colors = ['#3b82f6', '#ef4444', '#10b77f', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'];

        // Filter stages by pipeline if selected
        const filteredStages = filters.pipeline_id && filters.pipeline_id !== ''
            ? stages?.filter(stage => stage.pipeline_id?.toString() === filters.pipeline_id) || []
            : stages || [];

        const columns = filteredStages?.map((stage, index) => ({
            id: stage.id.toString(),
            title: stage.name,
            color: colors[index % colors.length]
        }));

        const tasksByStage: Record<string, any[]> = {};
        columns.forEach(col => {
            tasksByStage[col.id] = [];
        });

        const filteredLeads = leads?.data?.filter(lead => {
            let isValid = true;

            if (filters.user_id && filters.user_id !== '') {
                isValid = isValid && (lead.user_leads?.some(userLead => userLead.user.id.toString() === filters.user_id) ?? false);
            }

            if (filters.pipeline_id && filters.pipeline_id !== '') {
                isValid = isValid && lead.pipeline_id?.toString() === filters.pipeline_id;
            }

            return isValid;
        }) || [];

        filteredLeads.forEach(lead => {
            const stageId = lead.stage_id?.toString();
            if (stageId && tasksByStage[stageId]) {
                tasksByStage[stageId].push({
                    id: lead.id,
                    title: lead.name,
                    description: lead.subject,
                    status: stageId,
                    due_date: lead.date,
                    assigned_to: lead.user_leads?.[0]?.user || null,
                    priority: null,
                    lead: lead
                });
            }
        });

        return { columns, tasks: tasksByStage };
    };

    const LeadCard = ({ task }: { task: any }) => {
        const lead = task.lead;
        const isOverdue = task.due_date && new Date(task.due_date) < new Date();

        const handleDragStart = (e: React.DragEvent) => {
            e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, fromStatus: task.status }));
            e.dataTransfer.effectAllowed = 'move';
        };

        return (
            <div
                className="group relative bg-card dark:bg-foreground border border-border dark:border-border rounded-lg p-4 mb-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">#{lead.id}</span>
                            {isOverdue && (
                                <Badge variant="destructive" className="text-[9px] h-4 px-1">
                                    {t('Overdue')}
                                </Badge>
                            )}
                        </div>
                        <h4
                            className="font-bold text-sm text-foreground dark:text-foreground truncate cursor-pointer hover:underline mt-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.get(route('lead.leads.show', lead.id));
                            }}
                        >
                            {task.title}
                        </h4>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            {auth.user?.permissions?.includes('view-leads') && (
                                <DropdownMenuItem onClick={() => router.get(route('lead.leads.show', lead.id))}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    {t('View Details')}
                                </DropdownMenuItem>
                            )}
                            {auth.user?.permissions?.includes('edit-leads') && (
                                <DropdownMenuItem onClick={() => openModal('edit', lead)}>
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    {t('Edit')}
                                </DropdownMenuItem>
                            )}
                            {auth.user?.permissions?.includes('delete-leads') && (
                                <DropdownMenuItem onClick={() => openDeleteDialog(lead.id)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('Delete')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {task.description && (
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1.5 h-6 bg-muted/50 dark:bg-card px-2 rounded text-[10px] font-medium text-muted-foreground dark:text-muted-foreground border border-border dark:border-border">
                        <CheckSquare className="h-3 w-3" />
                        <span>{lead.complete_tasks_count || 0}/{lead.tasks_count || 0}</span>
                    </div>

                    <div className="flex items-center gap-1.5 h-6 bg-muted/50 dark:bg-card px-2 rounded text-[10px] font-medium text-muted-foreground dark:text-muted-foreground border border-border dark:border-border">
                        <ShoppingCart className="h-3 w-3" />
                        <span>{lead.products ? lead.products.split(',').filter((id: any) => id.trim()).length : 0}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-border dark:border-border pt-4 mt-2">
                    <div className="flex -space-x-2">
                        {lead.user_leads?.length > 0 ? lead.user_leads.slice(0, 3)?.map((userLead: any) => (
                            <TooltipProvider key={userLead.user.id}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="h-6 w-6 rounded-full border border-white dark:border-border overflow-hidden bg-muted">
                                            {userLead.user.avatar ? (
                                                <img
                                                    src={getImagePath(userLead.user.avatar)}
                                                    alt={userLead.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-[10px] font-bold">
                                                    {userLead.user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">{userLead.user.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )) : (
                            <div className="h-6 w-6 rounded-full bg-muted/50 border border-border flex items-center justify-center text-[10px] text-muted-foreground">?</div>
                        )}
                    </div>

                    {task.due_date && (
                        <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.due_date)}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };



    // Move tableColumns inside to access scoped variables
    const tableColumns = [
        {
            key: 'name',
            header: t('Name'),
            sortable: true
        },
        {
            key: 'subject',
            header: t('Subject'),
            sortable: true
        },
        {
            key: 'stage',
            header: t('Stage'),
            sortable: false,
            render: (value: any, row: any) => {
                const stageName = row.stage?.name || stages?.find(item => item.id.toString() === row.stage_id?.toString())?.name;
                return (
                    <Badge variant="secondary">
                        {stageName || 'No Stage'}
                    </Badge>
                );
            }
        },
        {
            key: 'tasks',
            header: t('Tasks'),
            sortable: false,
            render: (value: any, row: any) => {
                const totalTasks = row.tasks_count || 0;
                const completedTasks = row.complete_tasks_count || 0;
                return (
                    <span className={`text-sm font-medium ${
                        totalTasks === 0 ? 'text-muted-foreground' :
                        completedTasks === totalTasks ? 'text-foreground' : ''
                    }`}>
                        {completedTasks}/{totalTasks}
                    </span>
                );
            }
        },
        {
            key: 'date',
            header: t('Follow Up Date'),
            sortable: false,
            render: (value: string) => {
                if (!value) return '-';
                const isExpired = new Date(value) < new Date();
                return (
                    <span className={isExpired ? 'text-destructive font-medium' : ''}>
                        {formatDate(value)}
                    </span>
                );
            }
        },
        {
            key: 'users',
            header: t('Users'),
            sortable: false,
            render: (value: any, row: any) => (
                <div className="flex items-center">
                    <TooltipProvider>
                        <div className="flex -space-x-1">
                            {row.user_leads?.length > 0 ? row.user_leads.slice(0, 3)?.map((userLead: any, index: number) => (
                                <Tooltip key={userLead.user.id}>
                                    <TooltipTrigger>
                                        <Avatar className="h-7 w-7 border-2 border-white dark:border-border">
                                            {userLead.user.avatar ? (
                                                <img
                                                    src={getImagePath(userLead.user.avatar)}
                                                    alt={userLead.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <AvatarFallback className="text-[10px]">
                                                    {userLead.user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">{userLead.user.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )) : (
                                <Avatar className="h-7 w-7 border-2 border-white dark:border-border">
                                    <AvatarFallback className="text-[10px]">
                                        <UsersIcon className="h-3 w-3" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </TooltipProvider>
                </div>
            )
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-leads','edit-leads', 'delete-leads'].includes(p)) ? [{
            key: 'actions',
            header: t('Actions'),
            render: (_: any, lead: Lead) => (
                <div className="flex gap-1">
                    {auth.user?.permissions?.includes('view-leads') && (
                        <Button variant="ghost" size="sm" onClick={() => router.get(route('lead.leads.show', lead.id))} className="h-8 w-8 p-0 text-muted-foreground hover:text-black dark:hover:text-background">
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}
                    {auth.user?.permissions?.includes('edit-leads') && (
                        <Button variant="ghost" size="sm" onClick={() => openModal('edit', lead)} className="h-8 w-8 p-0 text-muted-foreground hover:text-black dark:hover:text-background">
                            <EditIcon className="h-4 w-4" />
                        </Button>
                    )}
                    {auth.user?.permissions?.includes('delete-leads') && (
                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(lead.id)} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )
        }] : [])
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {label: t('CRM'), url: route('lead.index')},
                {label: t('Leads')}
            ]}
        >
        <Head title={t('Leads')} />

        <div className="space-y-8 pb-12">
            {/* Mission Command: Tactical Intelligence Header */}
            <div className="relative overflow-hidden p-8 rounded-3xl bg-foreground/5 dark:bg-card/5 border border-border/50 dark:border-white/10 backdrop-blur-3xl group">
                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                    <Globe className="h-64 w-64 text-foreground rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-1">
                            <div className="h-10 w-10 rounded-xl bg-foreground/15 flex items-center justify-center text-foreground shadow-inner">
                                <UsersIcon className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase text-foreground dark:text-foreground">
                                {t('Lead Intelligence')}
                                <span className="text-foreground italic">.</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium tracking-tight max-w-md">
                            {t('Real-time synchronization of conversion pipelines and strategic outreach telemetry.')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted dark:bg-foreground border border-border dark:border-border shadow-inner">
                            <Button 
                                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setViewMode('list')}
                                className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-foreground text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted dark:hover:bg-card'}`}
                            >
                                <List className="h-3 w-3 mr-2" />
                                {t('List View')}
                            </Button>
                            <Button 
                                variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
                                size="sm" 
                                onClick={() => setViewMode('kanban')}
                                className={`h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-foreground text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted dark:hover:bg-card'}`}
                            >
                                <Kanban className="h-3 w-3 mr-2" />
                                {t('Kanban Flux')}
                            </Button>
                        </div>

                        {auth.user?.permissions?.includes('create-leads') && (
                            <Button 
                                size="sm" 
                                onClick={() => openModal('add')}
                                className="h-11 rounded-2xl bg-foreground text-background hover:opacity-90 font-black uppercase tracking-widest text-[10px] px-6 shadow-xl shadow-primary/20 border-t border-white/20 transition-all active:scale-95"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('Add Lead')}
                            </Button>
                        )}
                        
                        <div className="flex gap-2">
                             {googleDriveButtons?.map((button) => (
                                <div key={button.id}>{button.component}</div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 border-t border-border/50 dark:border-white/5 pt-6">
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Active Pipeline')}:</label>
                        <Select 
                            value={filters.pipeline_id || pipelines?.[0]?.id?.toString() || 'all'} 
                            onValueChange={(value) => {
                                const pipelineId = value === 'all' ? '' : value;
                                setFilters({...filters, pipeline_id: pipelineId});
                                router.get(route('lead.leads.index'), {...filters, pipeline_id: pipelineId, per_page: perPage, sort: sortField, direction: sortDirection, view: viewMode}, {
                                    preserveState: true,
                                    replace: true
                                });
                            }}
                        >
                            <SelectTrigger className="h-8 px-3 border border-border dark:border-white/10 bg-card/50 dark:bg-foreground/20 hover:bg-muted dark:hover:bg-card rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground dark:text-foreground w-auto min-w-[140px] transition-all">
                                <SelectValue placeholder={t('Select Pipeline')} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border dark:border-white/10 shadow-2xl">
                                {pipelines?.map((pipeline: any) => (
                                    <SelectItem key={pipeline.id} value={pipeline.id.toString()} className="text-[10px] font-black uppercase">
                                        {pipeline.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="hidden lg:block h-4 w-[1px] bg-muted dark:bg-card/10 mx-2" />
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--foreground),0.1)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{leads?.data?.length || 0} {t('Leads in View')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{pipelines?.length || 0} {t('Active Sectors')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Metrics Layer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t('Total Force'), value: (leads as any)?.meta?.total || (leads as any)?.total || 0, icon: UsersIcon, color: 'blue' },
                    { label: t('Sync Required'), value: leads?.data?.filter((l: any) => l.date && new Date(l.date) < new Date()).length || 0, icon: Calendar, color: 'rose' },
                    { label: t('Operational'), value: leads?.data?.filter((l: any) => l.tasks_count > 0).length || 0, icon: CheckSquare, color: 'emerald' },
                    { label: t('Sectors'), value: pipelines?.length || 0, icon: Kanban, color: 'amber' }
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

            {viewMode === 'kanban' ? (
                <div className="bg-muted/50/50 dark:bg-foreground/50 border border-border dark:border-border rounded-lg p-6 overflow-hidden">
                    {(() => {
                        const { columns, tasks } = getKanbanData();
                        return (
                            <KanbanBoard
                                tasks={tasks}
                                columns={columns}
                                onMove={handleMove}
                                taskCard={LeadCard}
                                kanbanActions={null}
                            />
                        );
                    })()}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* List Controls */}
                    <div className="p-4 bg-muted/50/50 dark:bg-foreground/30 border border-border dark:border-white/5 rounded-3xl backdrop-blur-3xl shadow-inner">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="w-full lg:flex-1 max-w-lg">
                                <SearchInput
                                    value={filters.name}
                                    onChange={(value) => setFilters({...filters, name: value})}
                                    onSearch={handleFilter}
                                    placeholder={t('Search coordinates...')}
                                    className="bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 h-11 rounded-2xl text-xs font-medium focus:ring-foreground/20"
                                />
                            </div>
                            <div className="flex items-center gap-4 w-full lg:w-auto">
                                <div className="h-11 px-3 rounded-2xl bg-muted/50 dark:bg-card/5 border border-border dark:border-white/10 flex items-center shadow-inner">
                                    <PerPageSelector
                                        routeName="lead.leads.index"
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
                                        const activeFiltersCount = [filters.is_active, filters.user_id, filters.stage_id].filter(Boolean).length;
                                        return activeFiltersCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-destructive text-background text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in duration-300">
                                                {activeFiltersCount}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Filter Drawer: Modern Tactical Layout */}
                        {showFilters && (
                            <div 
                                className="mt-6 pt-6 border-t border-border dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[.2em] ml-1">{t('Assigned Unit')}</label>
                                    <Select value={filters.user_id} onValueChange={(value) => setFilters({...filters, user_id: value})}>
                                        <SelectTrigger className="bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 h-10 px-4 rounded-xl text-xs font-bold transition-all hover:bg-muted dark:hover:bg-foreground/50">
                                            <SelectValue placeholder={t('All Personnel')} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-2xl">
                                            {users?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()} className="text-xs font-bold">
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[.2em] ml-1">{t('Deployment Stage')}</label>
                                    <Select value={filters.stage_id} onValueChange={(value) => setFilters({...filters, stage_id: value})}>
                                        <SelectTrigger className="bg-card/50 dark:bg-foreground/20 border-border dark:border-white/10 h-10 px-4 rounded-xl text-xs font-bold transition-all hover:bg-muted dark:hover:bg-foreground/50">
                                            <SelectValue placeholder={t('All Stages')} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-2xl">
                                            {stages?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()} className="text-xs font-bold">
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-3">
                                    <Button onClick={handleFilter} className="flex-1 h-10 px-6 rounded-xl bg-foreground text-background font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 transition-all active:scale-95">{t('Apply Synch')}</Button>
                                    <Button variant="ghost" onClick={clearFilters} className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">{t('Reset')}</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-card dark:bg-foreground border border-border dark:border-border rounded-lg overflow-hidden shadow-sm">
                        <DataTable
                            data={leads?.data || []}
                            columns={tableColumns}
                            onSort={handleSort}
                            sortKey={sortField}
                            sortDirection={sortDirection as 'asc' | 'desc'}
                            className="border-none"
                            emptyState={
                                <NoRecordsFound
                                    icon={UsersIcon}
                                    title={t('No leads found')}
                                    description={t('Get started by adding your first lead.')}
                                    hasFilters={!!(filters.name || filters.user_id || filters.stage_id)}
                                    onClearFilters={clearFilters}
                                    createPermission="create-leads"
                                    onCreateClick={() => openModal('add')}
                                    createButtonText={t('Add Lead')}
                                    className="h-auto py-12"
                                />
                            }
                        />
                    </div>

                    <div className="mt-4">
                        <Pagination
                            data={leads || { data: [], links: [], meta: {} }}
                            routeName="lead.leads.index"
                            filters={{...filters, per_page: perPage, view: viewMode}}
                        />
                    </div>
                </div>
            )}
            
            {/* Lead Modals and Dialogs */}
            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' ? (
                    <Create 
                        pipelines={pipelines} 
                        stages={stages} 
                        sources={sources} 
                        products={products} 
                        users={users} 
                        onClose={closeModal} 
                    />
                ) : (
                    modalState.data && (
                        <EditLead 
                            lead={modalState.data} 
                            pipelines={pipelines} 
                            stages={stages} 
                            sources={sources} 
                            products={products} 
                            users={users} 
                            onClose={closeModal} 
                        />
                    )
                )}
            </Dialog>

            <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
                {viewingItem && <View lead={viewingItem} />}
            </Dialog>

            <Dialog open={!!labelingItem} onOpenChange={() => setLabelingItem(null)}>
                {labelingItem && <LabelView lead={labelingItem} onClose={() => setLabelingItem(null)} />}
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Lead')}
                message={deleteState.message}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </div>
    </AuthenticatedLayout>
    );
}
