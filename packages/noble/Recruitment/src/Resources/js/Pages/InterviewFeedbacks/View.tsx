import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { MessageSquare, Star, User, Calendar } from 'lucide-react';
import { InterviewFeedback } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    interviewfeedback: InterviewFeedback;
}

export default function View({ interviewfeedback }: ViewProps) {
    const { t } = useTranslation();

    const recommendationOptions: any = {"0":"Strong Hire","1":"Hire","2":"Maybe","3":"Reject","4":"Strong Reject"};
    const recommendationText = recommendationOptions[interviewfeedback.recommendation] || 'No Recommendation';

    const getBadgeColor = (val: string) => {
        switch(val) {
            case '0': return 'bg-muted text-foreground';
            case '1': return 'bg-muted text-foreground';
            case '2': return 'bg-muted text-foreground';
            case '3': case '4': return 'bg-muted text-destructive';
            default: return 'bg-muted text-foreground';
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5]?.map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? 'text-muted-foreground fill-foreground'
                                : 'text-muted-foreground/60'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium">{rating}/5</span>
            </div>
        );
    };

    return (
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-foreground/10 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">{t('Interview Feedback Details')}</DialogTitle>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium mr-6 ${getBadgeColor(interviewfeedback.recommendation)}`}>
                        {t(recommendationText)}
                    </div>
                </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
                {/* Candidate & Interview Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">{t('Candidate Information')}</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Name')}: </span>
                                <span className="font-medium">
                                    {(interviewfeedback.interview?.candidate?.first_name && interviewfeedback.interview?.candidate?.last_name)
                                        ? `${interviewfeedback.interview.candidate.first_name} ${interviewfeedback.interview.candidate.last_name}`
                                        : 'Unknown Candidate'
                                    }
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Position')}: </span>
                                <span className="font-medium">{interviewfeedback.interview?.job_posting?.title || 'No Job Title'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">{t('Interview Details')}</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Interviewer(s)')}: </span>
                                <span className="font-medium">{interviewfeedback.interviewer_names || 'No interviewer assigned'}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">{t('Date')}: </span>
                                <span className="font-medium">{interviewfeedback.created_at ? formatDate(interviewfeedback.created_at) : '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings */}
                <div>
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        {t('Ratings')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <h4 className="text-sm font-medium text-foreground mb-2">{t('Technical')}</h4>
                            {interviewfeedback.technical_rating ? renderStars(interviewfeedback.technical_rating) : <span className="text-muted-foreground">{t('No rating')}</span>}
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <h4 className="text-sm font-medium text-foreground mb-2">{t('Communication')}</h4>
                            {interviewfeedback.communication_rating ? renderStars(interviewfeedback.communication_rating) : <span className="text-muted-foreground">{t('No rating')}</span>}
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <h4 className="text-sm font-medium text-foreground mb-2">{t('Cultural Fit')}</h4>
                            {interviewfeedback.cultural_fit_rating ? renderStars(interviewfeedback.cultural_fit_rating) : <span className="text-muted-foreground">{t('No rating')}</span>}
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <h4 className="text-sm font-medium text-foreground mb-2">{t('Overall')}</h4>
                            {interviewfeedback.overall_rating ? renderStars(interviewfeedback.overall_rating) : <span className="text-muted-foreground">{t('No rating')}</span>}
                        </div>
                    </div>
                </div>

                {/* Feedback Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-foreground mb-2">{t('Strengths')}</h4>
                        <div className="bg-muted/50 border border-border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                            <p className="text-foreground whitespace-pre-wrap">{interviewfeedback.strengths || 'No strengths mentioned'}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-destructive mb-2">{t('Weaknesses')}</h4>
                        <div className="bg-muted/50 border border-border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                            <p className="text-foreground whitespace-pre-wrap">{interviewfeedback.weaknesses || 'No weaknesses mentioned'}</p>
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div>
                    <h4 className="font-medium text-foreground mb-2">{t('Additional Comments')}</h4>
                    <div className="bg-muted/50 border border-border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                        <p className="text-foreground whitespace-pre-wrap">{interviewfeedback.comments || 'No additional comments'}</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}