import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import {
    Users,
    Mail,
    Phone,
    Calendar,
    FileText,
    Hash,
    Target,
    Activity,
    CheckCircle2,
    Clock,
    Paperclip,
} from 'lucide-react';
import { Lead } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface ViewProps {
    [key: string]: any;
    lead: Lead;
}

export default function View({ lead }: ViewProps) {
    const { t } = useTranslation();

    const infoItems = [
        { label: t('Email Address'), value: lead.email, icon: Mail },
        { label: t('Phone Number'), value: lead.phone || t('Not recorded'), icon: Phone },
        { label: t('Acquisition Goal (Subject)'), value: lead.subject, icon: Target },
        { label: t('Current Phase'), value: lead.stage?.name || t('Initial Phase'), icon: Activity },
        { label: t('Intelligence Agent'), value: lead.user?.name || t('Unassigned'), icon: Users },
        {
            label: t('Created At'),
            value: lead.created_at ? format(new Date(lead.created_at), 'PPPp') : t('Unknown'),
            icon: Calendar,
        },
    ];

    return (
        <DialogContent className="max-w-3xl overflow-hidden border-border bg-card p-0 shadow-2xl dark:border-border dark:bg-foreground">
            <DialogHeader className="bg-muted/50/50 relative overflow-hidden border-b border-border p-8 dark:border-border dark:bg-foreground/50">
                <div className="absolute end-0 top-0 p-8 opacity-10">
                    <Target className="h-24 w-24 text-foreground dark:text-foreground" />
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground shadow-lg dark:bg-muted">
                        <Users className="h-7 w-7 text-foreground dark:text-foreground" />
                    </div>
                    <div>
                        <Badge
                            variant="outline"
                            className="mb-2 border-border bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:border-border dark:bg-card dark:text-muted-foreground"
                        >
                            {t('Lead Asset Profiling')}
                        </Badge>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tight text-foreground dark:text-foreground">
                            {lead.name}
                        </DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] p-8">
                <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {infoItems?.map((item, idx) => (
                        <div
                            key={idx}
                            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-border dark:border-border dark:bg-foreground/50 dark:hover:border-border"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 transition-transform group-hover:scale-110 dark:border-border dark:bg-foreground">
                                <item.icon className="h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">
                                    {item.label}
                                </p>
                                <p className="text-sm font-semibold text-foreground dark:text-foreground">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {lead.notes && (
                    <div className="mb-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {t('Intelligence Briefing')}
                            </h4>
                            <div className="h-px flex-1 bg-muted dark:bg-foreground" />
                        </div>
                        <div
                            className="prose dark:prose-invert max-w-none rounded-3xl border border-border bg-muted/50 p-6 text-sm font-medium leading-relaxed dark:border-border dark:bg-foreground/30"
                            dangerouslySetInnerHTML={{ __html: lead.notes }}
                        />
                    </div>
                )}

                {lead.attachments && lead.attachments.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {t('Field Evidence (Attachments)')}
                            </h4>
                            <div className="h-px flex-1 bg-muted dark:bg-foreground" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {lead.attachments?.map((file, idx) => (
                                <a
                                    key={idx}
                                    href={file.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-2xl border border-border p-3 transition-colors hover:bg-muted/50 dark:border-border dark:hover:bg-foreground"
                                >
                                    <div className="mb-2 flex h-20 w-full items-center justify-center rounded-xl bg-muted dark:bg-card">
                                        <FileText className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="truncate text-[10px] font-bold text-muted-foreground">
                                        {file.name || `Attachment ${idx + 1}`}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>

            <div className="bg-muted/50/50 flex items-center justify-between border-t border-border p-6 dark:border-border dark:bg-foreground/50">
                <div className="flex items-center gap-2 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {t('System Data Verified')}
                </div>
                <div className="flex gap-4">
                    <Badge
                        variant="outline"
                        className="flex h-9 items-center gap-2 rounded-full border-border bg-card px-4 dark:border-border dark:bg-foreground"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">
                            {t('Ready')}
                        </span>
                    </Badge>
                </div>
            </div>
        </DialogContent>
    );
}
