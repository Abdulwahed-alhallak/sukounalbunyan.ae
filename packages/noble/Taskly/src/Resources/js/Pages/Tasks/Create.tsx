import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelectEnhanced } from '@/components/ui/multi-select-enhanced';
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
    Calendar as CalendarIcon
} from 'lucide-react';

interface CreateProps {
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

type TabType = 'intel' | 'allocation' | 'temporal';

export default function Create({ onSuccess, project, milestones, teamMembers, taskStages = [], preSelectedStageId }: CreateProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('intel');

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
    const descriptionAI = useFormFields('aiField', data, setData, errors, 'create', 'description', 'Description', 'taskly', 'task');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('project.tasks.store'), {
            onSuccess: () => onSuccess()
        });
    };

    const tabs = [
        { id: 'intel', label: t('Mission Intel'), icon: Target, description: t('Core parameters') },
        { id: 'allocation', label: t('Strategic Allocation'), icon: Users, description: t('Resource distribution') },
        { id: 'temporal', label: t('Temporal Support'), icon: Clock, description: t('Execution window') }
    ];

    const getProgressWidth = () => {
        switch (activeTab) {
            case 'intel': return 'w-1/3';
            case 'allocation': return 'w-2/3';
            case 'temporal': return 'w-full';
            default: return 'w-0';
        }
    };

    return (
        <DialogContent className="max-w-3xl glass-effect-dark border-white/10 p-0 overflow-hidden shadow-2xl">
            <div className="flex h-full min-h-[550px]">
                {/* Sidebar Nav */}
                <div className="w-64 border-r border-white/5 bg-foreground/40 p-6 flex flex-col">
                    <div className="mb-8">
                        <div className="h-8 w-8 rounded-lg bg-foreground/20 border border-foreground/30 flex items-center justify-center mb-4">
                            <Crosshair className="h-4 w-4 text-foreground animate-pulse" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-background">{t('Deploy Vector')}</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 opacity-60 tracking-tighter">System: Noble Architecture Operational Core</p>
                    </div>

                    <div className="space-y-2 flex-1">
                        {tabs?.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={cn(
                                    "w-full flex flex-col p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    activeTab === tab.id 
                                        ? "bg-foreground/10 border border-foreground/20 text-background" 
                                        : "hover:bg-card/5 text-muted-foreground border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <tab.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-foreground" : "text-muted-foreground")} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                                </div>
                                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-40 group-hover:opacity-60 ml-7">{tab.description}</span>
                                {activeTab === tab.id && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-foreground rounded-full transition-all duration-500" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="p-3 rounded-xl bg-card/[0.02] border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{t('Protocol Status')}</span>
                            </div>
                            <div className="h-1.5 w-full bg-card/5 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full bg-foreground transition-all duration-500 ease-in-out", getProgressWidth())}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col bg-foreground/20">
                    <DialogHeader className="p-8 border-b border-white/5 bg-card/[0.01]">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-xl font-black uppercase tracking-widest text-background group flex items-center gap-2">
                                    {t('Mission Configuration')}
                                    <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-ping" />
                                </DialogTitle>
                                <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground mt-1 opacity-50">Operational Anchor: {project?.name || 'Undefined Project'}</p>
                            </div>
                            <Badge variant="outline" className="bg-foreground/5 border-foreground/20 text-foreground text-[8px] font-black uppercase tracking-widest h-5">
                                {t('Directives Authorized')}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submit} className="flex-1 flex flex-col p-0 overflow-hidden">
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
                            {activeTab === 'intel' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <div className="flex gap-2 items-end">
                                                <div className="flex-1">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">{t('Mission Payload (Title)')}</Label>
                                                    <Input
                                                        value={data.title}
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        placeholder={t('Enter operational title...')}
                                                        required
                                                        className="h-11 bg-card/5 border-white/10 focus:border-foreground/50 text-xs font-bold uppercase tracking-widest"
                                                    />
                                                    <InputError message={errors.title} />
                                                </div>
                                                {titleAI?.map(field => <div key={field.id} className="pb-0.5">{field.component}</div>)}
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">{t('Target Milestone')}</Label>
                                            <Select value={data.milestone_id?.toString() || ''} onValueChange={(value) => setData('milestone_id', value ? parseInt(value) : undefined)}>
                                                <SelectTrigger className="h-11 bg-card/5 border-white/10 text-xs font-bold uppercase tracking-widest">
                                                    <SelectValue placeholder={t('Anchor point')} />
                                                </SelectTrigger>
                                                <SelectContent className="glass-effect-dark border-white/10">
                                                    {milestones?.map((milestone) => (
                                                        <SelectItem key={milestone.id} value={milestone.id.toString()} className="text-[10px] font-bold uppercase tracking-widest">
                                                            {milestone.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.milestone_id} />
                                        </div>

                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">{t('Operating Sector')}</Label>
                                            <Input value={project?.name || ''} disabled className="h-11 bg-card/5 border-white/5 text-xs font-bold uppercase opacity-50" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Tactical Briefing (Description)')}</Label>
                                            <div className="flex gap-2">
                                                {descriptionAI?.map(field => <div key={field.id}>{field.component}</div>)}
                                            </div>
                                        </div>
                                        <Textarea
                                            id="description"
                                            rows={5}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder={t('Define vector objectives and execution parameters...')}
                                            required
                                            className="bg-card/5 border-white/10 focus:border-foreground/50 text-[11px] font-medium leading-relaxed"
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'allocation' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">{t('Operational Priority')}</Label>
                                            <Select value={data.priority} onValueChange={(value) => setData('priority', value as 'High' | 'Medium' | 'Low')}>
                                                <SelectTrigger className="h-11 bg-card/5 border-white/10 text-xs font-bold uppercase tracking-widest">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="glass-effect-dark border-white/10">
                                                    <SelectItem value="High" className="text-destructive focus:text-destructive">{t('High Velocity')}</SelectItem>
                                                    <SelectItem value="Medium" className="text-muted-foreground focus:text-muted-foreground">{t('Standard Op')}</SelectItem>
                                                    <SelectItem value="Low" className="text-foreground focus:text-foreground">{t('Low Sustain')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.priority} />
                                        </div>

                                        <div>
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">{t('Mission Stage')}</Label>
                                            <Select value={data.stage_id?.toString() || ''} onValueChange={(value) => setData('stage_id', value ? parseInt(value) : undefined)}>
                                                <SelectTrigger className="h-11 bg-card/5 border-white/10 text-xs font-bold uppercase tracking-widest">
                                                    <SelectValue placeholder={t('Current Vector State')} />
                                                </SelectTrigger>
                                                <SelectContent className="glass-effect-dark border-white/10">
                                                    {taskStages?.map((stage) => (
                                                        <SelectItem key={stage.id} value={stage.id.toString()} className="text-[10px] font-bold uppercase tracking-widest">
                                                            {stage.name}
                                                        </SelectItem>
                                                    )) || []}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.stage_id} />
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-card/[0.02] border border-white/5 space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Users className="h-4 w-4 text-foreground" />
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-background m-0">{t('Field Operatives')}</Label>
                                        </div>
                                        <MultiSelectEnhanced
                                            options={teamMembers?.map(member => ({
                                                value: member.id.toString(),
                                                label: member.name
                                            }))}
                                            value={data.assigned_to?.map(id => id.toString()) || []}
                                            onValueChange={(values) => setData('assigned_to', values?.map(v => parseInt(v)))}
                                            placeholder={t('Assign mission personnel...')}
                                            searchable={true}
                                            className="bg-transparent border-white/10"
                                        />
                                        <p className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">* Selected operatives will receive immediate deployment notification.</p>
                                        <InputError message={errors.assigned_to} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'temporal' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="p-6 rounded-2xl bg-card/[0.02] border border-white/5 space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-background m-0">{t('Engagement Window')}</Label>
                                        </div>
                                        <DateRangePicker
                                            value={data.duration || ''}
                                            onChange={(value) => setData('duration', value)}
                                            placeholder={t('Select operational timeframe...')}
                                            className="bg-foreground/20 border-white/10 h-11"
                                        />
                                        <InputError message={errors.duration} />
                                    </div>

                                    <div className="space-y-4">
                                       <div className="flex items-center gap-2 mb-2">
                                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground m-0">{t('Tactical Payload (Attachments)')}</Label>
                                       </div>
                                       <MediaPicker 
                                           value={data.media_paths || []} 
                                           onChange={(v) => setData('media_paths', v)} 
                                           multiple={true}
                                       />
                                       <InputError message={errors.media_paths} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        {calendarFields?.map((field) => (
                                            <div key={field.id} className="p-3 rounded-xl bg-card/[0.02] border border-white/5 hover:bg-card/[0.05] transition-all">
                                                {field.component}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-white/5 bg-foreground/40 flex justify-between items-center">
                            <div>
                                {activeTab !== 'intel' && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setActiveTab(activeTab === 'temporal' ? 'allocation' : 'intel')}
                                        className="border-white/5 hover:bg-card/10 gap-2 h-10 px-6 rounded-xl group"
                                    >
                                        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('Previous Sector')}</span>
                                    </Button>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={onSuccess}
                                    className="text-muted-foreground hover:text-background h-10 px-6"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('Abort')}</span>
                                </Button>
                                
                                {activeTab === 'temporal' ? (
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="premium-button px-10 h-10 group"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('Deploying...')}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-4 w-4 group-hover:scale-125 transition-transform" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('Deploy Vector')}</span>
                                            </div>
                                        )}
                                    </Button>
                                ) : (
                                    <Button 
                                        type="button" 
                                        onClick={() => setActiveTab(activeTab === 'intel' ? 'allocation' : 'temporal')}
                                        className="premium-button px-10 h-10 group"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t('Next Sector')}</span>
                                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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

