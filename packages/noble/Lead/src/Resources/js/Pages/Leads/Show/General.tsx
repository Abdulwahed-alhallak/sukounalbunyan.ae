import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lead } from '../types';
import { formatDate, formatDateTime } from '@/utils/helpers';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useFormFields } from '@/hooks/useFormFields';

interface GeneralProps {
    [key: string]: any;
    lead: Lead;
}

export default function General({ lead }: GeneralProps) {
    const { t } = useTranslation();
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [discussionModalOpen, setDiscussionModalOpen] = useState(false);
    const [emailForm, setEmailForm] = useState({ to: '', subject: '', description: '' });
    const [discussionForm, setDiscussionForm] = useState({ message: '' });
    const [emailEditorKey, setEmailEditorKey] = useState(0);

    const emailSubjectAI = useFormFields(
        'aiField',
        emailForm,
        (field, value) => {
            setEmailForm((prev) => ({ ...prev, [field]: value }));
        },
        {},
        'create',
        'subject',
        'Subject',
        'lead',
        'lead_email'
    );

    const emailDescriptionAI = useFormFields(
        'aiField',
        emailForm,
        (field, value) => {
            setEmailForm((prev) => ({ ...prev, [field]: value }));
            setEmailEditorKey((prev) => prev + 1);
        },
        {},
        'create',
        'description',
        'Description',
        'lead',
        'lead_email'
    );

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('lead.leads.store-email', lead.id), emailForm, {
            onSuccess: () => {
                setEmailForm({ to: '', subject: '', description: '' });
                setEmailModalOpen(false);
            },
        });
    };

    const handleDiscussionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('lead.leads.store-discussion', lead.id), discussionForm, {
            onSuccess: () => {
                setDiscussionForm({ message: '' });
                setDiscussionModalOpen(false);
            },
        });
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="rounded-xl border border-border bg-gradient-to-r from-muted/50 to-muted/50 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-foreground">{lead.name}</h1>
                        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                            {lead.stage?.name || 'No Stage'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-2xl font-bold text-foreground">{lead.email ? '1' : '0'}</div>
                    <div className="text-sm text-muted-foreground">{t('Email')}</div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-2xl font-bold text-foreground">{lead.sources?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">{t('Sources')}</div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-2xl font-bold text-foreground">{lead.products?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">{t('Products')}</div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                    <div className="text-2xl font-bold text-foreground">{lead.tasks?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">{t('Tasks')}</div>
                </div>
            </div>

            {/* Details Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-foreground">{t('Lead Information')}</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t('Email')}
                        </label>
                        <p className="text-sm font-medium text-foreground">{lead.email || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t('Phone')}
                        </label>
                        <p className="text-sm font-medium text-foreground">{lead.phone || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t('Follow Up Date')}
                        </label>
                        <p className="text-sm font-medium text-foreground">{lead.date ? formatDate(lead.date) : '-'}</p>
                    </div>
                    {lead.user && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {t('Assigned To')}
                            </label>
                            <p className="text-sm font-medium text-foreground">{lead.user.name}</p>
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t('Pipeline')}
                        </label>
                        <p className="text-sm font-medium text-foreground">{lead.pipeline?.name || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t('Stage')}
                        </label>
                        <p className="text-sm font-medium text-foreground">{lead.stage?.name || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Subject Section */}
            {lead.subject && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">{t('Subject')}</h3>
                    <div
                        className="prose prose-sm max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: lead.subject }}
                    />
                </div>
            )}

            {/* Description Section */}
            {lead.description && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">{t('Description')}</h3>
                    <div
                        className="prose prose-sm max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: lead.description }}
                    />
                </div>
            )}

            {/* Notes Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">{t('Notes')}</h3>
                <div className="rounded-lg bg-muted/50 p-4">
                    <RichTextEditor
                        content={lead.notes || ''}
                        onChange={(content) => {
                            router.put(route('lead.leads.update', lead.id), {
                                notes: content,
                            });
                        }}
                        placeholder={t('Add notes...')}
                        className="min-h-[300px]"
                    />
                </div>
            </div>

            {/* Emails and Discussions Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Emails */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{t('Emails')}</h3>
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => setEmailModalOpen(true)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Send Email')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="max-h-[400px] space-y-3 overflow-y-auto">
                        {lead.emails && lead.emails.length > 0 ? (
                            lead.emails?.map((email: any, index: number) => {
                                const stripHtmlAndDecode = (html: string) => {
                                    if (!html) return '';
                                    return html
                                        .replace(/<[^>]*>/g, '')
                                        .replace(/&amp;/g, '&')
                                        .replace(/&lt;/g, '<')
                                        .replace(/&gt;/g, '>')
                                        .replace(/&quot;/g, '"')
                                        .replace(/&#39;/g, "'")
                                        .replace(/&nbsp;/g, ' ');
                                };
                                const cleanText = stripHtmlAndDecode(email.description);
                                return (
                                    <div key={index} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-muted p-1">
                                                    <svg
                                                        className="h-3 w-3 text-muted-foreground"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{email.to}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDateTime(email.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-border bg-card p-3">
                                            <h4 className="mb-2 text-sm font-semibold text-foreground">
                                                {email.subject}
                                            </h4>
                                            <div className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                                                {cleanText}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="py-4 text-center text-sm text-muted-foreground">{t('No emails found')}</p>
                        )}
                    </div>
                </div>

                {/* Discussions */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{t('Discussions')}</h3>
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => setDiscussionModalOpen(true)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Add Message')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="max-h-[400px] space-y-3 overflow-y-auto">
                        {lead.discussions && lead.discussions.length > 0 ? (
                            lead.discussions?.map((discussion: any, index: number) => {
                                return (
                                    <div key={index} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-muted p-1">
                                                    <svg
                                                        className="h-3 w-3 text-muted-foreground"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {discussion.creator?.name || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDateTime(discussion.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg border border-border bg-card p-3">
                                            <div className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                                                {discussion.comment}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                {t('No discussions found')}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('Send Email')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="to">{t('To')}</Label>
                            <Input
                                id="to"
                                type="email"
                                value={emailForm.to}
                                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                                placeholder={t('Enter email address')}
                                required
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Label htmlFor="subject">{t('Subject')}</Label>
                                <Input
                                    id="subject"
                                    type="text"
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    placeholder={t('Enter subject')}
                                    required
                                />
                            </div>
                            {emailSubjectAI?.map((field) => (
                                <div key={field.id}>{field.component}</div>
                            ))}
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label htmlFor="description">{t('Description')}</Label>
                                <div className="flex gap-2">
                                    {emailDescriptionAI?.map((field) => (
                                        <div key={field.id}>{field.component}</div>
                                    ))}
                                </div>
                            </div>
                            <RichTextEditor
                                key={`email-editor-${emailEditorKey}`}
                                content={emailForm.description}
                                onChange={(content) => setEmailForm({ ...emailForm, description: content })}
                                placeholder={t('Enter email content')}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setEmailModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit">{t('Send Email')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Discussion Modal */}
            <Dialog open={discussionModalOpen} onOpenChange={setDiscussionModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Add Message')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDiscussionSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="message">{t('Message')}</Label>
                            <Textarea
                                id="message"
                                value={discussionForm.message}
                                onChange={(e) => setDiscussionForm({ ...discussionForm, message: e.target.value })}
                                placeholder={t('Enter your message')}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setDiscussionModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit">{t('Save')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
