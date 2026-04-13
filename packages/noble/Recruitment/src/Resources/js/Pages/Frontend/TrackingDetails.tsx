import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    Clock,
    MapPin,
    DollarSign,
    Briefcase,
    Mail,
    Phone,
    Copy,
    Check,
    Video,
    ExternalLink,
    Calendar,
    Star,
} from 'lucide-react';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { useFormFields } from '@/hooks/useFormFields';

interface JobDetails {
    title: string;
    location: string;
    jobType: string;
    salaryFrom: number;
    salaryTo: number;
    department: string;
}

interface CandidateDetails {
    fullName: string;
    email: string;
    phone: string;
    appliedDate: string;
}

interface ApplicationStatus {
    currentStatus: number;
    timeline: {
        status: number;
        title: string;
        description: string;
        date: string | null;
        completed: boolean;
        details?: any;
    }[];
}

interface InterviewDetails {
    id: number;
    date: string;
    time: string;
    duration: string;
    location: string;
    meeting_link: string;
    round: string;
    type: string;
    status: string;
}

interface OfferDetails {
    id: number;
    offer_date: string;
    position: string;
    salary: number;
    bonus: number;
    start_date: string;
    expiration_date: string;
    status: string;
    benefits: string;
}

interface TrackingDetailsProps {
    trackingId: string;
    userSlug: string;
    brandSettings: {
        logo: string;
        favicon: string;
        titleText: string;
        footerText: string;
    };
    jobDetails?: JobDetails;
    candidateDetails?: CandidateDetails;
    applicationStatus?: ApplicationStatus;
    interviewDetails?: InterviewDetails;
    offerDetails?: OfferDetails;
    needHelp?: {
        title: string;
        description: string;
        email: string;
        phone: string;
    } | null;
}

