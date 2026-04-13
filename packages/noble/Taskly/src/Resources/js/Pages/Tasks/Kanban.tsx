import { useState, useCallback, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Plus, Calendar, Edit, Trash2, MoreVertical, Users, List, Eye, User, ShieldAlert, Zap, Target } from 'lucide-react';
import { getImagePath } from '@/utils/helpers';
import KanbanBoard, { KanbanTask, KanbanColumn } from '@/components/kanban-board';
import Create from './Create';
import EditTask from './Edit';
import ViewTask from './View';
import { formatDate } from '@/utils/helpers';
import { usePageButtons } from '@/hooks/usePageButtons';

interface Project {
    id: number;
    name: string;
}

interface TasksByStatus {
    [key: string]: KanbanTask[];
}

interface KanbanProps {
    project: Project;
    stages: Array<{ id: number; name: string; color: string; order: number; }>;
    tasks: TasksByStatus;
    milestones: Array<{ id: number; title: string; }>;
    teamMembers: Array<{ id: number; name: string; }>;
    taskStages: Array<{ id: number; name: string; color: string; }>;
    auth: { user?: { permissions?: string[] } };
    [key: string]: any;
}

type ModalMode = 'add' | 'edit' | 'view';

interface ModalState {
    isOpen: boolean;
    mode: ModalMode | '';
    data: KanbanTask | null;
    preSelectedStage?: number;
}

