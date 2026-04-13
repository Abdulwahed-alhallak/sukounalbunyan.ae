import { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getImagePath } from '@/utils/helpers';
import { User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import ModuleAttachments from '@/components/ModuleAttachments';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { ProjectTask, Project, Milestone, TaskStage } from './types';
import axios from 'axios';
import { toast } from 'sonner';
import { Trash2, FileText, Download, Paperclip } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

interface ViewTaskProps {
    task: { id: number } | ProjectTask;
    project?: Project;
    milestones: Milestone[];
    teamMembers: Array<{ id: number; name: string }>;
    taskStages: TaskStage[];
}

export default function View({ task, project, milestones, teamMembers, taskStages }: ViewTaskProps) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;
    const [taskData, setTaskData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('comments');

    const refreshTask = () => {
        axios.get(route('project.tasks.show', task.id)).then((res) => setTaskData(res.data.task));
    };

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const response = await axios.get(route('project.tasks.show', task.id));
                setTaskData(response.data.task);
            } catch (error) {
                toast.error(t('Failed to load task data'));
            } finally {
                setLoading(false);
            }
        };

        fetchTaskData();
    }, [task.id]);

    if (loading) {
        return (
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('Task Details')}</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">{t('Loading task details...')}</p>
                </div>
            </DialogContent>
        );
    }

    if (!taskData) return null;

    // Find milestone
    const milestone = milestones.find((m) => m.id === taskData.milestone_id);

    // Find stage
    const stage = taskStages.find((s) => s.id === taskData.stage_id);

    const assignedUsers = taskData.assignedUsers || [];

    return (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{t('Task Details')}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
                {/* Title and Priority */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{taskData.title}</h3>
                    </div>
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            taskData.priority === 'Low'
                                ? 'bg-muted text-foreground'
                                : taskData.priority === 'Medium'
                                  ? 'bg-muted text-foreground'
                                  : taskData.priority === 'High'
                                    ? 'bg-muted text-destructive'
                                    : 'bg-muted text-destructive'
                        }`}
                    >
                        {t(taskData.priority)}
                    </span>
                </div>

                {/* Description */}
                {taskData.description && (
                    <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">{t('Description')}</h4>
                        <p className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                            {taskData.description}
                        </p>
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">{t('Project')}</h4>
                        <p className="text-sm text-foreground">{taskData.project?.name || project?.name || '-'}</p>
                    </div>

                    <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">{t('Milestone')}</h4>
                        <p className="text-sm text-foreground">{milestone?.title || '-'}</p>
                    </div>

                    <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">{t('Stage')}</h4>
                        {taskData.stage?.name ? (
                            <span
                                className="rounded-full px-2 py-1 text-sm"
                                style={{ backgroundColor: `${taskData.stage?.color || '#e5e7eb'}30`, color: '#374151' }}
                            >
                                {t(taskData.stage.name)}
                            </span>
                        ) : stage?.name ? (
                            <span
                                className="rounded-full px-2 py-1 text-sm"
                                style={{ backgroundColor: `${stage?.color || '#e5e7eb'}30`, color: '#374151' }}
                            >
                                {t(stage.name)}
                            </span>
                        ) : (
                            <span className="text-sm text-foreground">-</span>
                        )}
                    </div>

                    <div>
                        <h4 className="mb-2 text-sm font-medium text-foreground">{t('Duration')}</h4>
                        <p className="text-sm text-foreground">
                            {taskData.start_date && taskData.end_date
                                ? `${formatDate(taskData.start_date)} - ${formatDate(taskData.end_date)}`
                                : taskData.duration || '-'}
                        </p>
                    </div>
                </div>

                {/* Assigned Users */}
                <div>
                    <h4 className="mb-3 text-sm font-medium text-foreground">{t('Assigned To')}</h4>
                    {assignedUsers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {assignedUsers?.map((user, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
                                        {user.avatar ? (
                                            <img
                                                src={getImagePath(user.avatar)}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <span className="text-sm text-foreground">{user.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t('No users assigned')}</p>
                    )}
                </div>

                {/* Tabs Section */}
                {(auth.user?.permissions?.includes('manage-project-task-comments') ||
                    auth.user?.permissions?.includes('manage-project-subtask')) && (
                    <Tabs
                        defaultValue={
                            auth.user?.permissions?.includes('manage-project-task-comments') ? 'comments' : 'subtasks'
                        }
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList
                            className={`grid w-full ${
                                auth.user?.permissions?.includes('manage-project-task-comments') &&
                                auth.user?.permissions?.includes('manage-project-subtask')
                                    ? 'grid-cols-2'
                                    : 'grid-cols-1'
                            }`}
                        >
                            {auth.user?.permissions?.includes('manage-project-task-comments') && (
                                <TabsTrigger value="comments">{t('Comments')}</TabsTrigger>
                            )}
                            {auth.user?.permissions?.includes('manage-project-subtask') && (
                                <TabsTrigger value="subtasks">{t('Subtasks')}</TabsTrigger>
                            )}
                            {(auth.user?.roles?.includes('superadmin') || auth.user?.roles?.includes('company')) && (
                                <TabsTrigger value="timers">{t('Timers')}</TabsTrigger>
                            )}
                            <TabsTrigger value="attachments">{t('Attachments')}</TabsTrigger>
                        </TabsList>

                        {auth.user?.permissions?.includes('manage-project-task-comments') && (
                            <TabsContent value="comments" className="space-y-4">
                                <CommentsTab taskId={taskData.id} />
                            </TabsContent>
                        )}

                        {auth.user?.permissions?.includes('manage-project-subtask') && (
                            <TabsContent value="subtasks" className="space-y-4">
                                <SubtasksTab taskId={taskData.id} />
                            </TabsContent>
                        )}

                        <TabsContent value="timers" className="space-y-4">
                            <TimersTab taskId={taskData.id} />
                        </TabsContent>

                        <TabsContent value="attachments" className="space-y-4">
                            {activeTab === 'attachments' && (
                                <ModuleAttachments
                                    moduleId={taskData.id}
                                    attachments={taskData.attachments || []}
                                    deleteRoute="project.tasks.attachments.destroy"
                                    onRefresh={refreshTask}
                                    canDelete={auth.user?.permissions?.includes('delete-project-task')}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </DialogContent>
    );
}

function CommentsTab({ taskId }: { taskId: number }) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingComments, setLoadingComments] = useState(true);

    const [deleteState, setDeleteState] = useState({ isOpen: false, commentId: null, message: '' });

    const openDeleteDialog = (commentId: number) => {
        setDeleteState({
            isOpen: true,
            commentId,
            message: t('Are you sure you want to delete this comment?'),
        });
    };

    const closeDeleteDialog = () => {
        setDeleteState({ isOpen: false, commentId: null, message: '' });
    };

    const confirmDelete = async () => {
        if (!deleteState.commentId) return;

        try {
            const response = await axios.delete(route('project.tasks.comments.destroy', deleteState.commentId));
            if (response.data.message) {
                toast.success(t(response.data.message));
            }
            fetchComments();
            closeDeleteDialog();
        } catch (error) {
            toast.error(t('Failed to delete comment'));
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(route('project.tasks.comments.index', taskId));
            setComments(response.data.comments);
        } catch (error) {
            toast.error(t('Failed to load comments'));
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(route('project.tasks.comments.store', taskId), { comment });
            setComment('');
            if (response.data.message) {
                toast.success(t(response.data.message));
            }
            fetchComments();
        } catch (error) {
            toast.error(t('Failed to add comment'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <Label htmlFor="comment">{t('Add Comment')}</Label>
                    <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('Enter your comment...')}
                        rows={3}
                    />
                </div>
                <Button type="submit" disabled={loading || !comment.trim()}>
                    {loading ? t('Adding...') : t('Add Comment')}
                </Button>
            </form>

            {loadingComments ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">{t('Loading comments...')}</p>
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-3">
                    {comments?.map((comment) => (
                        <div key={comment.id} className="rounded-md bg-muted/50 p-3">
                            <div className="flex items-start justify-between">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
                                        {comment.user.avatar ? (
                                            <img
                                                src={getImagePath(comment.user.avatar)}
                                                alt={comment.user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-3 w-3 text-muted-foreground" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{comment.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                                {auth.user?.permissions?.includes('delete-project-task-comments') && (
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(comment.id)}
                                                    className="mt-1 h-6 w-6 p-0 text-destructive hover:text-destructive"
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
                            <p className="text-sm text-foreground">{comment.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">{t('No comments yet')}</p>
                </div>
            )}

            <ConfirmationDialog
                open={deleteState.isOpen}
                onOpenChange={closeDeleteDialog}
                title={t('Delete Comment')}
                message={deleteState.message}
                confirmText={t('Delete')}
                onConfirm={confirmDelete}
                variant="destructive"
            />
        </div>
    );
}

function SubtasksTab({ taskId }: { taskId: number }) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [subtasks, setSubtasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSubtasks, setLoadingSubtasks] = useState(true);

    const fetchSubtasks = async () => {
        try {
            const response = await axios.get(route('project.tasks.subtasks.index', taskId));
            setSubtasks(response.data.subtasks);
        } catch (error) {
            toast.error(t('Failed to load subtasks'));
        } finally {
            setLoadingSubtasks(false);
        }
    };

    useEffect(() => {
        fetchSubtasks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const response = await axios.post(route('project.tasks.subtasks.store', taskId), {
                name,
                due_date: dueDate || null,
            });
            setName('');
            setDueDate('');
            if (response.data.message) {
                toast.success(t(response.data.message));
            }
            fetchSubtasks();
        } catch (error) {
            toast.error(t('Failed to add subtask'));
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (subtaskId: number) => {
        try {
            await axios.patch(route('project.tasks.subtasks.toggle', subtaskId));
            fetchSubtasks();
        } catch (error) {
            toast.error(t('Failed to update subtask'));
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="subtask-name">{t('Subtask Name')}</Label>
                        <Input
                            id="subtask-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('Enter subtask name...')}
                        />
                    </div>
                    <div>
                        <Label>{t('Due Date')}</Label>
                        <DatePicker
                            value={dueDate}
                            onChange={(value) => setDueDate(value)}
                            placeholder={t('Select due date')}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={loading || !name.trim()}>
                    {loading ? t('Adding...') : t('Add Subtask')}
                </Button>
            </form>

            {loadingSubtasks ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">{t('Loading subtasks...')}</p>
                </div>
            ) : subtasks.length > 0 ? (
                <div className="space-y-3">
                    {subtasks?.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
                            <Checkbox checked={subtask.is_completed} onCheckedChange={() => handleToggle(subtask.id)} />
                            <div className="flex-1">
                                <p
                                    className={`text-sm ${subtask.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                                >
                                    {subtask.name}
                                </p>
                                {subtask.due_date && (
                                    <p className="text-xs text-muted-foreground">
                                        {t('Due')}: {formatDate(subtask.due_date)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">{t('No subtasks yet')}</p>
                </div>
            )}
        </div>
    );
}

export function TimersTab({ taskId }: { taskId: number }) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;
    const [timers, setTimers] = useState<any[]>([]);
    const [loadingTimers, setLoadingTimers] = useState(true);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const fetchTimers = async () => {
        try {
            const response = await axios.get(route('project.tasks.timers.index', taskId));
            setTimers(response.data.timers);
            setTotalDuration(response.data.total_duration);

            // Check if user has active timer
            const active = response.data.timers.find((ti: any) => ti.user?.id === auth.user?.id && !ti.end_time);
            setIsTimerRunning(!!active);
        } catch (error) {
            toast.error(t('Failed to load timers'));
        } finally {
            setLoadingTimers(false);
        }
    };

    useEffect(() => {
        fetchTimers();
    }, []);

    const toggleTimer = async () => {
        try {
            if (isTimerRunning) {
                await axios.post(route('project.tasks.timers.stop', taskId));
                toast.success(t('Timer stopped'));
            } else {
                await axios.post(route('project.tasks.timers.start', taskId));
                toast.success(t('Timer started'));
            }
            fetchTimers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || t('Failed to toggle timer'));
        }
    };

    const formatSeconds = (seconds: number) => {
        if (!seconds) return '0h 0m';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/50 p-4">
                <div>
                    <h4 className="font-semibold text-foreground">{t('Time Tracking')}</h4>
                    <p className="text-sm text-muted-foreground">
                        {t('Total time logged:')}{' '}
                        <span className="font-bold text-primary">{formatSeconds(totalDuration)}</span>
                    </p>
                </div>
                <Button
                    onClick={toggleTimer}
                    variant={isTimerRunning ? 'destructive' : 'default'}
                    className="gap-2 shadow-sm"
                >
                    {isTimerRunning ? (
                        <>
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
                            </span>
                            {t('Stop Timer')}
                        </>
                    ) : (
                        t('Start Timer')
                    )}
                </Button>
            </div>

            {loadingTimers ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">{t('Loading timers...')}</p>
                </div>
            ) : timers.length > 0 ? (
                <div className="space-y-3">
                    {timers.map((timer) => (
                        <div
                            key={timer.id}
                            className="flex items-center justify-between rounded-md border bg-card p-3 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-muted">
                                    {timer.user?.avatar ? (
                                        <img
                                            src={getImagePath(timer.user.avatar)}
                                            alt={timer.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{timer.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(timer.start_time)}
                                        {timer.end_time
                                            ? ` - ${formatDate(timer.end_time).split(' ')[1]}`
                                            : ' (' + t('Running') + ')'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge
                                    variant={timer.end_time ? 'outline' : 'default'}
                                    className={!timer.end_time ? 'animate-pulse' : ''}
                                >
                                    {timer.end_time ? formatSeconds(timer.duration_seconds) : t('Running...')}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed bg-muted/20 py-8 text-center text-muted-foreground">
                    <p>{t('No time logged yet')}</p>
                    <p className="mt-1 text-xs">{t('Click Start Timer to begin tracking')}</p>
                </div>
            )}
        </div>
    );
}