export default function TrackingDetails({
    trackingId,
    userSlug,
    brandSettings,
    jobDetails,
    candidateDetails,
    applicationStatus,
    interviewDetails,
    offerDetails,
    needHelp,
}: TrackingDetailsProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');
    const [updatingOffer, setUpdatingOffer] = useState<number | null>(null);

    // Fallback application data when no real data is available
    const fallbackApplication = {
        currentStatus: 0,
        timeline: [
            {
                status: 0,
                title: t('Application Submitted'),
                description: t('Your application has been successfully submitted'),
                date: new Date().toISOString().split('T')[0],
                completed: true,
            },
            {
                status: 1,
                title: t('Screening'),
                description: t('Your application is being screened by our team'),
                date: null,
                completed: false,
            },
            {
                status: 2,
                title: t('Interview'),
                description: t('Interview process will be scheduled'),
                date: null,
                completed: false,
            },
            {
                status: 3,
                title: t('Offer'),
                description: t('Job offer decision pending'),
                date: null,
                completed: false,
            },
            {
                status: 4,
                title: t('Final Decision'),
                description: t('We will notify you of our final decision'),
                date: null,
                completed: false,
            },
        ],
    };

    const handleOfferResponse = async (offerId: number, status: string) => {
        setUpdatingOffer(offerId);

        router.post(
            route('recruitment.frontend.careers.offer.respond', { userSlug, offerId }),
            {
                status: status,
            },
            {
                onSuccess: () => {
                    setUpdatingOffer(null);
                },
                onError: () => {
                    setUpdatingOffer(null);
                },
            }
        );
    };

    const copyTrackingId = async () => {
        try {
            await navigator.clipboard.writeText(trackingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy tracking ID:', err);
        }
    };

    const formatSalary = (from: number, to: number) => {
        return `${formatCurrency(from)} - ${formatCurrency(to)}`;
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0:
                return 'bg-muted text-foreground';
            case 1:
                return 'bg-muted text-foreground';
            case 2:
                return 'bg-muted text-foreground';
            case 3:
                return 'bg-muted text-foreground';
            case 4:
                return 'bg-muted text-foreground';
            case 5:
                return 'bg-muted text-destructive';
            default:
                return 'bg-muted text-foreground';
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 0:
                return t('New');
            case 1:
                return t('Screening');
            case 2:
                return t('Interview');
            case 3:
                return t('Offer');
            case 4:
                return t('Hired');
            case 5:
                return t('Rejected');
            default:
                return t('Pending');
        }
    };

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 0:
                return <CheckCircle className="h-6 w-6 text-foreground" />;
            case 1:
                return <Clock className="h-6 w-6 text-muted-foreground" />;
            case 2:
                return <Clock className="h-6 w-6 text-foreground" />;
            case 3:
                return <Clock className="h-6 w-6 text-foreground" />;
            case 4:
                return <CheckCircle className="h-6 w-6 text-foreground" />;
            case 5:
                return <CheckCircle className="h-6 w-6 text-destructive" />;
            default:
                return <Clock className="h-6 w-6 text-muted-foreground" />;
        }
    };

    const getTimelineIcon = (status: number, completed: boolean, currentStatus: number) => {
        if (completed) {
            return <CheckCircle className="h-6 w-6 text-foreground" />;
        } else if (status === currentStatus) {
            return <Clock className="h-6 w-6 text-muted-foreground" />;
        } else {
            return <div className="h-6 w-6 rounded-full border-2 border-border bg-card"></div>;
        }
    };

    // Use real application status or fallback
    const appStatus = applicationStatus || fallbackApplication;

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings} currentPage="track">
            <Head title={`${t('Application Status')} - ${trackingId}`} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        {/* Current Status Card */}
                        <Card className="mb-8 border-s-4 border-s-slate-600 shadow-sm">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="mb-2 text-xl font-bold text-foreground">
                                            {t('Current Status')}
                                        </h2>
                                        <Badge
                                            className={`px-3 py-1 text-base ${getStatusColor(appStatus.currentStatus)} hover:${getStatusColor(appStatus.currentStatus)}`}
                                        >
                                            {getStatusText(appStatus.currentStatus)}
                                        </Badge>
                                    </div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        {getStatusIcon(appStatus.currentStatus)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="mb-1 text-sm font-medium text-foreground">
                                                {t('Tracking ID')}
                                            </h3>
                                            <p className="font-mono text-xl font-bold tracking-wider text-foreground">
                                                {trackingId}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-border text-foreground hover:bg-muted/50"
                                            onClick={copyTrackingId}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="me-1 h-4 w-4" />
                                                    {t('Copied')}
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="me-1 h-4 w-4" />
                                                    {t('Copy ID')}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Timeline */}
                        <Card className="shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="mb-6 border-b border-border pb-3 text-xl font-bold text-foreground">
                                    {t('Application Timeline')}
                                </h2>

                                <div className="space-y-6">
                                    {appStatus.timeline?.map((step, index) => (
                                        <div key={step.status} className="flex items-start space-x-4">
                                            <div className="relative flex-shrink-0">
                                                {getTimelineIcon(step.status, step.completed, appStatus.currentStatus)}
                                                {index < appStatus.timeline.length - 1 && (
                                                    <div className="absolute start-3 top-8 h-12 w-0.5 bg-muted"></div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 pb-2">
                                                <div className="mb-1 flex items-center justify-between">
                                                    <h3
                                                        className={`text-base font-semibold ${step.completed ? 'text-foreground' : step.status === appStatus.currentStatus ? 'text-foreground' : 'text-muted-foreground'}`}
                                                    >
                                                        {step.title}
                                                    </h3>
                                                    {step.date && (
                                                        <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                            {new Date(step.date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p
                                                    className={`text-sm ${step.completed ? 'text-muted-foreground' : step.status === appStatus.currentStatus ? 'text-muted-foreground' : 'text-muted-foreground'}`}
                                                >
                                                    {step.description}
                                                </p>

                                                {/* Interview Details */}
                                                {step.status === 2 && step.details && (
                                                    <div className="mt-3 rounded-lg border border-border bg-muted/50 p-3">
                                                        <h4 className="mb-2 text-sm font-medium text-foreground">
                                                            {t('Interview Details')}
                                                        </h4>
                                                        <div className="space-y-2 text-sm text-foreground">
                                                            <div className="flex items-center">
                                                                <Calendar className="me-2 h-4 w-4" />
                                                                <span>
                                                                    {formatDate(step.details.date)} at{' '}
                                                                    {step.details.time}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Clock className="me-2 h-4 w-4" />
                                                                <span>
                                                                    {t('Duration')}: {step.details.duration}{' '}
                                                                    {t('minutes')}
                                                                </span>
                                                            </div>
                                                            {step.details.location && (
                                                                <div className="flex items-center">
                                                                    <MapPin className="me-2 h-4 w-4" />
                                                                    <span>{step.details.location}</span>
                                                                </div>
                                                            )}
                                                            {step.details.meeting_link && (
                                                                <div className="flex items-center">
                                                                    <Video className="me-2 h-4 w-4" />
                                                                    <a
                                                                        href={step.details.meeting_link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-foreground underline hover:text-foreground"
                                                                    >
                                                                        {t('Join Meeting')}{' '}
                                                                        <ExternalLink className="ms-1 inline h-3 w-3" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-xs text-foreground">
                                                                    {step.details.round} - {step.details.type}
                                                                </div>
                                                                <div className="text-xs">
                                                                    {step.details.status === '0' && (
                                                                        <span className="rounded bg-muted px-2 py-1 text-foreground">
                                                                            {t('Scheduled')}
                                                                        </span>
                                                                    )}
                                                                    {step.details.status === '1' && (
                                                                        <span className="rounded bg-muted px-2 py-1 text-foreground">
                                                                            {t('Completed')}
                                                                        </span>
                                                                    )}
                                                                    {step.details.status === '2' && (
                                                                        <span className="rounded bg-muted px-2 py-1 text-destructive">
                                                                            {t('Cancelled')}
                                                                        </span>
                                                                    )}
                                                                    {step.details.status === '3' && (
                                                                        <span className="rounded bg-muted px-2 py-1 text-foreground">
                                                                            {t('No Show')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Offer Details */}
                                                {step.status === 3 && step.details && (
                                                    <div className="mt-3 rounded-lg border border-border bg-muted/50 p-4">
                                                        <h4 className="mb-3 text-sm font-medium text-foreground">
                                                            {t('Offer Details')}
                                                        </h4>
                                                        <div className="mb-4 space-y-2 text-sm text-foreground">
                                                            <div className="flex items-center">
                                                                <Briefcase className="me-2 h-4 w-4" />
                                                                <span>
                                                                    {t('Position')}: {step.details.position}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <DollarSign className="me-2 h-4 w-4" />
                                                                <span>
                                                                    {t('Salary')}: $
                                                                    {step.details.salary?.toLocaleString()}/{t('year')}
                                                                </span>
                                                            </div>
                                                            {step.details.bonus > 0 && (
                                                                <div className="flex items-center">
                                                                    <Star className="me-2 h-4 w-4" />
                                                                    <span>
                                                                        {t('Bonus')}: $
                                                                        {step.details.bonus?.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center">
                                                                <Calendar className="me-2 h-4 w-4" />
                                                                <span>
                                                                    {t('Start Date')}:{' '}
                                                                    {formatDate(step.details.start_date)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Clock className="me-2 h-4 w-4" />
                                                                <span>
                                                                    {t('Expires')}:{' '}
                                                                    {formatDate(step.details.expiration_date)}
                                                                </span>
                                                            </div>
                                                            {step.details.benefits && (
                                                                <div className="mt-2">
                                                                    <span className="font-medium">
                                                                        {t('Benefits')}:
                                                                    </span>
                                                                    <p className="mt-1 text-xs">
                                                                        {step.details.benefits}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Accept/Decline Buttons */}
                                                        {step.details.status === '1' && (
                                                            <div className="flex space-x-3">
                                                                <Button
                                                                    className="flex-1 bg-foreground text-background hover:bg-foreground/80"
                                                                    onClick={() =>
                                                                        handleOfferResponse(step.details.id, '2')
                                                                    }
                                                                    disabled={updatingOffer === step.details.id}
                                                                >
                                                                    <Check className="me-2 h-4 w-4" />
                                                                    {updatingOffer === step.details.id
                                                                        ? t('Accepting...')
                                                                        : t('Accept Offer')}
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1 border-border text-destructive hover:bg-muted/50"
                                                                    onClick={() =>
                                                                        handleOfferResponse(step.details.id, '4')
                                                                    }
                                                                    disabled={updatingOffer === step.details.id}
                                                                >
                                                                    {updatingOffer === step.details.id
                                                                        ? t('Declining...')
                                                                        : t('Decline Offer')}
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {step.details.status === '2' && (
                                                            <div className="rounded bg-muted px-3 py-2 text-center text-sm font-medium text-foreground">
                                                                ✓ {t('Offer Accepted')}
                                                            </div>
                                                        )}

                                                        {step.details.status === '3' && (
                                                            <div className="rounded bg-muted px-3 py-2 text-center text-sm font-medium text-foreground">
                                                                ↻ {t('Negotiating')}
                                                            </div>
                                                        )}

                                                        {step.details.status === '4' && (
                                                            <div className="rounded bg-muted px-3 py-2 text-center text-sm font-medium text-destructive">
                                                                ✗ {t('Offer Declined')}
                                                            </div>
                                                        )}

                                                        {step.details.status === '5' && (
                                                            <div className="rounded bg-muted px-3 py-2 text-center text-sm font-medium text-foreground">
                                                                ⏰ {t('Offer Expired')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 lg:w-1/3">
                        {/* Job Details Card */}
                        <Card className="shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="mb-4 border-b border-border pb-2 text-base font-semibold text-foreground">
                                    {t('Job Details')}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="mb-1 font-medium text-foreground">
                                            {jobDetails?.title || 'N/A'}
                                        </h4>
                                        <div className="mb-2 flex items-center text-sm text-muted-foreground">
                                            <MapPin className="me-1 h-4 w-4" />
                                            {jobDetails?.location || 'N/A'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="rounded-lg bg-muted/50 p-3">
                                            <div className="flex items-center">
                                                <DollarSign className="me-2 h-4 w-4 text-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('Salary')}</p>
                                                    <p className="font-medium text-foreground">
                                                        {jobDetails
                                                            ? formatSalary(jobDetails.salaryFrom, jobDetails.salaryTo)
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-3">
                                            <div className="flex items-center">
                                                <Briefcase className="me-2 h-4 w-4 text-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">{t('Type')}</p>
                                                    <p className="font-medium text-foreground">
                                                        {jobDetails?.jobType || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">{t('Department')}</p>
                                        <p className="font-medium text-foreground">{jobDetails?.department || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Applicant Details Card */}
                        <Card className="shadow-sm">
                            <CardContent className="p-5">
                                <h3 className="mb-4 border-b border-border pb-2 text-base font-semibold text-foreground">
                                    {t('Your Details')}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">{t('Full Name')}</p>
                                        <p className="font-medium text-foreground">
                                            {candidateDetails?.fullName || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">{t('Email')}</p>
                                        <p className="font-medium text-foreground">
                                            {candidateDetails?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">{t('Phone')}</p>
                                        <p className="font-medium text-foreground">
                                            {candidateDetails?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">{t('Applied Date')}</p>
                                        <p className="font-medium text-foreground">
                                            {candidateDetails?.appliedDate
                                                ? formatDate(candidateDetails.appliedDate)
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Need Help Card - Dynamic */}
                        {needHelp && (
                            <Card className="bg-muted/50 shadow-sm">
                                <CardContent className="p-5">
                                    <h3 className="mb-4 border-b border-border pb-2 text-base font-semibold text-foreground">
                                        {needHelp.title}
                                    </h3>

                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">{needHelp.description}</p>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Mail className="me-2 h-4 w-4" />
                                                <span>{needHelp.email}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Phone className="me-2 h-4 w-4" />
                                                <span>{needHelp.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Integration Widgets (Tawk.to, etc.) */}
            {integrationFields?.map((field) => (
                <div key={field.id}>{field.component}</div>
            ))}
        </FrontendLayout>
    );
}
