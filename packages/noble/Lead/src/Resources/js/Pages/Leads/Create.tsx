import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInputComponent } from '@/components/ui/phone-input';
import { DatePicker } from '@/components/ui/date-picker';
import { CreateLeadProps, CreateLeadFormData } from './types';
import { useFormFields } from '@/hooks/useFormFields';
import MediaPicker from '@/components/MediaPicker';
import { Target, User, Mail, Hash, Users, Calendar, Paperclip, Plus } from 'lucide-react';

export default function Create({ pipelines, stages, sources, products, users, onClose }: CreateLeadProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm<CreateLeadFormData>({
        subject: '',
        user_id: '',
        name: '',
        email: '',
        phone: '',
        date: '',
        media_paths: [],
    });

    const nameAI = useFormFields('aiField', data, setData, errors, 'create', 'name', 'Name', 'lead', 'lead');
    const subjectAI = useFormFields('aiField', data, setData, errors, 'create', 'subject', 'Subject', 'lead', 'lead');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lead.leads.store'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <DialogContent className="max-w-2xl overflow-hidden border-border bg-card p-0 shadow-xl dark:border-border dark:bg-foreground">
            <DialogHeader className="bg-muted/50/50 border-b border-border p-6 dark:border-border dark:bg-foreground/50">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground dark:bg-muted">
                        <Plus className="h-5 w-5 text-foreground dark:text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold tracking-tight">
                            {t('Create New Lead')}
                        </DialogTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {t('Enter the details for the new lead acquisition.')}
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <form onSubmit={submit} className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold dark:bg-card">
                                1
                            </span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {t('Lead Information')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">
                                        {t('Lead Name')}
                                    </Label>
                                    {nameAI?.map((field) => (
                                        <div key={field.id} className="origin-right scale-75">
                                            {field.component}
                                        </div>
                                    ))}
                                </div>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('Contact name')}
                                    className="border-border bg-transparent focus:ring-foreground dark:border-border dark:focus:ring-border"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">
                                        {t('Subject')}
                                    </Label>
                                    {subjectAI?.map((field) => (
                                        <div key={field.id} className="origin-right scale-75">
                                            {field.component}
                                        </div>
                                    ))}
                                </div>
                                <Input
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder={t('Lead subject/goal')}
                                    className="border-border bg-transparent focus:ring-foreground dark:border-border dark:focus:ring-border"
                                    required
                                />
                                <InputError message={errors.subject} />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold dark:bg-card">
                                2
                            </span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {t('Contact Details')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">
                                    {t('Email Address')}
                                </Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('contact@noble.dion.sy')}
                                    className="border-border bg-transparent focus:ring-foreground dark:border-border dark:focus:ring-border"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <PhoneInputComponent
                                    label={t('Phone Number')}
                                    value={data.phone}
                                    onChange={(value) => setData('phone', value || '')}
                                    error={errors.phone}
                                    className="text-xs font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assignment & Scheduling */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold dark:bg-card">
                                3
                            </span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {t('Assignment & Follow-up')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">
                                    {t('Assign To')}
                                </Label>
                                <Select
                                    value={data.user_id?.toString() || ''}
                                    onValueChange={(value) => setData('user_id', value)}
                                >
                                    <SelectTrigger className="h-10 border-border bg-transparent dark:border-border">
                                        <SelectValue placeholder={t('Select user')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((item: any) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.user_id} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">
                                    {t('Follow-up Date')}
                                </Label>
                                <DatePicker
                                    value={data.date}
                                    onChange={(value: string) => setData('date', value)}
                                    placeholder={t('Set date')}
                                    className="border-border bg-transparent dark:border-border"
                                />
                                <InputError message={errors.date} />
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold dark:bg-card">
                                4
                            </span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {t('Documents')}
                            </h4>
                        </div>
                        <div className="rounded-xl border border-dashed border-border p-4 dark:border-border">
                            <MediaPicker
                                value={data.media_paths || []}
                                onChange={(paths: any) => setData('media_paths', paths)}
                                multiple={true}
                            />
                        </div>
                        <InputError message={errors.media_paths} />
                    </div>
                </div>
            </form>

            <div className="bg-muted/50/50 flex justify-end gap-3 border-t border-border p-6 dark:border-border dark:bg-foreground/50">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                >
                    {t('Cancel')}
                </Button>
                <Button
                    onClick={submit}
                    disabled={processing}
                    className="bg-foreground px-8 text-foreground hover:opacity-90 dark:bg-muted dark:text-foreground"
                >
                    {processing ? t('Saving...') : t('Create Lead')}
                </Button>
            </div>
        </DialogContent>
    );
}
