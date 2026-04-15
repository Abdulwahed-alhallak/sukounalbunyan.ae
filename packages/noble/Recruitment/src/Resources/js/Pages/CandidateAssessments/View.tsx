import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck } from 'lucide-react';
import { CandidateAssessment } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    [key: string]: any;
    candidateassessment: CandidateAssessment;
}

export default function View({ candidateassessment }: ViewProps) {
    const { t } = useTranslation();

    const score = candidateassessment.score || 0;
    const maxScore = candidateassessment.max_score || 0;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const firstName = candidateassessment.candidate?.first_name || '';
    const lastName = candidateassessment.candidate?.last_name || '';
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '-';

    const getStatusColor = (status: string) => {
        switch (status) {
            case '0':
                return 'bg-muted text-foreground';
            case '1':
                return 'bg-muted text-destructive';
            case '2':
                return 'bg-muted text-foreground';
            default:
                return 'bg-muted text-foreground';
        }
    };

    const getStatusText = (status: string) => {
        const options: any = { '0': 'Pass', '1': 'Fail', '2': 'Pending' };
        return options[status] || status || '-';
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <ClipboardCheck className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">
                            {t('Candidate Assessments Details')}
                        </DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 p-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Assessment Name')}</label>
                            <p className="font-medium text-foreground">{candidateassessment.assessment_name || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Candidate')}</label>
                            <p className="font-medium text-foreground">{fullName}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Conducted By')}</label>
                            <p className="text-foreground">{candidateassessment.conducted_by?.name || '-'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Assessment Date')}</label>
                            <p className="text-foreground">{formatDate(candidateassessment.assessment_date) || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Status')}</label>
                            <span
                                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(candidateassessment.pass_fail_status)}`}
                            >
                                {t(getStatusText(candidateassessment.pass_fail_status))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Score Section */}
                <div className="rounded-lg bg-muted/50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">{t('Score Details')}</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-foreground">{score}</div>
                            <div className="text-sm text-muted-foreground">{t('Score')}</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{maxScore}</div>
                            <div className="text-sm text-muted-foreground">{t('Max Score')}</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{percentage}%</div>
                            <div className="text-sm text-muted-foreground">{t('Percentage')}</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-3 w-full rounded-full bg-muted">
                            <div className="bg-muted/500 h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Comments */}
                {candidateassessment.comments && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-muted-foreground">{t('Comments')}</label>
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="whitespace-pre-wrap text-foreground">{candidateassessment.comments}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