export default function Kanban() {
    const { t } = useTranslation();
    const { project, stages, tasks, milestones, teamMembers, taskStages, auth } = usePage<KanbanProps>().props;

    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        mode: '',
        data: null
    });

    const [deleteState, setDeleteState] = useState({ isOpen: false, taskId: null as number | null });

    const openDeleteDialog = (taskId: number) => {
        setDeleteState({ isOpen: true, taskId });
    };

    const closeDeleteDialog = () => {
        setDeleteState({ isOpen: false, taskId: null });
    };

    const googleDriveButtons = usePageButtons('googleDriveBtn', { module: 'Project Task', settingKey: 'GoogleDrive Task' });
    const oneDriveButtons = usePageButtons('oneDriveBtn', { module: 'Task', settingKey: 'OneDrive Task' });
    const dropboxBtn = usePageButtons('dropboxBtn', { module: 'Project Task', settingKey: 'Dropbox Project Task' });

    const confirmDelete = async () => {
        if (deleteState.taskId) {
            try {
                await axios.delete(route('project.tasks.destroy', deleteState.taskId));
                refreshTasks();
                closeDeleteDialog();
                toast.success(t('The task has been deleted successfully.'));
            } catch (error) {
                toast.error(t('Failed to delete task'));
            }
        }
    };

    const handleMove = async (taskId: number, fromStatus: string, toStatus: string) => {
        const stageId = stages.find(stage => stage.name.toLowerCase().replace(/\s+/g, '-') === toStatus)?.id;
        if (stageId) {
            try {
                const response = await axios.patch(route('project.tasks.move', taskId), { stage_id: stageId });
                refreshTasks();
                if (response.data.message) {
                    toast.success(t(response.data.message));
                }
            } catch (error) {
                console.error('Failed to move task:', error);
                toast.error(t('Failed to update task sequence'));
            }
        }
    };

    const openModal = (mode: ModalMode, data: KanbanTask | null = null) => {
        setModalState({ isOpen: true, mode, data });
    };

    const [currentTasks, setCurrentTasks] = useState(tasks);

    const refreshTasks = useCallback(async () => {
        try {
            const response = await axios.get(route('project.tasks.api', project.id));
            setCurrentTasks(response.data.tasks || tasks);
        } catch (error) {
            setCurrentTasks(tasks);
        }
    }, [project.id, tasks]);

    const handleTaskCreated = () => {
        setModalState({ isOpen: false, mode: '', data: null });
        router.reload();
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: '', data: null });
    };

    useEffect(() => {
        setCurrentTasks(tasks);
    }, [tasks]);

    const getPriorityStyle = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': 
            case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'medium': return 'bg-muted-foreground/10 text-muted-foreground border-border/20';
            case 'low': return 'bg-foreground/10 text-foreground border-foreground/20';
            default: return 'bg-muted/500/10 text-muted-foreground border-border/20';
        }
    };

    const TaskCard = ({ task }: { task: KanbanTask }) => {
        const handleDragStart = (e: React.DragEvent) => {
            e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id }));
            e.dataTransfer.effectAllowed = 'move';
        };

        return (
            <div
                className="premium-card bg-foreground/40 backdrop-blur-3xl border border-white/5 p-4 hover:bg-card/[0.05] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-grab active:cursor-grabbing group shadow-xl"
                draggable={true}
                onDragStart={handleDragStart}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1 pr-4 min-w-0 flex-1">
                        <h4 className="font-black text-[11px] uppercase tracking-tight text-background/90 truncate leading-relaxed">
                            {task.title}
                        </h4>
                        {task.milestone && (
                            <div className="flex items-center gap-1.5 opacity-60">
                                <Target className="h-2.5 w-2.5 text-muted-foreground" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground truncate">
                                    {task.milestone}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {(auth.user?.permissions?.includes('view-project-task') ||
                      auth.user?.permissions?.includes('edit-project-task') ||
                      auth.user?.permissions?.includes('delete-project-task')) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-card/10 transition-all">
                                    <MoreVertical className="h-3 w-3 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-effect-dark border-white/10">
                                {auth.user?.permissions?.includes('view-project-task') && (
                                    <DropdownMenuItem onClick={() => openModal('view', task)} className="text-[10px] font-black uppercase tracking-widest gap-2">
                                        <Eye className="h-3 w-3" />
                                        {t('View Vector')}
                                    </DropdownMenuItem>
                                )}
                                {auth.user?.permissions?.includes('edit-project-task') && (
                                    <DropdownMenuItem onClick={() => openModal('edit', task)} className="text-[10px] font-black uppercase tracking-widest gap-2">
                                        <Edit className="h-3 w-3" />
                                        {t('Modify Protocol')}
                                    </DropdownMenuItem>
                                )}
                                {auth.user?.permissions?.includes('delete-project-task') && (
                                    <DropdownMenuItem onClick={() => openDeleteDialog(task.id)} className="text-[10px] font-black uppercase tracking-widest gap-2 text-destructive hover:!text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-3 w-3" />
                                        {t('Purge Record')}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {task.priority && (
                        <Badge className={`text-[8px] font-black uppercase tracking-widest px-2 py-0 h-4 border ${getPriorityStyle(task.priority)}`}>
                            {t(task.priority)}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex -space-x-2">
                        {task.assigned_users && task.assigned_users.length > 0 ? (
                            task.assigned_users.slice(0, 3)?.map((user: any, index: number) => (
                                <TooltipProvider key={index}>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <div className="h-6 w-6 rounded-lg border-2 border-border overflow-hidden bg-card flex items-center justify-center ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-300">
                                                {user.avatar ? (
                                                    <img src={getImagePath(user.avatar)} alt={user.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-2.5 w-2.5 text-muted-foreground" />
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="glass-effect border-white/10">
                                            <p className="text-[10px] font-black uppercase tracking-widest">{user.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))
                        ) : (
                            <div className="h-6 w-6 rounded-lg bg-card/5 border border-white/5 flex items-center justify-center">
                                <User className="h-2.5 w-2.5 text-foreground" />
                            </div>
                        )}
                        {task.assigned_users && task.assigned_users.length > 3 && (
                            <div className="h-6 w-6 rounded-lg bg-card border-2 border-border flex items-center justify-center">
                                <span className="text-[8px] font-black text-muted-foreground">+{task.assigned_users.length - 3}</span>
                            </div>
                        )}
                    </div>

                    {task.due_date && (
                        <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
                                {task.due_date.includes(' - ') ? task.due_date.split(' - ')[1].trim() : task.due_date}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Project'), url: route('project.index') },
                { label: project.name, url: route('project.show', project.id) },
                { label: t('Mission Matrix') }
            ]}
            pageTitle={t('Mission Execution Board')}
            pageActions={
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 mr-2">
                        {googleDriveButtons?.map((button) => <div key={button.id} className="opacity-70 hover:opacity-100 transition-opacity">{button.component}</div>)}
                        {oneDriveButtons?.map((button) => <div key={button.id} className="opacity-70 hover:opacity-100 transition-opacity">{button.component}</div>)}
                        {dropboxBtn?.map((button) => <div key={button.id} className="opacity-70 hover:opacity-100 transition-opacity">{button.component}</div>)}
                    </div>
                    
                    <div className="h-8 w-px bg-card/10 mx-2" />
                    
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('manage-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" variant="outline" className="premium-button border-white/10 hover:bg-card/10"
                                        onClick={() => router.get(route('project.tasks.index', { project_id: project.id }))}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="glass-effect-dark border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest">{t('Switch to Grid')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {auth.user?.permissions?.includes('create-project-task') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" className="premium-button px-6" onClick={() => openModal('add')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('Deploy Task')}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="glass-effect-dark border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest">{t('Deploy New Vector')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Mission Board')} />

            <div className="mt-6">
                <KanbanBoard
                    tasks={currentTasks}
                    columns={stages?.map(stage => ({
                        id: stage.name.toLowerCase().replace(/\s+/g, '-'),
                        title: stage.name,
                        color: stage.color
                    }))}
                    onMove={handleMove}
                    taskCard={TaskCard}
                    kanbanActions={(columnId: string) => {
                        const stage = stages.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === columnId);
                        return auth.user?.permissions?.includes('create-project-task') ? (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-card/10 rounded-lg text-muted-foreground hover:text-background transition-all"
                                            onClick={() => {
                                                setModalState({
                                                    isOpen: true,
                                                    mode: 'add',
                                                    data: null,
                                                    preSelectedStage: stage?.id
                                                });
                                            }}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="glass-effect-dark border-white/10">
                                        <p className="text-[8px] font-black uppercase tracking-widest">{t('Quick Deploy')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : null;
                    }}
                />
            </div>

            <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
                {modalState.mode === 'add' && (
                    <Create
                        onSuccess={handleTaskCreated}
                        project={project}
                        milestones={milestones}
                        teamMembers={teamMembers}
                        taskStages={taskStages}
                        preSelectedStageId={modalState.preSelectedStage}
                    />
                )}
                {modalState.mode === 'edit' && modalState.data && (
                    <EditTask
                        onSuccess={() => {
                            closeModal();
                            refreshTasks();
                        }}
                        task={modalState.data}
                        project={project}
                        milestones={milestones}
                        teamMembers={teamMembers}
                        taskStages={taskStages}
                    />
                )}
                {modalState.mode === 'view' && modalState.data && (
                    <ViewTask
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
                title={t('Terminate Mission Vector')}
                message={t('Are you sure you want to purge this task? This action is irrevocable.')}
                confirmText={t('Purge')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}

const Clock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);
