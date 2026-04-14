import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInputComponent } from '@/components/ui/phone-input';
import { DatePicker } from '@/components/ui/date-picker';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { MultiSelect } from '@/components/ui/multi-select';
import { EditLeadProps, EditLeadFormData } from './types';
import { useState, useEffect } from 'react';
import { useFormFields } from '@/hooks/useFormFields';
import MediaPicker from '@/components/MediaPicker';
import {
    Target,
    Edit as EditIcon,
    Users,
    Calendar,
    Mail,
    Globe,
    ShoppingCart,
    FileText,
    Settings,
    Layout,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function EditLead({
    lead,
    pipelines: propPipelines,
    stages: propStages,
    sources: propSources,
    products: propProducts,
    users: propUsers,
    onClose,
}: EditLeadProps) {
    const { t } = useTranslation();
    const [stages, setStages] = useState(propStages || []);
    const [activeTab, setActiveTab] = useState('identity');

    const { data, setData, put, processing, errors } = useForm<EditLeadFormData>({
        subject: lead.subject ?? '',
        user_id: lead.user_id?.toString() || '',
        name: lead.name ?? '',
        email: lead.email ?? '',
        phone: lead.phone ?? '',
        date: lead.date || '',
        pipeline_id: lead.pipeline_id?.toString() || '',
        stage_id: lead.stage_id?.toString() || '',
        sources: Array.isArray(lead.sources) ? lead.sources : lead.sources ? lead.sources.split(',') : [],
        products: Array.isArray(lead.products) ? lead.products : lead.products ? lead.products.split(',') : [],
        notes: lead.notes ?? '',
        media_paths: Array.isArray(lead.additional_images)
            ? lead.additional_images
            : lead.additional_images
              ? lead.additional_images.split(',')
              : [],
    });

    const nameAI = useFormFields('aiField', data, setData, errors, 'edit', 'name', 'Name', 'lead', 'lead');
    const subjectAI = useFormFields('aiField', data, setData, errors, 'edit', 'subject', 'Subject', 'lead', 'lead');
    const [notesEditorKey, setNotesEditorKey] = useState(0);
    const notesAI = useFormFields(
        'aiField',
        data,
        (field, value) => {
            setData(field, value);
            setNotesEditorKey((prev) => prev + 1);
        },
        errors,
        'edit',
        'notes',
        'Notes',
        'lead',
        'lead'
    );

    useEffect(() => {
        if (data.pipeline_id) {
            fetch(route('lead.stages.by-pipeline', data.pipeline_id))
                .then((res) => res.json())
                .then((data) => setStages(data))
                .catch(() => setStages([]));
        }
    }, [data.pipeline_id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...data,
            sources: Array.isArray(data.sources)
                ? data.sources.length > 0
                    ? data.sources.join(',')
                    : ''
                : data.sources,
            products: Array.isArray(data.products)
                ? data.products.length > 0
                    ? data.products.join(',')
                    : ''
                : data.products,
        };

        put(route('lead.leads.update', lead.id), {
            data: submitData,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <DialogContent className="max-w-3xl overflow-hidden border-border bg-card p-0 shadow-xl dark:border-border dark:bg-foreground">
            <DialogHeader className="bg-muted/50/50 border-b border-border p-6 dark:border-border dark:bg-foreground/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground dark:bg-muted">
                            <EditIcon className="h-5 w-5 text-foreground dark:text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold tracking-tight">{t('Edit Lead')}</DialogTitle>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {t('Update lead intelligence and strategic context.')}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        className="bg-muted capitalize text-muted-foreground dark:bg-card dark:text-muted-foreground"
                    >
                        {t('ID')}: {lead.id}
                    </Badge>
                </div>
            </DialogHeader>

            <div className="max-h-[70vh] flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="bg-muted/50/50 border-b border-border px-6 py-4 dark:border-border dark:bg-foreground/50">
                        <TabsList className="flex gap-1 bg-transparent p-0">
                            <TabsTrigger
                                value="identity"
                                className="rounded-md px-4 py-1.5 text-xs font-medium transition-all data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-muted dark:data-[state=active]:text-foreground"
                            >
                                {t('Identity')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="strategy"
                                className="rounded-md px-4 py-1.5 text-xs font-medium transition-all data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-muted dark:data-[state=active]:text-foreground"
                            >
                                {t('Strategy')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="intelligence"
                                className="rounded-md px-4 py-1.5 text-xs font-medium transition-all data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:bg-muted dark:data-[state=active]:text-foreground"
                            >
                                {t('Intelligence')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <form id="edit-lead-form" onSubmit={submit} className="p-6">
                        <TabsContent value="identity" className="mt-0 space-y-6 border-none p-0">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium">{t('Full Name')}</Label>
                                        {nameAI?.map((field) => (
                                            <div key={field.id} className="origin-right scale-75">
                                                {field.component}
                                            </div>
                                        ))}
                                    </div>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="border-border bg-transparent focus:ring-foreground dark:border-border dark:focus:ring-border"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Email Address')}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="border-border bg-transparent focus:ring-foreground dark:border-border dark:focus:ring-border"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium">{t('Subject')}</Label>
                                        {subjectAI?.map((field) => (
                                            <div key={field.id} className="origin-right scale-75">
                                                {field.component}
                                            </div>
                                        ))}
                                    </div>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="border-border bg-transparent focus:ring-foreground dark:border-border dark:focus:ring-border"
                                        required
                                    />
                                    <InputError message={errors.subject} />
                                </div>

                                <div className="space-y-2">
                                    <PhoneInputComponent
                                        label={t('Phone Number')}
                                        value={data.phone}
                                        onChange={(value) => setData('phone', value || '')}
                                        error={errors.phone}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="strategy" className="mt-0 space-y-6 border-none p-0">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Assigned User')}</Label>
                                    <Select
                                        value={data.user_id?.toString() || ''}
                                        onValueChange={(value) => setData('user_id', value)}
                                    >
                                        <SelectTrigger className="border-border bg-transparent dark:border-border">
                                            <SelectValue placeholder={t('Assign user')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {propUsers?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Follow Up Date')}</Label>
                                    <DatePicker
                                        value={data.date}
                                        onChange={(date) => {
                                            const d = new Date(date);
                                            setData('date', d.toISOString().split('T')[0]);
                                        }}
                                        placeholder={t('Select date')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Pipeline')}</Label>
                                    <Select
                                        value={data.pipeline_id?.toString() || ''}
                                        onValueChange={(value) => setData('pipeline_id', value)}
                                    >
                                        <SelectTrigger className="border-border bg-transparent dark:border-border">
                                            <SelectValue placeholder={t('Select pipeline')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {propPipelines?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Stage')}</Label>
                                    <Select
                                        value={data.stage_id?.toString() || ''}
                                        onValueChange={(value) => setData('stage_id', value)}
                                    >
                                        <SelectTrigger className="border-border bg-transparent dark:border-border">
                                            <SelectValue placeholder={t('Select stage')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stages?.map((item: any) => (
                                                <SelectItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Sources')}</Label>
                                    <MultiSelect
                                        options={Object.entries(propSources || {})?.map(([id, name]) => ({
                                            value: id,
                                            label: name as string,
                                        }))}
                                        value={Array.isArray(data.sources) ? data.sources : []}
                                        onValueChange={(values) => setData('sources', values)}
                                        placeholder={t('Select sources')}
                                        className="h-10 text-xs"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">{t('Products')}</Label>
                                    <MultiSelect
                                        options={Object.entries(propProducts || {})?.map(([id, name]) => ({
                                            value: id,
                                            label: name as string,
                                        }))}
                                        value={Array.isArray(data.products) ? data.products : []}
                                        onValueChange={(values) => setData('products', values)}
                                        placeholder={t('Select products')}
                                        className="h-10 text-xs"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="intelligence" className="mt-0 space-y-6 border-none p-0">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium">{t('Notes')}</Label>
                                    {notesAI?.map((field) => (
                                        <div key={field.id} className="origin-right scale-75">
                                            {field.component}
                                        </div>
                                    ))}
                                </div>
                                <div className="overflow-hidden rounded-lg border border-border dark:border-border">
                                    <RichTextEditor
                                        key={`notes-editor-${notesEditorKey}`}
                                        content={data.notes || ''}
                                        onChange={(content) => setData('notes', content)}
                                        placeholder={t('Add lead notes...')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">{t('Attachments')}</Label>
                                <div className="rounded-xl border border-dashed border-border p-4 dark:border-border">
                                    <MediaPicker
                                        value={data.media_paths || []}
                                        onChange={(paths: any) => setData('media_paths', paths)}
                                        multiple={true}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </form>
                </Tabs>
            </div>

            <div className="bg-muted/50/50 flex justify-end gap-3 border-t border-border p-6 dark:border-border dark:bg-foreground/50">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                >
                    {t('Cancel')}
                </Button>
                <Button
                    form="edit-lead-form"
                    type="submit"
                    disabled={processing}
                    className="bg-foreground px-8 text-foreground hover:opacity-90 dark:bg-muted dark:text-foreground"
                >
                    {processing ? t('Saving...') : t('Update Lead')}
                </Button>
            </div>
        </DialogContent>
    );
}
