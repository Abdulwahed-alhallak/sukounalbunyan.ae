import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInputComponent } from '@/components/ui/phone-input';
import { DatePicker } from '@/components/ui/date-picker';
import { CreateLeadProps, CreateLeadFormData } from './types';
import { useFormFields } from '@/hooks/useFormFields';
import MediaPicker from '@/components/MediaPicker';
import { 
    Target, 
    User, 
    Mail, 
    Hash, 
    Users, 
    Calendar, 
    Paperclip, 
    Plus
} from 'lucide-react';

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
            onSuccess: () => onClose()
        });
    };

    return (
        <DialogContent className="max-w-2xl bg-card dark:bg-foreground border-border dark:border-border p-0 overflow-hidden shadow-xl">
            <DialogHeader className="p-6 border-b border-border dark:border-border bg-muted/50/50 dark:bg-foreground/50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-foreground dark:bg-muted flex items-center justify-center">
                        <Plus className="h-5 w-5 text-foreground dark:text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold tracking-tight">{t('Create New Lead')}</DialogTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('Enter the details for the new lead acquisition.')}</p>
                    </div>
                </div>
            </DialogHeader>

            <form onSubmit={submit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-muted dark:bg-card flex items-center justify-center text-[10px] font-bold">1</span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('Lead Information')}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">{t('Lead Name')}</Label>
                                    {nameAI?.map(field => <div key={field.id} className="scale-75 origin-right">{field.component}</div>)}
                                </div>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('Contact name')}
                                    className="bg-transparent border-border dark:border-border focus:ring-foreground dark:focus:ring-border"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">{t('Subject')}</Label>
                                    {subjectAI?.map(field => <div key={field.id} className="scale-75 origin-right">{field.component}</div>)}
                                </div>
                                <Input
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder={t('Lead subject/goal')}
                                    className="bg-transparent border-border dark:border-border focus:ring-foreground dark:focus:ring-border"
                                    required
                                />
                                <InputError message={errors.subject} />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-muted dark:bg-card flex items-center justify-center text-[10px] font-bold">2</span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('Contact Details')}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">{t('Email Address')}</Label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('contact@example.com')}
                                    className="bg-transparent border-border dark:border-border focus:ring-foreground dark:focus:ring-border"
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
                            <span className="h-5 w-5 rounded-full bg-muted dark:bg-card flex items-center justify-center text-[10px] font-bold">3</span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('Assignment & Follow-up')}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">{t('Assign To')}</Label>
                                <Select value={data.user_id?.toString() || ''} onValueChange={(value) => setData('user_id', value)}>
                                    <SelectTrigger className="bg-transparent border-border dark:border-border h-10">
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
                                <Label className="text-xs font-medium text-foreground dark:text-muted-foreground/60">{t('Follow-up Date')}</Label>
                                <DatePicker
                                    value={data.date}
                                    onChange={(value: string) => setData('date', value)}
                                    placeholder={t('Set date')}
                                    className="bg-transparent border-border dark:border-border"
                                />
                                <InputError message={errors.date} />
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-muted dark:bg-card flex items-center justify-center text-[10px] font-bold">4</span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('Documents')}</h4>
                        </div>
                        <div className="p-4 rounded-xl border border-border dark:border-border border-dashed">
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

            <div className="p-6 border-t border-border dark:border-border flex justify-end gap-3 bg-muted/50/50 dark:bg-foreground/50">
                <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground dark:hover:text-foreground">
                    {t('Cancel')}
                </Button>
                <Button 
                    onClick={submit} 
                    disabled={processing} 
                    className="bg-foreground dark:bg-muted text-foreground dark:text-foreground hover:opacity-90 px-8"
                >
                    {processing ? t('Saving...') : t('Create Lead')}
                </Button>
            </div>
        </DialogContent>
    );
}
