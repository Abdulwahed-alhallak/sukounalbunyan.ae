import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import { InterviewRound } from './types';

interface ViewProps {
    interviewround: InterviewRound;
}

export default function View({ interviewround }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader className="flex-shrink-0 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Job Requisition Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-4 space-y-6">
                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium text-foreground">{t('Name')}:</label>
                            <p className="text-foreground">{interviewround.name}</p>
                        </div>

                        <div>
                            <label className="font-medium text-foreground">{t('Job')}:</label>
                            <p className="text-foreground">{interviewround.job_posting?.title || '-'}</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium text-foreground">{t('Sequence Number')}:</label>
                            <div>
                                <span className="px-2 py-1 rounded-full text-sm bg-muted text-foreground">
                                    {interviewround.sequence_number || '-'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="font-medium text-foreground">{t('Status')}:</label>
                            <div>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    interviewround.status === "0" ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                }`}>
                                    {interviewround.status === "0" ? t('Active') : t('Inactive')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description - Full Width */}
                {interviewround.description && (
                    <div>
                        <label className="font-medium text-foreground">{t('Description')}:</label>
                        <p className="text-foreground">{interviewround.description}</p>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}