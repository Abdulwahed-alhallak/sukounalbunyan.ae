import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    Paperclip
} from 'lucide-react';
import { Lead } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface ViewProps {
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
        { label: t('Created At'), value: lead.created_at ? format(new Date(lead.created_at), 'PPPp') : t('Unknown'), icon: Calendar },
    ];

    return (
        <DialogContent className="max-w-3xl bg-card dark:bg-foreground border-border dark:border-border p-0 overflow-hidden shadow-2xl">
            <DialogHeader className="p-8 border-b border-border dark:border-border bg-muted/50/50 dark:bg-foreground/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Target className="h-24 w-24 text-foreground dark:text-foreground" />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-foreground dark:bg-muted flex items-center justify-center shadow-lg">
                        <Users className="h-7 w-7 text-foreground dark:text-foreground" />
                    </div>
                    <div>
                        <Badge variant="outline" className="mb-2 bg-muted dark:bg-card text-muted-foreground dark:text-muted-foreground border-border dark:border-border text-[10px] font-bold tracking-wider uppercase">
                            {t('Lead Asset Profiling')}
                        </Badge>
                        <DialogTitle className="text-2xl font-black tracking-tight text-foreground dark:text-foreground uppercase italic">
                            {lead.name}
                        </DialogTitle>
                    </div>
                </div>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh] p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {infoItems?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl border border-border dark:border-border bg-card dark:bg-foreground/50 hover:border-border dark:hover:border-border transition-all group">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/50 dark:bg-foreground flex items-center justify-center border border-border dark:border-border group-hover:scale-110 transition-transform">
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
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('Intelligence Briefing')}</h4>
                            <div className="h-px flex-1 bg-muted dark:bg-foreground" />
                        </div>
                        <div className="p-6 rounded-3xl bg-muted/50 dark:bg-foreground/30 border border-border dark:border-border prose dark:prose-invert max-w-none text-sm font-medium leading-relaxed" 
                             dangerouslySetInnerHTML={{ __html: lead.notes }} 
                        />
                    </div>
                )}

                {(lead.attachments && lead.attachments.length > 0) && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('Field Evidence (Attachments)')}</h4>
                            <div className="h-px flex-1 bg-muted dark:bg-foreground" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {lead.attachments?.map((file, idx) => (
                                <a key={idx} href={file.path} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-2xl border border-border dark:border-border hover:bg-muted/50 dark:hover:bg-foreground transition-colors">
                                    <div className="h-20 w-full rounded-xl bg-muted dark:bg-card flex items-center justify-center mb-2">
                                        <FileText className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] font-bold truncate text-muted-foreground">{file.name || `Attachment ${idx + 1}`}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>

            <div className="p-6 border-t border-border dark:border-border bg-muted/50/50 dark:bg-foreground/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4">
                    <Clock className="h-3 w-3" />
                    {t('System Data Verified')}
                </div>
                <div className="flex gap-4">
                    <Badge variant="outline" className="h-9 px-4 rounded-full flex items-center gap-2 border-border dark:border-border bg-card dark:bg-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground dark:text-muted-foreground">{t('Ready')}</span>
                    </Badge>
                </div>
            </div>
        </DialogContent>
    );
}