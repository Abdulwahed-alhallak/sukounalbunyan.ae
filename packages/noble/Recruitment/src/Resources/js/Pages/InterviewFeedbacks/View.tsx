import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Star, User, Calendar } from 'lucide-react';
import { InterviewFeedback } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    interviewfeedback: InterviewFeedback;
}

export default function View({ interviewfeedback }: ViewProps) {
    const { t } = useTranslation();

    const recommendationOptions: any = {
        '0': 'Strong Hire',
        '1': 'Hire',
        '2': 'Maybe',
        '3': 'Reject',
        '4': 'Strong Reject',
    };
    const recommendationText = recommendationOptions[interviewfeedback.recommendation] || 'No Recommendation';

    const getBadgeColor = (val: string) => {
        switch (val) {
            case '0':
                return 'bg-muted text-foreground';
            case '1':
                return 'bg-muted text-foreground';
            case '2':
                return 'bg-muted text-foreground';
            case '3':
            case '4':
                return 'bg-muted text-destructive';
            default:
                return 'bg-muted text-foreground';
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5]?.map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating ? 'fill-foreground text-muted-foreground' : 'text-muted-foreground/60'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium">{rating}/5</span>
            </div>
        );
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-foreground/10 p-2">
                            <MessageSquare className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">
                                {t('Interview Feedback Details')}
                            </DialogTitle>
                        </div>
                    </div>
                    <div
                        className={`mr-6 rounded-full px-3 py-1 text-sm font-medium ${getBadgeColor(interviewfeedback.recommendation)}`}
                    >
                        {t(recommendationText)}
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 p-6">
                {/* Candidate & Interview Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-muted/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">{t('Candidate Information')}</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Name')}: </span>
                                <span className="font-medium">
                                    {interviewfeedback.interview?.candidate?.first_name &&
                                    interviewfeedback.interview?.candidate?.last_name
                                        ? `${interviewfeedback.interview.candidate.first_name} ${interviewfeedback.interview.candidate.last_name}`
                                        : 'Unknown Candidate'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Position')}: </span>
                                <span className="font-medium">
                                    {interviewfeedback.interview?.job_posting?.title || 'No Job Title'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">{t('Interview Details')}</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Interviewer(s)')}: </span>
                                <span className="font-medium">
                                    {interviewfeedback.interviewer_names || 'No interviewer assigned'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Date')}: </span>
                                <span className="font-medium">
                                    {interviewfeedback.created_at ? formatDate(interviewfeedback.created_at) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings */}
                <div>
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                        <Star className="h-5 w-5" />
                        {t('Ratings')}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('Technical')}</h4>
                            {interviewfeedback.technical_rating ? (
                                renderStars(interviewfeedback.technical_rating)
                            ) : (
                                <span className="text-muted-foreground">{t('No rating')}</span>
                            )}
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('Communication')}</h4>
                            {interviewfeedback.communication_rating ? (
                                renderStars(interviewfeedback.communication_rating)
                            ) : (
                                <span className="text-muted-foreground">{t('No rating')}</span>
                            )}
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('Cultural Fit')}</h4>
                            {interviewfeedback.cultural_fit_rating ? (
                                renderStars(interviewfeedback.cultural_fit_rating)
                            ) : (
                                <span className="text-muted-foreground">{t('No rating')}</span>
                            )}
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 text-center">
                            <h4 className="mb-2 text-sm font-medium text-foreground">{t('Overall')}</h4>
                            {interviewfeedback.overall_rating ? (
                                renderStars(interviewfeedback.overall_rating)
                            ) : (
                                <span className="text-muted-foreground">{t('No rating')}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Content */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h4 className="mb-2 font-medium text-foreground">{t('Strengths')}</h4>
                        <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border bg-muted/50 p-4">
                            <p className="whitespace-pre-wrap text-foreground">
                                {interviewfeedback.strengths || 'No strengths mentioned'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-2 font-medium text-destructive">{t('Weaknesses')}</h4>
                        <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border bg-muted/50 p-4">
                            <p className="whitespace-pre-wrap text-foreground">
                                {interviewfeedback.weaknesses || 'No weaknesses mentioned'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div>
                    <h4 className="mb-2 font-medium text-foreground">{t('Additional Comments')}</h4>
                    <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border bg-muted/50 p-4">
                        <p className="whitespace-pre-wrap text-foreground">
                            {interviewfeedback.comments || 'No additional comments'}
                        </p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
