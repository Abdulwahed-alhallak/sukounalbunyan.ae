import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { UserCheck, Calendar, User, FileText, Users } from 'lucide-react';
import { CandidateOnboarding } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    candidateonboarding: CandidateOnboarding;
}

export default function View({ candidateonboarding }: ViewProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-muted text-foreground';
            case 'In Progress':
                return 'bg-muted text-foreground';
            case 'Completed':
                return 'bg-muted text-foreground';
            default:
                return 'bg-muted text-foreground';
        }
    };

    return (
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{t('Candidate Onboarding Details')}</DialogTitle>
                        </div>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
                {/* Candidate Information */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{t('Candidate Information')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Name')}</label>
                            <p className="text-foreground font-medium">{candidateonboarding.candidate?.name || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Email')}</label>
                            <p className="text-foreground">{candidateonboarding.candidate?.email || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Onboarding Details */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{t('Onboarding Details')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Checklist Name')}</label>
                            <p className="text-foreground font-medium">{candidateonboarding.checklist?.name || 'No checklist assigned'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Status')}</label>
                            <div className="mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(candidateonboarding.status)}`}>
                                    {t(candidateonboarding.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Information */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{t('Timeline')}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Start Date')}</label>
                            <p className="text-foreground font-medium">
                                {candidateonboarding.start_date ? formatDate(candidateonboarding.start_date) : '-'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Created At')}</label>
                            <p className="text-foreground">
                                {candidateonboarding.created_at ? formatDate(candidateonboarding.created_at) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Buddy Information */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{t('Buddy Assignment')}</h3>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('Assigned Buddy')}</label>
                        <p className="text-foreground font-medium">
                            {candidateonboarding.buddy?.name || 'No buddy assigned'}
                        </p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}