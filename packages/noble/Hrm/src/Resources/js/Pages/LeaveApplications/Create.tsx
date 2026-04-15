import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import MediaPicker from '@/components/MediaPicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormFields } from '@/hooks/useFormFields';
import { CreateLeaveApplicationProps, CreateLeaveApplicationFormData } from './types';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar,
    User,
    FileText,
    Paperclip,
    Zap,
    ShieldAlert,
    Clock,
    Activity,
    ChevronRight,
    PlaneTakeoff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function Create({ onSuccess }: CreateLeaveApplicationProps) {
    const { employees, leavetypes } = usePage<any>().props;
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm<CreateLeaveApplicationFormData>({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        attachment_ids: [],
        sync_to_google_calendar: false,
    });

    const calendarFields = useFormFields('createCalendarSyncField', data, setData, errors, 'create', t, 'Hrm');
    const [leaveBalance, setLeaveBalance] = useState<any>(null);
    const [totalDays, setTotalDays] = useState(0);
    const reasonAI = useFormFields(
        'aiField',
        data,
        setData,
        errors,
        'create',
        'reason',
        'Reason',
        'hrm',
        'leave_application'
    );

    useEffect(() => {
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setTotalDays(diffDays);
        } else {
            setTotalDays(0);
        }
    }, [data.start_date, data.end_date]);

    useEffect(() => {
        if (data.employee_id && data.leave_type_id) {
            axios
                .get(route('hrm.leave-balance', [data.employee_id, data.leave_type_id]))
                .then((response) => {
                    setLeaveBalance(response.data);
                })
                .catch(() => {
                    setLeaveBalance(null);
                });
        } else {
            setLeaveBalance(null);
        }
    }, [data.employee_id, data.leave_type_id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('hrm.leave-applications.store'), {
            onSuccess: () => onSuccess(),
        });
    };

    return (
        <DialogContent className="glass-effect-dark max-w-2xl overflow-hidden border-white/10 p-0 shadow-2xl">
            <DialogHeader className="border-b border-white/5 bg-card/[0.02] p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-foreground/30 bg-foreground/20">
                            <PlaneTakeoff className="h-6 w-6 animate-pulse text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-widest text-background">
                                {t('Operational Leave Request')}
                            </DialogTitle>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground opacity-60">
                                {t('Secure Authorization Protocols Active')}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="h-6 border-foreground/20 bg-foreground/5 px-3 text-[8px] font-black uppercase tracking-widest text-foreground"
                    >
                        {t('Incursion-04')}
                    </Badge>
                </div>
            </DialogHeader>

            <form onSubmit={submit} className="custom-scrollbar max-h-[70vh] space-y-8 overflow-y-auto p-8">
                <div className="grid grid-cols-2 gap-8">
                    {/* Operative Selection */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <User className="h-3 w-3 text-foreground" />
                            {t('Target Operative')}
                        </Label>
                        <Select
                            value={data.employee_id?.toString() || ''}
                            onValueChange={(value) => setData('employee_id', value)}
                            required
                        >
                            <SelectTrigger className="h-12 border-white/10 bg-card/5 text-xs font-black uppercase tracking-widest">
                                <SelectValue placeholder={t('Identify Agent')} />
                            </SelectTrigger>
                            <SelectContent className="glass-effect-dark border-white/10">
                                {employees?.map((item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                        className="text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.employee_id} />
                    </div>

                    {/* Leave Type */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <ShieldAlert className="h-3 w-3 text-muted-foreground" />
                            {t('Protocol Category')}
                        </Label>
                        <Select
                            value={data.leave_type_id?.toString() || ''}
                            onValueChange={(value) => setData('leave_type_id', value)}
                            required
                        >
                            <SelectTrigger className="h-12 border-white/10 bg-card/5 text-xs font-black uppercase tracking-widest">
                                <SelectValue placeholder={t('Select Leave Vector')} />
                            </SelectTrigger>
                            <SelectContent className="glass-effect-dark border-white/10">
                                {leavetypes?.map((item: any) => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id.toString()}
                                        className="text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.leave_type_id} />
                    </div>
                </div>

                {leaveBalance && (
                    <div className="group relative overflow-hidden rounded-2xl border border-foreground/20 bg-foreground/5 p-6 duration-500 animate-in fade-in slide-in-from-top-4">
                        <div className="absolute end-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                            <Activity className="h-16 w-16 text-foreground" />
                        </div>
                        <div className="relative z-10">
                            <div className="mb-4 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-foreground" />
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-background">
                                    {t('Resource Capacity Gauge')}
                                </h4>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Authorized Units')}
                                    </p>
                                    <p className="text-xl font-black text-background">
                                        {leaveBalance.total_leaves}{' '}
                                        <span className="text-[10px] uppercase text-muted-foreground">D</span>
                                    </p>
                                </div>
                                <div className="space-y-1 border-x border-white/5 px-6">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Available Margin')}
                                    </p>
                                    <p className="text-xl font-black text-foreground">
                                        {leaveBalance.available_leaves}{' '}
                                        <span className="text-[10px] uppercase opacity-60">D</span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                        {t('Depleted Units')}
                                    </p>
                                    <p className="text-xl font-black text-destructive">
                                        {leaveBalance.used_leaves}{' '}
                                        <span className="text-[10px] uppercase opacity-60">D</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-card/5">
                                <div
                                    className="h-full bg-foreground transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${(leaveBalance.used_leaves / leaveBalance.total_leaves) * 100}%`,
                                    }}
                                />
                            </div>
                            {totalDays > 0 && (
                                <p
                                    className={cn(
                                        'mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest duration-500 animate-in fade-in',
                                        totalDays > leaveBalance.available_leaves
                                            ? 'animate-pulse text-destructive'
                                            : 'text-foreground'
                                    )}
                                >
                                    <ChevronRight className="h-3 w-3" />
                                    {t('Projected Consumption')}: {totalDays} {t('Units')}
                                    {totalDays > leaveBalance.available_leaves && ` [${t('WARNING: MARGIN EXCEEDED')}]`}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Clock className="h-3 w-3 text-foreground" />
                            {t('Incursion Start')}
                        </Label>
                        <DatePicker
                            value={data.start_date}
                            onChange={(date) => setData('start_date', date)}
                            placeholder={t('Select Date')}
                            required
                            className="h-12 border-white/10 bg-card/5"
                        />
                        <InputError message={errors.start_date} />
                    </div>
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <Clock className="h-3 w-3 text-destructive" />
                            {t('Extraction Date')}
                        </Label>
                        <DatePicker
                            value={data.end_date}
                            onChange={(date) => setData('end_date', date)}
                            placeholder={t('Select Date')}
                            required
                            className="h-12 border-white/10 bg-card/5"
                        />
                        <InputError message={errors.end_date} />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <FileText className="h-3 w-3 text-foreground" />
                            {t('Reason')}
                        </Label>
                        <div className="flex gap-2">
                            {reasonAI?.map((field) => (
                                <div key={field.id}>{field.component}</div>
                            ))}
                        </div>
                    </div>
                    <Textarea
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                        placeholder={t('Define the mission necessity and operational constraints...')}
                        className="min-h-[120px] border-white/10 bg-card/5 text-xs font-medium leading-relaxed focus:border-foreground/50"
                        required
                    />
                    <InputError message={errors.reason} />
                </div>

                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                        {t('Supporting Intelligence (Attachments)')}
                    </Label>
                    <MediaPicker
                        multiple={true}
                        value={data.attachment_ids}
                        onChange={(ids: any) => setData('attachment_ids', ids)}
                    />
                    <InputError message={errors.attachment_ids} />
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4">
                    {calendarFields?.map((field) => (
                        <div key={field.id} className="rounded-xl border border-white/5 bg-card/[0.02] p-3">
                            {field.component}
                        </div>
                    ))}
                </div>
            </form>

            <div className="flex justify-end gap-4 border-t border-white/5 bg-foreground/40 p-8">
                <Button
                    variant="ghost"
                    onClick={onSuccess}
                    className="h-11 px-8 text-muted-foreground hover:text-background"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('Abort Protocol')}</span>
                </Button>
                <Button
                    onClick={submit}
                    disabled={processing || (leaveBalance && totalDays > leaveBalance.available_leaves)}
                    className="premium-button h-11 px-12"
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {t('Processing...')}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <PlaneTakeoff className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {t('Authorize Leave')}
                            </span>
                        </div>
                    )}
                </Button>
            </div>
        </DialogContent>
    );
}
