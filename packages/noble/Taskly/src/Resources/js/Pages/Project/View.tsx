import { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useDeleteHandler } from '@/hooks/useDeleteHandler';
import { usePageButtons } from '@/hooks/usePageButtons';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency, formatDate, downloadFile } from '@/utils/helpers';
import { getImagePath } from '@/utils/helpers';
import {
    Plus,
    Trash2,
    Edit,
    FolderKanban,
    Kanban,
    List,
    Bug,
    CheckSquare,
    Calendar,
    Activity,
    Image,
    File,
    FileText,
    Video,
    Music,
    Download,
    Eye,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { DataTable } from '@/components/ui/data-table';
import NoRecordsFound from '@/components/no-records-found';
import InputError from '@/components/ui/input-error';
import { LineChart } from '@/components/charts/LineChart';

import MediaPicker from '@/components/MediaPicker';
import axios from 'axios';
import { useFormFields } from '@/hooks/useFormFields';

interface Project {
    id: number;
    name: string;
    description?: string;
    user: { id: number; name: string };
    creator: { id: number; name: string };
    team_members: Array<{ id: number; name: string }>;
    clients: Array<{ id: number; name: string }>;
    milestones: Array<{
        id: number;
        title: string;
        cost?: number;
        start_date?: string;
        end_date?: string;
        summary?: string;
        status: string;
        progress: number;
    }>;
}

interface ShowProps {
    project: Project;
    teamMembers: Array<{ id: number; name: string }>;
    available_clients: Array<{ id: number; name: string }>;
    projectStats: {
        taskCount: number;
        bugCount: number;
        daysLeft: number;
        budget: number;
        totalExpense?: number;
    };
    chartData: Array<{ name: string; [key: string]: any }>;
    chartLines: Array<{ dataKey: string; color: string; name: string }>;
    activityLogs: Array<{
        id: number;
        log_type: string;
        remark: string;
        created_at: string;
        user: { id: number; name: string };
    }>;
    projectFiles: Array<{
        id: number;
        file_name: string;
        file_path: string;
    }>;
    projectExpenses?: Array<{
        id: number;
        name: string;
        amount: number;
        date: string;
        description?: string;
        attachment?: string;
    }>;
    auth: {
        user: {
            permissions: string[];
            roles: string[];
        };
    };
}

export default function Show() {
    const { t } = useTranslation();
    const {
        project,
        teamMembers,
        available_clients,
        projectStats,
        chartData,
        chartLines,
        activityLogs,
        projectFiles,
        projectExpenses,
        auth,
    } = usePage<ShowProps>().props;
    const videoHubButtons = usePageButtons('projectShowButtons', { project });
    const spreadsheetButtons = usePageButtons('spreadsheetBtn', { module: 'Project', sub_module: project.id });
    const businessProcessMappingButtons = usePageButtons('businessProcessMappingBtn', {
        module: 'Taskly',
        submodule: 'Project',
        id: project.id,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<any>(null);
    const [projectEditData, setProjectEditData] = useState<any>(null);
    const [loadingProjectData, setLoadingProjectData] = useState(false);

    const [deleteState, setDeleteState] = useState({ isOpen: false, userId: null as number | null, userName: '' });
    const [deleteClientState, setDeleteClientState] = useState({
        isOpen: false,
        clientId: null as number | null,
        clientName: '',
    });

    const [milestoneDeleteState, setMilestoneDeleteState] = useState({
        isOpen: false,
        milestoneId: null as number | null,
    });

    const openMilestoneDeleteDialog = (milestoneId: number) => {
        setMilestoneDeleteState({ isOpen: true, milestoneId });
    };

    const closeMilestoneDeleteDialog = () => {
        setMilestoneDeleteState({ isOpen: false, milestoneId: null });
    };

    const confirmMilestoneDelete = () => {
        if (milestoneDeleteState.milestoneId) {
            router.delete(route('project.milestones.delete', project.id), {
                data: { id: milestoneDeleteState.milestoneId },
                onSuccess: () => closeMilestoneDeleteDialog(),
            });
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        user_ids: [],
    });

    const {
        data: clientData,
        setData: setClientData,
        post: postClient,
        processing: clientProcessing,
        errors: clientErrors,
        reset: resetClient,
    } = useForm({
        client_ids: [],
    });

    const {
        data: milestoneData,
        setData: setMilestoneData,
        post: postMilestone,
        processing: milestoneProcessing,
        errors: milestoneErrors,
        reset: resetMilestone,
    } = useForm({
        title: '',
        cost: '',
        start_date: '',
        end_date: '',
        summary: '',
    });

    const {
        data: expenseData,
        setData: setExpenseData,
        post: postExpense,
        processing: expenseProcessing,
        errors: expenseErrors,
        reset: resetExpense,
    } = useForm({
        name: '',
        amount: '',
        date: '',
        description: '',
    });

    const {
        data: editMilestoneData,
        setData: setEditMilestoneData,
        put: putMilestone,
        processing: editMilestoneProcessing,
        errors: editMilestoneErrors,
        reset: resetEditMilestone,
    } = useForm({
        title: '',
        cost: '',
        start_date: '',
        end_date: '',
        summary: '',
        status: 'Incomplete',
        progress: 0,
        milestone_id: null,
    });

    const {
        data: editProjectData,
        setData: setEditProjectData,
        put: putProject,
        processing: editProjectProcessing,
        errors: editProjectErrors,
        reset: resetEditProject,
    } = useForm({
        name: '',
        description: '',
        budget: 0,
        start_date: '',
        end_date: '',
        status: 'Ongoing',
    });

    const {
        data: imagesData,
        setData: setImagesData,
        post: postImages,
        processing: imagesProcessing,
        errors: imagesErrors,
        reset: resetImages,
    } = useForm({
        images: [],
    });

    // AI hooks for milestone forms
    const milestoneCreateTitleAI = useFormFields(
        'aiField',
        milestoneData,
        setMilestoneData,
        milestoneErrors,
        'create',
        'title',
        'Title',
        'taskly',
        'milestone'
    );
    const milestoneCreateSummaryAI = useFormFields(
        'aiField',
        milestoneData,
        setMilestoneData,
        milestoneErrors,
        'create',
        'summary',
        'Summary',
        'taskly',
        'milestone'
    );
    const milestoneEditTitleAI = useFormFields(
        'aiField',
        editMilestoneData,
        setEditMilestoneData,
        editMilestoneErrors,
        'edit',
        'title',
        'Title',
        'taskly',
        'milestone'
    );
    const milestoneEditSummaryAI = useFormFields(
        'aiField',
        editMilestoneData,
        setEditMilestoneData,
        editMilestoneErrors,
        'edit',
        'summary',
        'Summary',
        'taskly',
        'milestone'
    );

    const openEditProjectModal = async () => {
        if (!auth.user?.permissions?.includes('edit-project')) {
            return;
        }

        setLoadingProjectData(true);
        try {
            const response = await axios.get(route('project.edit', project.id));
            const projectData = response.data.project;

            setProjectEditData(projectData);
            setEditProjectData({
                name: projectData.name || '',
                description: projectData.description || '',
                budget: projectData.budget || 0,
                start_date: projectData.start_date || '',
                end_date: projectData.end_date || '',
                status: projectData.status || 'Ongoing',
            });
            setIsEditProjectModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch project data:', error);
        } finally {
            setLoadingProjectData(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('project.invite', project.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleClientSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postClient(route('project.invite-client', project.id), {
            onSuccess: () => {
                setIsClientModalOpen(false);
                resetClient();
            },
        });
    };

    const handleMilestoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postMilestone(route('project.milestones.store', project.id), {
            onSuccess: () => {
                setIsMilestoneModalOpen(false);
                resetMilestone();
            },
        });
    };

    const handleExpenseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postExpense(route('project.expenses.store', project.id), {
            onSuccess: () => {
                setExpenseData({ name: '', amount: '', date: '', description: '' });
                // We'll reset standard via route redirect or prop refresh
            },
        });
    };

    const deleteExpense = (expenseId: number) => {
        router.delete(route('project.expenses.destroy', expenseId));
    };

    const openEditMilestone = (milestone: any) => {
        setEditingMilestone(milestone);
        setEditMilestoneData({
            title: milestone.title,
            cost: milestone.cost || '',
            start_date: milestone.start_date || '',
            end_date: milestone.end_date || '',
            summary: milestone.summary || '',
            status: milestone.status || 'Incomplete',
            progress: milestone.progress || 0,
            milestone_id: milestone.id,
        });
        setIsEditMilestoneModalOpen(true);
    };

    const handleEditMilestoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putMilestone(route('project.milestones.update', project.id), {
            onSuccess: () => {
                setIsEditMilestoneModalOpen(false);
                resetEditMilestone();
                setEditingMilestone(null);
            },
        });
    };

    const handleEditProjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putProject(route('project.update', project.id), {
            onSuccess: () => {
                setIsEditProjectModalOpen(false);
                resetEditProject();
                setProjectEditData(null);
            },
        });
    };

    const openDeleteDialog = (userId: number, userName: string) => {
        setDeleteState({ isOpen: true, userId, userName });
    };

    const closeDeleteDialog = () => {
        setDeleteState({ isOpen: false, userId: null, userName: '' });
    };

    const confirmDelete = () => {
        if (deleteState.userId) {
            router.delete(route('project.delete-member', project.id), {
                data: { user_id: deleteState.userId },
                onSuccess: () => closeDeleteDialog(),
            });
        }
    };

    const openDeleteClientDialog = (clientId: number, clientName: string) => {
        setDeleteClientState({ isOpen: true, clientId, clientName });
    };

    const closeDeleteClientDialog = () => {
        setDeleteClientState({ isOpen: false, clientId: null, clientName: '' });
    };

    const confirmDeleteClient = () => {
        if (deleteClientState.clientId) {
            router.delete(route('project.delete-client', project.id), {
                data: { client_id: deleteClientState.clientId },
                onSuccess: () => closeDeleteClientDialog(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Project'), url: route('project.dashboard.index') }, { label: project.name }]}
            pageTitle={project.name}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {videoHubButtons?.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                        {spreadsheetButtons?.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}
                        {businessProcessMappingButtons?.map((button) => (
                            <div key={button.id}>{button.component}</div>
                        ))}

                        {auth.user?.permissions?.includes('manage-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={() => router.get(route('project.tasks.kanban', project.id))}
                                    >
                                        <Kanban className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Task Kanban')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {auth.user?.permissions?.includes('manage-project-bug') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={() => router.get(route('project.bugs.kanban', project.id))}
                                    >
                                        <Bug className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Bug')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {auth.user?.permissions?.includes('manage-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        onClick={() => router.get(route('project.tasks.calendar', project.id))}
                                    >
                                        <Calendar className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Calendar View')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {auth.user?.permissions?.includes('manage-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => router.get(route('project.gantt', project.id))}>
                                        <List className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Gantt Chart')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={project.name} />

            {/* Project Summary */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader className="bg-muted/50/50 border-b p-6">
                        <CardTitle className="flex items-center justify-between text-lg">
                            <div className="flex items-center gap-2">
                                <FolderKanban className="h-5 w-5 text-foreground" />
                                {t('Project Details')}
                            </div>
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={openEditProjectModal}
                                            disabled={loadingProjectData}
                                            className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Edit')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <span className="min-w-0 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    {t('Status')}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-1 text-end text-sm ${
                                        project.status === 'Finished'
                                            ? 'bg-muted text-foreground'
                                            : project.status === 'Ongoing'
                                              ? 'bg-muted text-foreground'
                                              : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {t(project.status)}
                                </span>
                            </div>
                            <div className="flex items-start justify-between">
                                <span className="min-w-0 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    {t('Start Date')}
                                </span>
                                <span className="text-end text-sm text-foreground">
                                    {project.start_date ? formatDate(project.start_date) : '-'}
                                </span>
                            </div>
                            <div className="flex items-start justify-between">
                                <span className="min-w-0 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    {t('End Date')}
                                </span>
                                <span
                                    className={`text-end text-sm ${
                                        project.end_date && new Date(project.end_date) < new Date()
                                            ? 'text-destructive'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {project.end_date ? formatDate(project.end_date) : '-'}
                                </span>
                            </div>
                            {project.description && (
                                <div className="border-t border-border pt-2">
                                    <span className="mb-2 block text-sm font-medium text-muted-foreground">
                                        {t('Description')}
                                    </span>
                                    <p className="text-sm leading-relaxed text-foreground">{project.description}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="bg-muted/50/50 border-b p-6">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FolderKanban className="h-5 w-5 text-foreground" />
                            {t('Project Overview')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`relative rounded-lg border border-border bg-muted/50 p-4 text-center ${auth.user?.permissions?.includes('manage-project-task') ? 'cursor-pointer' : ''}`}
                                onClick={() =>
                                    auth.user?.permissions?.includes('manage-project-task') &&
                                    router.get(route('project.tasks.index', { project_id: project.id }))
                                }
                            >
                                <div className="text-2xl font-bold text-foreground">{projectStats.taskCount}</div>
                                <div className="text-sm font-medium text-muted-foreground">{t('Tasks')}</div>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <div className="absolute end-2 top-2">
                                                <CheckSquare className="h-4 w-4 text-foreground" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('View Tasks')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div
                                className={`relative rounded-lg border border-border bg-muted/50 p-4 text-center ${auth.user?.permissions?.includes('manage-project-bug') ? 'cursor-pointer' : ''}`}
                                onClick={() =>
                                    auth.user?.permissions?.includes('manage-project-bug') &&
                                    router.get(route('project.bugs.index', { project_id: project.id }))
                                }
                            >
                                <div className="text-2xl font-bold text-destructive">{projectStats.bugCount}</div>
                                <div className="text-sm font-medium text-muted-foreground">{t('Bug')}</div>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <div className="absolute end-2 top-2">
                                                <Bug className="h-4 w-4 text-destructive" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('View Bug')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                                <div className="text-2xl font-bold text-foreground">
                                    {Math.round(projectStats.daysLeft)}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">{t('Days Left')}</div>
                            </div>
                            <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
                                <div className="text-2xl font-bold text-muted-foreground">
                                    {formatCurrency(projectStats.budget)}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">{t('Budget')}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-9">
                <Card className="md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">{t('Team Members')}</CardTitle>
                        {auth.user?.permissions?.includes('invite-project-member') && (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" onClick={() => setIsModalOpen(true)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Create')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-48 space-y-2 overflow-y-auto">
                            {project.team_members?.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded bg-muted/50 p-2"
                                >
                                    <span className="text-sm">{member.name}</span>
                                    {auth.user?.permissions?.includes('delete-project-member') && (
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => openDeleteDialog(member.id, member.name)}
                                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('Delete')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            ))}
                            {project.team_members.length === 0 && (
                                <p className="text-sm text-muted-foreground">{t('No team members added yet.')}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">{t('Clients')}</CardTitle>
                        {auth.user?.permissions?.includes('invite-project-client') && (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" onClick={() => setIsClientModalOpen(true)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Create')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-48 space-y-2 overflow-y-auto">
                            {project.clients?.map((client) => (
                                <div
                                    key={client.id}
                                    className="flex items-center justify-between rounded bg-muted/50 p-2"
                                >
                                    <span className="text-sm">{client.name}</span>
                                    {auth.user?.permissions?.includes('delete-project-client') && (
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => openDeleteClientDialog(client.id, client.name)}
                                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('Delete')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            ))}
                            {(!project.clients || project.clients.length === 0) && (
                                <p className="text-sm text-muted-foreground">{t('No clients added yet.')}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('Progress')}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 py-4">
                        <LineChart
                            data={chartData || []}
                            dataKey=""
                            xAxisKey="name"
                            height={200}
                            showGrid={false}
                            lines={chartLines || []}
                            margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
                        />
                    </CardContent>
                </Card>
            </div>

            {auth.user?.permissions?.includes('manage-project-milestone') && (
                <Card className="mt-6 shadow-sm">
                    <CardHeader className="bg-muted/50/50 flex flex-row items-center justify-between border-b p-6">
                        <CardTitle className="text-xl">{t('Milestones')}</CardTitle>
                        {auth.user?.permissions?.includes('create-project-milestone') && (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" onClick={() => setIsMilestoneModalOpen(true)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Create')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={project.milestones || []}
                                    columns={[
                                        {
                                            key: 'title',
                                            header: t('Title'),
                                        },
                                        {
                                            key: 'cost',
                                            header: t('Cost'),
                                            render: (value: any) => (value ? formatCurrency(value) : '-'),
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
                                                return (
                                                    <span className={isOverdue ? 'text-destructive' : ''}>
                                                        {formatDate(value)}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            key: 'status',
                                            header: t('Status'),
                                            render: (value: string) => (
                                                <span
                                                    className={`rounded-full px-2 py-1 text-sm ${
                                                        value === 'Complete'
                                                            ? 'bg-muted text-foreground'
                                                            : value === 'Ongoing'
                                                              ? 'bg-muted text-foreground'
                                                              : 'bg-muted text-destructive'
                                                    }`}
                                                >
                                                    {t(value)}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: 'progress',
                                            header: t('Progress'),
                                            render: (value: number) => {
                                                if (!value) return '-';
                                                return (
                                                    <div className="flex min-w-24 items-center gap-2">
                                                        <div className="h-2 flex-1 rounded-full bg-muted">
                                                            <div
                                                                className="h-2 rounded-full bg-foreground transition-all duration-300"
                                                                style={{ width: `${value}%` }}
                                                            />
                                                        </div>
                                                        <span className="min-w-8 text-xs font-medium text-muted-foreground">
                                                            {value}%
                                                        </span>
                                                    </div>
                                                );
                                            },
                                        },
                                        {
                                            key: 'actions',
                                            header: t('Action'),
                                            render: (_: any, milestone: any) => (
                                                <div className="flex gap-1">
                                                    {auth.user?.permissions?.includes('edit-project-milestone') && (
                                                        <Tooltip delayDuration={0}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => openEditMilestone(milestone)}
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
                                                    {auth.user?.permissions?.includes('delete-project-milestone') && (
                                                        <Tooltip delayDuration={0}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openMilestoneDeleteDialog(milestone.id)
                                                                    }
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
                                    ]}
                                    className="rounded-none"
                                    emptyState={
                                        <NoRecordsFound
                                            icon={FolderKanban}
                                            title={t('No milestones found')}
                                            description={t('Get started by creating your first milestone.')}
                                            hasFilters={false}
                                            onClearFilters={() => {}}
                                            createPermission="create-milestone"
                                            onCreateClick={() => setIsMilestoneModalOpen(true)}
                                            createButtonText={t('Create Milestone')}
                                            className="h-auto"
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Project Expenses */}
            {auth.user?.permissions?.includes('manage-project') && (
                <Card className="mt-6 shadow-sm">
                    <CardHeader className="bg-muted/50/50 flex flex-row items-center justify-between border-b p-6">
                        <CardTitle className="flex flex-col gap-2 text-xl sm:flex-row sm:items-center">
                            <span>{t('Project Expenses')}</span>
                            {projectStats.totalExpense > 0 && (
                                <span className="rounded bg-muted px-2 py-1 text-sm font-normal text-muted-foreground">
                                    {t('Total:')}{' '}
                                    <span className="font-semibold text-foreground">
                                        {formatCurrency(projectStats.totalExpense)}
                                    </span>
                                </span>
                            )}
                        </CardTitle>
                        {auth.user?.permissions?.includes('manage-project') && (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{t('Add Project Expense')}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleExpenseSubmit} className="space-y-4 pt-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">{t('Expense Name')} *</Label>
                                                        <Input
                                                            id="name"
                                                            value={expenseData.name}
                                                            onChange={(e) => setExpenseData('name', e.target.value)}
                                                            placeholder={t('e.g., Server Hosting, Travel')}
                                                            required
                                                        />
                                                        <InputError message={expenseErrors.name} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="amount">{t('Amount')} *</Label>
                                                            <Input
                                                                id="amount"
                                                                type="number"
                                                                step="0.01"
                                                                value={expenseData.amount}
                                                                onChange={(e) =>
                                                                    setExpenseData('amount', e.target.value)
                                                                }
                                                                required
                                                            />
                                                            <InputError message={expenseErrors.amount} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="date">{t('Date')} *</Label>
                                                            <Input
                                                                id="date"
                                                                type="date"
                                                                value={expenseData.date}
                                                                onChange={(e) => setExpenseData('date', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={expenseErrors.date} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="description">{t('Description')}</Label>
                                                        <Textarea
                                                            id="description"
                                                            value={expenseData.description}
                                                            onChange={(e) =>
                                                                setExpenseData('description', e.target.value)
                                                            }
                                                            rows={3}
                                                        />
                                                        <InputError message={expenseErrors.description} />
                                                    </div>
                                                    <div className="flex justify-end pt-4">
                                                        <Button type="submit" disabled={expenseProcessing}>
                                                            {expenseProcessing ? t('Saving...') : t('Save Expense')}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Add Expense')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] w-full overflow-y-auto rounded-none">
                            <div className="min-w-[800px]">
                                <DataTable
                                    data={projectExpenses || []}
                                    columns={[
                                        { key: 'name', header: t('Expense Name') },
                                        {
                                            key: 'amount',
                                            header: t('Amount'),
                                            render: (value: number) => (
                                                <span className="font-semibold text-foreground">
                                                    {formatCurrency(value)}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: 'date',
                                            header: t('Date'),
                                            render: (value: string) => (value ? formatDate(value) : '-'),
                                        },
                                        { key: 'description', header: t('Description') },
                                        {
                                            key: 'actions',
                                            header: t('Action'),
                                            render: (_: any, exp: any) => (
                                                <div className="flex gap-1">
                                                    {auth.user?.permissions?.includes('manage-project') && (
                                                        <Tooltip delayDuration={0}>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => deleteExpense(exp.id)}
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
                                    ]}
                                    className="rounded-none"
                                    emptyState={
                                        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                            <List className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                            <p>{t('No expenses recorded')}</p>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Activity */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="flex h-full flex-col shadow-sm">
                        <CardHeader className="bg-muted/50/50 border-b p-6">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-foreground" />
                                {t('Recent Activity')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col p-4">
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-96 flex-1 overflow-y-auto">
                                {activityLogs && activityLogs.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {activityLogs?.map((log) => {
                                            return (
                                                <div
                                                    key={log.id}
                                                    className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                                                >
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                                                        <Activity className="h-3 w-3 text-foreground" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div
                                                            className="line-clamp-2 text-xs font-medium text-foreground"
                                                            dangerouslySetInnerHTML={{ __html: log.remark }}
                                                        />
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {formatDate(log.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                        <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                        <p>{t('No recent activity')}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Project Files */}
                <div className="lg:col-span-1">
                    <div className="flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm">
                        <h4 className="mb-4 text-lg font-semibold text-foreground">{t('Files')}</h4>
                        <div className="mb-4">
                            <MediaPicker
                                value={imagesData.images}
                                onChange={(value) => {
                                    const items = Array.isArray(value) ? value : [value].filter(Boolean);
                                    if (items.length > 0) {
                                        const formData = { images: items };
                                        router.post(route('project.files.store', project.id), formData, {
                                            onSuccess: () => {
                                                setImagesData('images', []);
                                            },
                                        });
                                    }
                                }}
                                multiple={true}
                                placeholder={t('Select files')}
                                showPreview={false}
                                label=""
                            />
                            <InputError message={imagesErrors.images} />
                        </div>
                        {projectFiles && projectFiles.length > 0 ? (
                            <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-96 flex-1 space-y-2 overflow-y-auto">
                                {projectFiles?.map((file) => {
                                    const getFileIcon = (fileName: string) => {
                                        const ext = fileName.split('.').pop()?.toLowerCase();
                                        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
                                            return <Image className="h-5 w-5 text-foreground" />;
                                        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext || '')) {
                                            return <Video className="h-5 w-5 text-foreground" />;
                                        } else if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext || '')) {
                                            return <Music className="h-5 w-5 text-foreground" />;
                                        } else if (['txt', 'doc', 'docx', 'pdf', 'rtf'].includes(ext || '')) {
                                            return <FileText className="h-5 w-5 text-destructive" />;
                                        } else {
                                            return <File className="h-5 w-5 text-muted-foreground" />;
                                        }
                                    };

                                    const isImage = (fileName: string) => {
                                        const ext = fileName.split('.').pop()?.toLowerCase();
                                        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
                                    };

                                    let imageUrl = getImagePath(file.file_path);
                                    return (
                                        <div
                                            key={file.id}
                                            className="group flex items-center gap-3 rounded-lg border bg-muted/50 p-3 transition-colors hover:bg-muted"
                                        >
                                            <div className="flex-shrink-0">
                                                {isImage(file.file_path) ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={file.file_name}
                                                        className="h-10 w-10 rounded border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded border bg-card">
                                                        {getFileIcon(file.file_name)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className="truncate text-sm font-medium text-foreground"
                                                    title={file.file_name}
                                                >
                                                    {file.file_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {file.file_name.split('.').pop()?.toUpperCase()} file
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => window.open(imageUrl, '_blank')}
                                                                className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t('View')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => downloadFile(imageUrl)}
                                                                className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t('Download')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    router.delete(
                                                                        route('project.files.delete', file.id)
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t('Delete')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <File className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p className="text-sm">{t('No files uploaded yet')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Team Member')}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label required>{t('Users')}</Label>
                            <MultiSelect
                                options={teamMembers?.map((user) => ({ value: user.id.toString(), label: user.name }))}
                                value={data.user_ids?.map((id) => id.toString())}
                                onValueChange={(value) =>
                                    setData(
                                        'user_ids',
                                        value?.map((v) => parseInt(v))
                                    )
                                }
                                placeholder={t('Select users')}
                                searchable={true}
                            />
                            {errors.user_ids && <p className="mt-1 text-sm text-destructive">{errors.user_ids}</p>}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? t('Adding...') : t('Add')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Share To Client')}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleClientSubmit} className="space-y-4">
                        <div>
                            <Label required>{t('Clients')}</Label>
                            <MultiSelect
                                options={available_clients?.map((client) => ({
                                    value: client.id.toString(),
                                    label: client.name,
                                }))}
                                value={clientData.client_ids?.map((id) => id.toString())}
                                onValueChange={(value) =>
                                    setClientData(
                                        'client_ids',
                                        value?.map((v) => parseInt(v))
                                    )
                                }
                                placeholder={t('Select clients')}
                                searchable={true}
                            />
                            {clientErrors.client_ids && (
                                <p className="mt-1 text-sm text-destructive">{clientErrors.client_ids}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsClientModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={clientProcessing}>
                                {clientProcessing ? t('Inviting...') : t('Invite')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isMilestoneModalOpen} onOpenChange={setIsMilestoneModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Create Milestone')}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                        <div>
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="title">{t('Milestone Title')}</Label>
                                    <Input
                                        id="title"
                                        value={milestoneData.title}
                                        onChange={(e) => setMilestoneData('title', e.target.value)}
                                        placeholder={t('Enter milestone title')}
                                        className={milestoneErrors.title ? 'border-destructive' : ''}
                                        required
                                    />
                                    {milestoneErrors.title && (
                                        <p className="mt-1 text-sm text-destructive">{milestoneErrors.title}</p>
                                    )}
                                </div>
                                {milestoneCreateTitleAI?.map((field) => (
                                    <div key={field.id}>{field.component}</div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <CurrencyInput
                                id="cost"
                                required
                                label={t('Milestone Cost')}
                                value={milestoneData.cost}
                                onChange={(value) => setMilestoneData('cost', value)}
                                error={milestoneErrors.cost}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label required>{t('Start Date')}</Label>
                                <DatePicker
                                    value={milestoneData.start_date}
                                    onChange={(value) => setMilestoneData('start_date', value)}
                                    placeholder={t('Select start date')}
                                />
                                {milestoneErrors.start_date && (
                                    <p className="mt-1 text-sm text-destructive">{milestoneErrors.start_date}</p>
                                )}
                            </div>
                            <div>
                                <Label required>{t('End Date')}</Label>
                                <DatePicker
                                    value={milestoneData.end_date}
                                    onChange={(value) => setMilestoneData('end_date', value)}
                                    placeholder={t('Select end date')}
                                />
                                {milestoneErrors.end_date && (
                                    <p className="mt-1 text-sm text-destructive">{milestoneErrors.end_date}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label htmlFor="summary">{t('Summary')}</Label>
                                <div className="flex gap-2">
                                    {milestoneCreateSummaryAI?.map((field) => (
                                        <div key={field.id}>{field.component}</div>
                                    ))}
                                </div>
                            </div>
                            <Textarea
                                id="summary"
                                rows={3}
                                value={milestoneData.summary}
                                onChange={(e) => setMilestoneData('summary', e.target.value)}
                                placeholder={t('Enter summary')}
                                className={milestoneErrors.summary ? 'border-destructive' : ''}
                            />
                            {milestoneErrors.summary && (
                                <p className="mt-1 text-sm text-destructive">{milestoneErrors.summary}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsMilestoneModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={milestoneProcessing}>
                                {milestoneProcessing ? t('Creating...') : t('Create')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditMilestoneModalOpen} onOpenChange={setIsEditMilestoneModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Edit Milestone')}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleEditMilestoneSubmit} className="space-y-4">
                        <div>
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="edit-title">{t('Milestone Title')}</Label>
                                    <Input
                                        id="edit-title"
                                        value={editMilestoneData.title}
                                        onChange={(e) => setEditMilestoneData('title', e.target.value)}
                                        placeholder={t('Enter milestone title')}
                                        className={editMilestoneErrors.title ? 'border-destructive' : ''}
                                        required
                                    />
                                    {editMilestoneErrors.title && (
                                        <p className="mt-1 text-sm text-destructive">{editMilestoneErrors.title}</p>
                                    )}
                                </div>
                                {milestoneEditTitleAI?.map((field) => (
                                    <div key={field.id}>{field.component}</div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <CurrencyInput
                                id="edit-cost"
                                required
                                label={t('Milestone Cost')}
                                value={editMilestoneData.cost}
                                onChange={(value) => setEditMilestoneData('cost', value)}
                                error={editMilestoneErrors.cost}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label required>{t('Start Date')}</Label>
                                <DatePicker
                                    value={editMilestoneData.start_date}
                                    onChange={(value) => setEditMilestoneData('start_date', value)}
                                    placeholder={t('Select start date')}
                                />
                                {editMilestoneErrors.start_date && (
                                    <p className="mt-1 text-sm text-destructive">{editMilestoneErrors.start_date}</p>
                                )}
                            </div>
                            <div>
                                <Label required>{t('End Date')}</Label>
                                <DatePicker
                                    value={editMilestoneData.end_date}
                                    onChange={(value) => setEditMilestoneData('end_date', value)}
                                    placeholder={t('Select end date')}
                                />
                                {editMilestoneErrors.end_date && (
                                    <p className="mt-1 text-sm text-destructive">{editMilestoneErrors.end_date}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>{t('Status')}</Label>
                            <Select
                                value={editMilestoneData.status}
                                onValueChange={(value) => setEditMilestoneData('status', value)}
                            >
                                <SelectTrigger className={editMilestoneErrors.status ? 'border-destructive' : ''}>
                                    <SelectValue placeholder={t('Select status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Incomplete">{t('Incomplete')}</SelectItem>
                                    <SelectItem value="Complete">{t('Complete')}</SelectItem>
                                </SelectContent>
                            </Select>
                            {editMilestoneErrors.status && (
                                <p className="mt-1 text-sm text-destructive">{editMilestoneErrors.status}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-progress">
                                {t('Progress')} ({editMilestoneData.progress}%)
                            </Label>
                            <Slider
                                value={[editMilestoneData.progress]}
                                onValueChange={(value) => setEditMilestoneData('progress', value[0])}
                                max={100}
                                step={1}
                                className="mt-2"
                            />
                            {editMilestoneErrors.progress && (
                                <p className="mt-1 text-sm text-destructive">{editMilestoneErrors.progress}</p>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label htmlFor="edit-summary">{t('Summary')}</Label>
                                <div className="flex gap-2">
                                    {milestoneEditSummaryAI?.map((field) => (
                                        <div key={field.id}>{field.component}</div>
                                    ))}
                                </div>
                            </div>
                            <Textarea
                                id="edit-summary"
                                rows={3}
                                value={editMilestoneData.summary}
                                onChange={(e) => setEditMilestoneData('summary', e.target.value)}
                                placeholder={t('Enter summary')}
                                className={editMilestoneErrors.summary ? 'border-destructive' : ''}
                            />
                            {editMilestoneErrors.summary && (
                                <p className="mt-1 text-sm text-destructive">{editMilestoneErrors.summary}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditMilestoneModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={editMilestoneProcessing}>
                                {editMilestoneProcessing ? t('Updating...') : t('Update')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Remove Team Member')}
                message={t('Are you sure you want to remove {{name}} from this project?', {
                    name: deleteState.userName,
                })}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />

            <ConfirmationDialog
                open={deleteClientState.isOpen}
                onOpenChange={closeDeleteClientDialog}
                title={t('Remove Client')}
                message={t('Are you sure you want to remove {{name}} from this project?', {
                    name: deleteClientState.clientName,
                })}
                confirmText={t('Delete')}
                onConfirm={confirmDeleteClient}
                variant="destructive"
            />
            <ConfirmationDialog
                open={milestoneDeleteState.isOpen}
                onOpenChange={closeMilestoneDeleteDialog}
                title={t('Delete Milestone')}
                message={t('Are you sure you want to delete this milestone?')}
                confirmText={t('Delete')}
                onConfirm={confirmMilestoneDelete}
                variant="destructive"
            />

            <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Edit Project')}</DialogTitle>
                    </DialogHeader>

                    {projectEditData && (
                        <form onSubmit={handleEditProjectSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="edit_project_name">{t('Name')}</Label>
                                <Input
                                    id="edit_project_name"
                                    value={editProjectData.name}
                                    onChange={(e) => setEditProjectData('name', e.target.value)}
                                    placeholder={t('Enter project name')}
                                    className={editProjectErrors.name ? 'border-destructive' : ''}
                                    required
                                />
                                <InputError message={editProjectErrors.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label required>{t('Start Date')}</Label>
                                    <DatePicker
                                        value={editProjectData.start_date}
                                        onChange={(value) => setEditProjectData('start_date', value)}
                                        placeholder={t('Select start date')}
                                    />
                                    <InputError message={editProjectErrors.start_date} />
                                </div>
                                <div>
                                    <Label required>{t('End Date')}</Label>
                                    <DatePicker
                                        value={editProjectData.end_date}
                                        onChange={(value) => setEditProjectData('end_date', value)}
                                        placeholder={t('Select end date')}
                                    />
                                    <InputError message={editProjectErrors.end_date} />
                                </div>
                            </div>

                            <div>
                                <CurrencyInput
                                    label={t('Budget')}
                                    value={editProjectData.budget.toString()}
                                    onChange={(value) => setEditProjectData('budget', parseFloat(value) || 0)}
                                    error={editProjectErrors.budget}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit_project_status">{t('Status')}</Label>
                                <Select
                                    value={editProjectData.status}
                                    onValueChange={(value) => setEditProjectData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ongoing">{t('Ongoing')}</SelectItem>
                                        <SelectItem value="Onhold">{t('Onhold')}</SelectItem>
                                        <SelectItem value="Finished">{t('Finished')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={editProjectErrors.status} />
                            </div>

                            <div>
                                <Label htmlFor="edit_project_description">{t('Description')}</Label>
                                <Textarea
                                    id="edit_project_description"
                                    rows={3}
                                    value={editProjectData.description}
                                    onChange={(e) => setEditProjectData('description', e.target.value)}
                                    placeholder={t('Enter project description')}
                                    className={editProjectErrors.description ? 'border-destructive' : ''}
                                />
                                <InputError message={editProjectErrors.description} />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditProjectModalOpen(false)}
                                >
                                    {t('Cancel')}
                                </Button>
                                <Button type="submit" disabled={editProjectProcessing}>
                                    {editProjectProcessing ? t('Updating...') : t('Update')}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
