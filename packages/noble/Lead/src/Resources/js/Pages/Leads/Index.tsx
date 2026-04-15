import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useFlashMessages } from '@/hooks/useFlashMessages';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
    Plus,
    Edit as EditIcon,
    Trash2,
    Eye,
    Users as UsersIcon,
    Download,
    FileImage,
    Tag,
    MoreVertical,
    Calendar,
    Kanban,
    List,
    ShoppingCart,
    Globe,
    CheckSquare,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterButton } from '@/components/ui/filter-button';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { ListGridToggle } from '@/components/ui/list-grid-toggle';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        pipeline_id: urlParams.get('pipeline_id') || pipelines?.[0]?.id?.toString() || '',
        stage_id: urlParams.get('stage_id') || '',
    });

    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'asc');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>((urlParams.get('view') as 'list' | 'kanban') || 'list');
    const [modalState, setModalState] = useState<LeadModalState>({
        isOpen: false,
        mode: '',
        data: null,
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
        defaultMessage: t('Are you sure you want to delete this lead?'),
    });

    const handleFilter = () => {
        router.get(
            route('lead.leads.index'),
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
            route('lead.leads.index'),
            { ...filters, per_page: perPage, sort: field, direction, view: viewMode },
            {
                preserveState: true,
                replace: true,
            }
        );
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
        router.get(route('lead.leads.index'), { per_page: perPage, view: viewMode });
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
        router.post(
            route('lead.leads.order'),
            {
                lead_id: leadId,
                stage_id: toStage,
                order: [leadId],
            },
            {
                preserveState: true,
                onSuccess: () => {
                    router.reload({ only: ['leads'] });
                },
            }
        );
    };

    const getKanbanData = () => {
        const colors = [
            '#3b82f6',
            '#ef4444',
            '#10b77f',
            '#f59e0b',
            '#8b5cf6',
            '#06b6d4',
            '#f97316',
            '#84cc16',
            '#ec4899',
            '#6366f1',
        ];

        // Filter stages by pipeline if selected
        const filteredStages =
            filters.pipeline_id && filters.pipeline_id !== ''
                ? stages?.filter((stage) => stage.pipeline_id?.toString() === filters.pipeline_id) || []
                : stages || [];

        const columns = filteredStages?.map((stage, index) => ({
            id: stage.id.toString(),
            title: stage.name,
            color: colors[index % colors.length],
        }));

        const tasksByStage: Record<string, any[]> = {};
        columns.forEach((col) => {
            tasksByStage[col.id] = [];
        });

        const filteredLeads =
            leads?.data?.filter((lead) => {
                let isValid = true;

                if (filters.user_id && filters.user_id !== '') {
                    isValid =
                        isValid &&
                        (lead.user_leads?.some((userLead) => userLead.user.id.toString() === filters.user_id) ?? false);
                }

                if (filters.pipeline_id && filters.pipeline_id !== '') {
                    isValid = isValid && lead.pipeline_id?.toString() === filters.pipeline_id;
                }

                return isValid;
            }) || [];

        filteredLeads.forEach((lead) => {
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
                    lead: lead,
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
                className="group relative mb-3 cursor-grab rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md active:cursor-grabbing dark:border-border dark:bg-foreground"
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-muted-foreground">#{lead.id}</span>
                            {isOverdue && (
                                <Badge variant="destructive" className="h-4 px-1 text-[9px]">
                                    {t('Overdue')}
                                </Badge>
                            )}
                        </div>
                        <h4
                            className="mt-1 cursor-pointer truncate text-sm font-bold text-foreground hover:underline dark:text-foreground"
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
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            {auth.user?.permissions?.includes('view-leads') && (
                                <DropdownMenuItem onClick={() => router.get(route('lead.leads.show', lead.id))}>
                                    <Eye className="me-2 h-4 w-4" />
                                    {t('View Details')}
                                </DropdownMenuItem>
                            )}
                            {auth.user?.permissions?.includes('edit-leads') && (
                                <DropdownMenuItem onClick={() => openModal('edit', lead)}>
                                    <EditIcon className="me-2 h-4 w-4" />
                                    {t('Edit')}
                                </DropdownMenuItem>
                            )}
                            {auth.user?.permissions?.includes('delete-leads') && (
                                <DropdownMenuItem
                                    onClick={() => openDeleteDialog(lead.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="me-2 h-4 w-4" />
                                    {t('Delete')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {task.description && (
                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {task.description}
                    </p>
                )}

                <div className="no-scrollbar mb-4 flex items-center gap-2 overflow-x-auto">
                    <div className="flex h-6 items-center gap-1.5 rounded border border-border bg-muted/50 px-2 text-[10px] font-medium text-muted-foreground dark:border-border dark:bg-card dark:text-muted-foreground">
                        <CheckSquare className="h-3 w-3" />
                        <span>
                            {lead.complete_tasks_count || 0}/{lead.tasks_count || 0}
                        </span>
                    </div>

                    <div className="flex h-6 items-center gap-1.5 rounded border border-border bg-muted/50 px-2 text-[10px] font-medium text-muted-foreground dark:border-border dark:bg-card dark:text-muted-foreground">
                        <ShoppingCart className="h-3 w-3" />
                        <span>
                            {lead.products ? lead.products.split(',').filter((id: any) => id.trim()).length : 0}
                        </span>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-border pt-4 dark:border-border">
                    <div className="flex -space-x-2">
                        {lead.user_leads?.length > 0 ? (
                            lead.user_leads.slice(0, 3)?.map((userLead: any) => (
                                <TooltipProvider key={userLead.user.id}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="h-6 w-6 overflow-hidden rounded-full border border-white bg-muted dark:border-border">
                                                {userLead.user.avatar ? (
                                                    <img
                                                        src={getImagePath(userLead.user.avatar)}
                                                        alt={userLead.user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold">
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
                            ))
                        ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted/50 text-[10px] text-muted-foreground">
                                ?
                            </div>
                        )}
                    </div>

                    {task.due_date && (
                        <div
                            className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}
                        >
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
            sortable: true,
        },
        {
            key: 'subject',
            header: t('Subject'),
            sortable: true,
        },
        {
            key: 'stage',
            header: t('Stage'),
            sortable: false,
            render: (value: any, row: any) => {
                const stageName =
                    row.stage?.name || stages?.find((item) => item.id.toString() === row.stage_id?.toString())?.name;
                return <Badge variant="secondary">{stageName || 'No Stage'}</Badge>;
            },
        },
        {
            key: 'tasks',
            header: t('Tasks'),
            sortable: false,
            render: (value: any, row: any) => {
                const totalTasks = row.tasks_count || 0;
                const completedTasks = row.complete_tasks_count || 0;
                return (
                    <span
                        className={`text-sm font-medium ${
                            totalTasks === 0
                                ? 'text-muted-foreground'
                                : completedTasks === totalTasks
                                  ? 'text-foreground'
                                  : ''
                        }`}
                    >
                        {completedTasks}/{totalTasks}
                    </span>
                );
            },
        },
        {
            key: 'date',
            header: t('Follow Up Date'),
            sortable: false,
            render: (value: string) => {
                if (!value) return '-';
                const isExpired = new Date(value) < new Date();
                return <span className={isExpired ? 'font-medium text-destructive' : ''}>{formatDate(value)}</span>;
            },
        },
        {
            key: 'users',
            header: t('Users'),
            sortable: false,
            render: (value: any, row: any) => (
                <div className="flex items-center">
                    <TooltipProvider>
                        <div className="flex -space-x-1">
                            {row.user_leads?.length > 0 ? (
                                row.user_leads.slice(0, 3)?.map((userLead: any, index: number) => (
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
                                ))
                            ) : (
                                <Avatar className="h-7 w-7 border-2 border-white dark:border-border">
                                    <AvatarFallback className="text-[10px]">
                                        <UsersIcon className="h-3 w-3" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </TooltipProvider>
                </div>
            ),
        },
        ...(auth.user?.permissions?.some((p: string) => ['view-leads', 'edit-leads', 'delete-leads'].includes(p))
            ? [
                  {
                      key: 'actions',
                      header: t('Actions'),
                      render: (_: any, lead: Lead) => (
                          <div className="flex gap-1">
                              {auth.user?.permissions?.includes('view-leads') && (
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => router.get(route('lead.leads.show', lead.id))}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-black dark:hover:text-background"
                                  >
                                      <Eye className="h-4 w-4" />
                                  </Button>
                              )}
                              {auth.user?.permissions?.includes('edit-leads') && (
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openModal('edit', lead)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-black dark:hover:text-background"
                                  >
                                      <EditIcon className="h-4 w-4" />
                                  </Button>
                              )}
                              {auth.user?.permissions?.includes('delete-leads') && (
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openDeleteDialog(lead.id)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              )}
                          </div>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('CRM'), url: route('lead.index') }, { label: t('Leads') }]}>
            <Head title={t('Leads')} />

            <div className="space-y-8 pb-12">
                {/* CRM Header */}
                <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-foreground/5 p-8 backdrop-blur-3xl dark:border-white/10 dark:bg-card/5">
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute end-0 top-0 p-12 opacity-[0.03] transition-transform duration-1000 group-hover:scale-125">
                        <Globe className="h-64 w-64 rotate-12 text-foreground" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
                        <div className="space-y-2 text-center lg:text-start">
                            <div className="mb-1 flex items-center justify-center gap-3 lg:justify-start">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/15 text-foreground shadow-inner">
                                    <UsersIcon className="h-5 w-5" />
                                </div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground dark:text-foreground">
                                    {t('Leads')}
                                    <span className="italic text-foreground">.</span>
                                </h1>
                            </div>
                            <p className="max-w-md text-sm font-medium tracking-tight text-muted-foreground">
                                {t(
                                    'Track and manage your sales leads, pipelines, and conversion stages.'
                                )}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-muted p-1.5 shadow-inner dark:border-border dark:bg-foreground">
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={`h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-foreground text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted dark:hover:bg-card'}`}
                                >
                                    <List className="me-2 h-3 w-3" />
                                    {t('List View')}
                                </Button>
                                <Button
                                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('kanban')}
                                    className={`h-8 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-foreground text-background shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted dark:hover:bg-card'}`}
                                >
                                    <Kanban className="me-2 h-3 w-3" />
                                    {t('Kanban View')}
                                </Button>
                            </div>

                            {auth.user?.permissions?.includes('create-leads') && (
                                <Button
                                    size="sm"
                                    onClick={() => openModal('add')}
                                    className="h-11 rounded-2xl border-t border-white/20 bg-foreground px-6 text-[10px] font-black uppercase tracking-widest text-background shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                                >
                                    <Plus className="me-2 h-4 w-4" />
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

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border/50 pt-6 dark:border-white/5 lg:justify-start">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {t('Active Pipeline')}:
                            </label>
                            <Select
                                value={filters.pipeline_id || pipelines?.[0]?.id?.toString() || 'all'}
                                onValueChange={(value) => {
                                    const pipelineId = value === 'all' ? '' : value;
                                    setFilters({ ...filters, pipeline_id: pipelineId });
                                    router.get(
                                        route('lead.leads.index'),
                                        {
                                            ...filters,
                                            pipeline_id: pipelineId,
                                            per_page: perPage,
                                            sort: sortField,
                                            direction: sortDirection,
                                            view: viewMode,
                                        },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        }
                                    );
                                }}
                            >
                                <SelectTrigger className="h-8 w-auto min-w-[140px] rounded-xl border border-border bg-card/50 px-3 text-[10px] font-black uppercase tracking-widest text-foreground transition-all hover:bg-muted dark:border-white/10 dark:bg-foreground/20 dark:text-foreground dark:hover:bg-card">
                                    <SelectValue placeholder={t('Select Pipeline')} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border shadow-2xl dark:border-white/10">
                                    {pipelines?.map((pipeline: any) => (
                                        <SelectItem
                                            key={pipeline.id}
                                            value={pipeline.id.toString()}
                                            className="text-[10px] font-black uppercase"
                                        >
                                            {pipeline.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mx-2 hidden h-4 w-[1px] bg-muted dark:bg-card/10 lg:block" />

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--foreground),0.1)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                    {leads?.data?.length || 0} {t('Leads in View')}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-foreground shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                    {pipelines?.length || 0} {t('Pipelines')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tactical Metrics Layer */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: t('Total Leads'),
                            value: (leads as any)?.meta?.total || (leads as any)?.total || 0,
                            icon: UsersIcon,
                            color: 'blue',
                        },
                        {
                            label: t('Overdue'),
                            value: leads?.data?.filter((l: any) => l.date && new Date(l.date) < new Date()).length || 0,
                            icon: Calendar,
                            color: 'rose',
                        },
                        {
                            label: t('With Tasks'),
                            value: leads?.data?.filter((l: any) => l.tasks_count > 0).length || 0,
                            icon: CheckSquare,
                            color: 'emerald',
                        },
                        { label: t('Pipelines'), value: pipelines?.length || 0, icon: Kanban, color: 'amber' },
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

                {viewMode === 'kanban' ? (
                    <div className="bg-muted/50/50 overflow-hidden rounded-lg border border-border p-6 dark:border-border dark:bg-foreground/50">
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
                        <div className="bg-muted/50/50 rounded-3xl border border-border p-4 shadow-inner backdrop-blur-3xl dark:border-white/5 dark:bg-foreground/30">
                            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                                <div className="w-full max-w-lg lg:flex-1">
                                    <SearchInput
                                        value={filters.name}
                                        onChange={(value) => setFilters({ ...filters, name: value })}
                                        onSearch={handleFilter}
                                        placeholder={t('Search leads...')}
                                        className="h-11 rounded-2xl border-border bg-card/50 text-xs font-medium focus:ring-foreground/20 dark:border-white/10 dark:bg-foreground/20"
                                    />
                                </div>
                                <div className="flex w-full items-center gap-4 lg:w-auto">
                                    <div className="flex h-11 items-center rounded-2xl border border-border bg-muted/50 px-3 shadow-inner dark:border-white/10 dark:bg-card/5">
                                        <PerPageSelector
                                            routeName="lead.leads.index"
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
                                            const activeFiltersCount = [
                                                filters.is_active,
                                                filters.user_id,
                                                filters.stage_id,
                                            ].filter(Boolean).length;
                                            return (
                                                activeFiltersCount > 0 && (
                                                    <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-destructive text-[9px] font-black text-background shadow-lg duration-300 animate-in zoom-in">
                                                        {activeFiltersCount}
                                                    </span>
                                                )
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Filter Drawer */}
                            {showFilters && (
                                <div className="mt-6 grid grid-cols-1 gap-6 border-t border-border pt-6 duration-500 animate-in slide-in-from-top-4 dark:border-white/5 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="ms-1 text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground">
                                            {t('Assigned User')}
                                        </label>
                                        <Select
                                            value={filters.user_id}
                                            onValueChange={(value) => setFilters({ ...filters, user_id: value })}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl border-border bg-card/50 px-4 text-xs font-bold transition-all hover:bg-muted dark:border-white/10 dark:bg-foreground/20 dark:hover:bg-foreground/50">
                                                <SelectValue placeholder={t('All Users')} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl shadow-2xl">
                                                {users?.map((item: any) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id.toString()}
                                                        className="text-xs font-bold"
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="ms-1 text-[10px] font-black uppercase tracking-[.2em] text-muted-foreground">
                                            {t('Lead Stage')}
                                        </label>
                                        <Select
                                            value={filters.stage_id}
                                            onValueChange={(value) => setFilters({ ...filters, stage_id: value })}
                                        >
                                            <SelectTrigger className="h-10 rounded-xl border-border bg-card/50 px-4 text-xs font-bold transition-all hover:bg-muted dark:border-white/10 dark:bg-foreground/20 dark:hover:bg-foreground/50">
                                                <SelectValue placeholder={t('All Stages')} />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl shadow-2xl">
                                                {stages?.map((item: any) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id.toString()}
                                                        className="text-xs font-bold"
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-end gap-3">
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
                                            {t('Reset')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm dark:border-border dark:bg-foreground">
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
                                filters={{ ...filters, per_page: perPage, view: viewMode }}
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
