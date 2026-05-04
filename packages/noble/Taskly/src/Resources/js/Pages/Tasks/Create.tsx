import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import InputError from '@/components/ui/input-error';
import MediaPicker from '@/components/MediaPicker';
import { CreateProjectTaskFormData, Project, Milestone, TaskStage } from './types';
import { useFormFields } from '@/hooks/useFormFields';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
    Target,
    Users,
    Clock,
    Zap,
    ShieldAlert,
    Paperclip,
    Crosshair,
    ChevronRight,
    ChevronLeft,
    Info,
    Calendar as CalendarIcon,
} from 'lucide-react';

interface CreateProps {
    [key: string]: any;
    onSuccess: () => void;
    project?: Project;
    milestones: Milestone[];
    teamMembers: Array<{
        id: number;
        name: string;
    }>;
    taskStages?: TaskStage[];
    preSelectedStageId?: number;
}

type TabType = 'details' | 'allocation' | 'schedule';

export default function Create({
    onSuccess,
    project,
    milestones,
    teamMembers,
    taskStages = [],
    preSelectedStageId,
}: CreateProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('details');

    const { data, setData, post, processing, errors } = useForm<CreateProjectTaskFormData>({
        project_id: project?.id || 0,
        milestone_id: undefined,
        title: '',
        priority: 'Medium',
        assigned_to: [],
        duration: '',
        description: '',
        stage_id: preSelectedStageId || (taskStages.length > 0 ? taskStages[0].id : undefined),
        sync_to_google_calendar: false,
        sync_to_outlook_calendar: false,
        media_paths: [],
    });

    const calendarFields = useFormFields('getCalendarSyncFields', data, setData, errors, 'create', t, 'Taskly');
    const titleAI = useFormFields('aiField', data, setData, errors, 'create', 'title', 'Title', 'taskly', 'task');
    const descriptionAI = useFormFields(
        'aiField',
        data,
        setData,
        errors,
        'create',
        'description',
        'Description',
        'taskly',
        'task'
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('project.tasks.store'), {
            onSuccess: () => onSuccess(),
        });
    };

    const tabs = [
        { id: 'details', label: t('Task Details'), icon: Target, description: t('Core parameters') },
        { id: 'allocation', label: t('Assignment'), icon: Users, description: t('Priority & team') },
        { id: 'schedule', label: t('Schedule'), icon: Clock, description: t('Timeline & files') },
    ];

    const getProgressWidth = () => {
        switch (activeTab) {
            case 'details':
                return 'w-1/3';
            case 'allocation':
                return 'w-2/3';
            case 'schedule':
                return 'w-full';
            default:
                return 'w-0';
        }
    };

    return (
        <DialogContent className="glass-effect-dark max-w-3xl overflow-hidden border-white/10 p-0 shadow-2xl">
            <div className="flex h-full min-h-[550px]">
                {/* Sidebar Nav */}
                <div className="flex w-64 flex-col border-e border-white/5 bg-foreground/40 p-6">
                    <div className="mb-8">
                        <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/30 bg-foreground/20">
                            <Crosshair className="h-4 w-4 animate-pulse text-foreground" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-background">
                            {t('Create Task')}
                        </h2>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">
                            Sukoun Albunyan
                        </p>
                    </div>

                    <div className="flex-1 space-y-2">
                        {tabs?.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={cn(
                                    'group relative flex w-full flex-col overflow-hidden rounded-xl p-3 transition-all duration-300',
                                    activeTab === tab.id
                                        ? 'border border-foreground/20 bg-foreground/10 text-background'
                                        : 'border border-transparent text-muted-foreground hover:bg-card/5'
                                )}
                            >
                                <div className="mb-1 flex items-center gap-3">
                                    <tab.icon
                                        className={cn(
                                            'h-4 w-4 transition-transform group-hover:scale-110',
                                            activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'
                                        )}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {tab.label}
                                    </span>
                                </div>
                                <span className="ms-7 text-[8px] font-bold uppercase tracking-tighter opacity-40 group-hover:opacity-60">
                                    {tab.description}
                                </span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-3 start-0 top-3 w-0.5 rounded-full bg-foreground transition-all duration-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-white/5 pt-6">
                        <div className="rounded-xl border border-white/5 bg-card/[0.02] p-3">
                            <div className="mb-2 flex items-center gap-2">
                                <Info className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                    {t('Progress')}
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-card/5">
                                <div
                                    className={cn(
                                        'h-full bg-foreground transition-all duration-500 ease-in-out',
                                        getProgressWidth()
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col bg-foreground/20">
                    <DialogHeader className="border-b border-white/5 bg-card/[0.01] p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="group flex items-center gap-2 text-xl font-black uppercase tracking-widest text-background">
                                    {t('Create Task')}
                                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-foreground" />
                                </DialogTitle>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground opacity-50">
                                    {t('Project Context')}: {project?.name || t('Undefined Project')}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="h-5 border-foreground/20 bg-foreground/5 text-[8px] font-black uppercase tracking-widest text-foreground"
                            >
                                {t('Ready')}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden p-0">
                        <div className="custom-scrollbar relative flex-1 overflow-y-auto p-8">
                            {activeTab === 'details' && (
                                <div className="space-y-6 duration-300 animate-in fade-in slide-in-from-end-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1">
                                                    <Label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                        {t('Task Title')}
                                                    </Label>
                                                    <Input
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        placeholder={t('Enter task title...')}
                                                        required
                                                        className="h-11 border-white/10 bg-card/5 text-xs font-bold uppercase tracking-widest focus:border-foreground/50"
                                                    />
                                                    <InputError message={errors.title} />
                                                </div>
                                                {titleAI?.map((field: any) => (
                                                    <div key={field.id} className="pb-0.5">
                                                        {field.component}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {t('Milestone')}
                                            </Label>
                                            <Select
                                                value={data.milestone_id?.toString() || ''}
                                                onValueChange={(value) =>
                                                    setData('milestone_id', value ? parseInt(value) : undefined)
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-white/10 bg-card/5 text-xs font-bold uppercase tracking-widest">
                                                    <SelectValue placeholder={t('Select milestone')} />
                                                </SelectTrigger>
                                                <SelectContent className="glass-effect-dark border-white/10">
                                                    {milestones?.map((milestone) => (
                                                        <SelectItem
                                                            key={milestone.id}
                                                            value={milestone.id.toString()}
                                                            className="text-[10px] font-bold uppercase tracking-widest"
                                                        >
                                                            {milestone.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.milestone_id} />
                                        </div>

                                        <div>
                                            <Label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {t('Project')}
                                            </Label>
                                            <Input
                                                value={project?.name || ''}
                                                disabled
                                                className="h-11 border-white/5 bg-card/5 text-xs font-bold uppercase opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {t('Description')}
                                            </Label>
                                            <div className="flex gap-2">
                                                {descriptionAI?.map((field: any) => (
                                                    <div key={field.id}>{field.component}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <Textarea
                                            id="description"
                                            rows={5}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('Enter task description...')}
                                            required
                                            className="border-white/10 bg-card/5 text-[11px] font-medium leading-relaxed focus:border-foreground/50"
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'allocation' && (
                                <div className="space-y-8 duration-300 animate-in fade-in slide-in-from-end-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <Label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {t('Priority')}
                                            </Label>
                                            <Select
                                                value={data.priority}
                                                onValueChange={(value) =>
                                                    setData('priority', value as 'High' | 'Medium' | 'Low')
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-white/10 bg-card/5 text-xs font-bold uppercase tracking-widest">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="glass-effect-dark border-white/10">
                                                    <SelectItem
                                                        value="High"
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        {t('High')}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Medium"
                                                        className="text-muted-foreground focus:text-muted-foreground"
                                                    >
                                                        {t('Medium')}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="Low"
                                                        className="text-foreground focus:text-foreground"
                                                    >
                                                        {t('Low')}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.priority} />
                                        </div>

                                        <div>
                                            <Label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {t('Task Stage')}
                                            </Label>
                                            <Select
                                                value={data.stage_id?.toString() || ''}
                                                onValueChange={(value) =>
                                                    setData('stage_id', value ? parseInt(value) : undefined)
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-white/10 bg-card/5 text-xs font-bold uppercase tracking-widest">
                                                    <SelectValue placeholder={t('Select stage')} />
                                                </SelectTrigger>
                                                <SelectContent className="glass-effect-dark border-white/10">
                                                    {taskStages?.map((stage) => (
                                                        <SelectItem
                                                            key={stage.id}
                                                            value={stage.id.toString()}
                                                            className="text-[10px] font-bold uppercase tracking-widest"
                                                        >
                                                            {stage.name}
                                                        </SelectItem>
                                                    )) || []}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.stage_id} />
                                        </div>
                                    </div>

                                    <div className="space-y-4 rounded-2xl border border-white/5 bg-card/[0.02] p-6">
                                        <div className="mb-4 flex items-center gap-2">
                                            <Users className="h-4 w-4 text-foreground" />
                                            <Label className="m-0 text-[11px] font-black uppercase tracking-widest text-background">
                                                {t('Assigned To')}
                                            </Label>
                                        </div>
                                        <MultiSelect
                                            options={teamMembers?.map((member) => ({
                                                value: member.id.toString(),
                                                label: member.name,
                                            }))}
                                            value={data.assigned_to?.map((id) => id.toString()) || []}
                                            onValueChange={(values) =>
                                                setData(
                                                    'assigned_to',
                                                    values?.map((v) => parseInt(v))
                                                )
                                            }
                                            placeholder={t('Select team members...')}
                                            searchable={true}
                                            className="border-white/10 bg-transparent"
                                        />
                                        <p className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">
                                            * Selected members will be notified.
                                        </p>
                                        <InputError message={errors.assigned_to} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'schedule' && (
                                <div className="space-y-8 duration-300 animate-in fade-in slide-in-from-end-4">
                                    <div className="space-y-4 rounded-2xl border border-white/5 bg-card/[0.02] p-6">
                                        <div className="mb-4 flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <Label className="m-0 text-[11px] font-black uppercase tracking-widest text-background">
                                                {t('Duration')}
                                            </Label>
                                        </div>
                                        <DateRangePicker
                                            value={data.duration || ''}
                                            onChange={(value) => setData('duration', value)}
                                            placeholder={t('Select date range...')}
                                            className="h-11 border-white/10 bg-foreground/20"
                                        />
                                        <InputError message={errors.duration} />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                                            <Label className="m-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                {t('Attachments')}
                                            </Label>
                                        </div>
                                        <MediaPicker
                                            value={data.media_paths || []}
                                            onChange={(v: any) => setData('media_paths', v)}
                                            multiple={true}
                                        />
                                        <InputError message={errors.media_paths} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                        {calendarFields?.map((field: any) => (
                                            <div
                                                key={field.id}
                                                className="rounded-xl border border-white/5 bg-card/[0.02] p-3 transition-all hover:bg-card/[0.05]"
                                            >
                                                {field.component}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 bg-foreground/40 p-8">
                            <div>
                                {activeTab !== 'details' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setActiveTab(activeTab === 'schedule' ? 'allocation' : 'details')}
                                        className="group h-10 gap-2 rounded-xl border-white/5 px-6 hover:bg-card/10"
                                    >
                                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {t('Previous')}
                                        </span>
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onSuccess}
                                    className="h-10 px-6 text-muted-foreground hover:text-background"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {t('Cancel')}
                                    </span>
                                </Button>

                                {activeTab === 'schedule' ? (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="premium-button group h-10 px-10"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {t('Creating...')}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-4 w-4 transition-transform group-hover:scale-125" />
                                                <span className="text-[10px) font-black uppercase tracking-widest">
                                                    {t('Create Task')}
                                                </span>
                                            </div>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setActiveTab(activeTab === 'details' ? 'allocation' : 'schedule')}
                                        className="premium-button group h-10 px-10"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {t('Next')}
                                        </span>
                                        <ChevronRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DialogContent>
    );
}
