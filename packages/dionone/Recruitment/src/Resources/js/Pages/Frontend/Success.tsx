import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Search, Clock, Mail, Phone, Check, Briefcase, User, FileText, Calendar, Star, Award, Target, Zap } from 'lucide-react';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { useFormFields } from '@/hooks/useFormFields';

interface SuccessProps {
    userSlug: string;
    brandSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
    applicationData: {
        trackingId: string;
        jobTitle: string;
        appliedDate: string;
        applicantName: string;
        email: string;
    };
    errorMessage?: string;
    whatHappensNext: {
        title: string;
        description: string;
        icon: string;
    }[];
    needHelp?: {
        title: string;
        description: string;
        email: string;
        phone: string;
    } | null;
}

export default function Success({ userSlug, brandSettings, applicationData, errorMessage, whatHappensNext, needHelp }: SuccessProps) {
    const { t } = useTranslation();
    const [copySuccess, setCopySuccess] = useState(false);

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');

    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: React.ComponentType<any> } = {
            'mail': Mail,
            'clock': Clock,
            'phone': Phone,
            'briefcase': Briefcase,
            'user': User,
            'filetext': FileText,
            'calendar': Calendar,
            'star': Star,
            'award': Award,
            'target': Target,
            'zap': Zap,
        };
        const IconComponent = iconMap[iconName.toLowerCase()] || Mail;
        return IconComponent;
    };

    const getIconColor = (iconName: string) => {
        const colorMap: { [key: string]: { bg: string; text: string } } = {
            'mail': { bg: 'bg-muted', text: 'text-foreground' },
            'clock': { bg: 'bg-muted', text: 'text-muted-foreground' },
            'phone': { bg: 'bg-muted', text: 'text-foreground' },
            'briefcase': { bg: 'bg-muted', text: 'text-foreground' },
            'user': { bg: 'bg-muted', text: 'text-foreground' },
            'filetext': { bg: 'bg-muted', text: 'text-muted-foreground' },
            'calendar': { bg: 'bg-muted', text: 'text-destructive' },
            'star': { bg: 'bg-muted', text: 'text-foreground' },
            'award': { bg: 'bg-muted', text: 'text-foreground' },
            'target': { bg: 'bg-muted', text: 'text-foreground' },
            'zap': { bg: 'bg-muted', text: 'text-foreground' },
        };
        return colorMap[iconName.toLowerCase()] || { bg: 'bg-muted', text: 'text-foreground' };
    };

    const copyTrackingId = async () => {
        try {
            await navigator.clipboard.writeText(applicationData.trackingId);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = applicationData.trackingId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        }
    };

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings}>
            <Head title="Application Submitted Successfully" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-8 p-4 bg-muted/50 border border-border rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                <div className="text-center mb-12">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-6">
                        <CheckCircle className="h-12 w-12 text-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t('Application Submitted Successfully!')}</h1>
                    <p className="text-xl text-muted-foreground mb-2">{t('Thank you for your interest in joining our team.')}</p>
                    <p className="text-muted-foreground">{t('We have received your application and will review it shortly.')}</p>
                </div>

                {/* Application Details Card */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-semibold text-foreground mb-6">{t('Application Details')}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('Position Applied For')}</h3>
                                <p className="text-lg font-semibold text-foreground">{applicationData.jobTitle}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('Application Date')}</h3>
                                <p className="text-lg font-semibold text-foreground">{formatDate(applicationData.appliedDate)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('Applicant Name')}</h3>
                                <p className="text-lg font-semibold text-foreground">{applicationData.applicantName}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('Email Address')}</h3>
                                <p className="text-lg font-semibold text-foreground">{applicationData.email}</p>
                            </div>
                        </div>

                        {/* Tracking ID Section */}
                        <div className="bg-muted/50 rounded-lg p-8 mb-8 text-center">
                            <h3 className="text-xl font-semibold text-foreground mb-3">{t('Your Tracking ID')}</h3>
                            <p className="text-muted-foreground mb-6">{t('Save this ID to track your application status')}</p>
                            <div className="flex flex-col items-center space-y-4">
                                <Badge className="bg-muted text-background text-xl px-6 py-3 font-mono tracking-wider">
                                    {applicationData.trackingId}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyTrackingId}
                                    className={`text-foreground border-border hover:bg-muted ${copySuccess ? 'bg-muted/50 border-border text-foreground' : ''}`}
                                >
                                    {copySuccess ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            {t('Copied!')}
                                        </>
                                    ) : (
                                        'Copy Tracking ID'
                                    )}
                                </Button>
                                {copySuccess && (
                                    <div className="mt-2 text-sm text-foreground font-medium">
                                        ✓ {t('Tracking ID copied to clipboard')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center">
                            <Button
                                className="bg-muted hover:bg-card text-background px-8 py-3 text-lg"
                                onClick={() => window.location.href = route('recruitment.frontend.careers.track.form', { userSlug })}
                            >
                                {t('Track Application Status')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* What's Next Section */}
                {whatHappensNext && whatHappensNext.length > 0 && (
                    <Card className="mb-8 shadow-sm">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-semibold text-foreground mb-6">{t('What Happens Next?')}</h2>

                            <div className="space-y-6">
                                {whatHappensNext?.map((step, index) => {
                                    const IconComponent = getIconComponent(step.icon);
                                    const iconColors = getIconColor(step.icon);

                                    return (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${iconColors.bg}`}>
                                                    <IconComponent className={`h-5 w-5 ${iconColors.text}`} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                                                <p className="text-muted-foreground">{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Additional Actions */}
                <div className="text-center space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted/50"
                            onClick={() => router.visit(route('recruitment.frontend.careers.jobs.index', { userSlug }))}
                        >
                            <Search className="h-4 w-4 mr-2" />
                            {t('Browse More Jobs')}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted/50"
                            onClick={() => router.visit(route('recruitment.frontend.careers.track.form', { userSlug }))}
                        >
                            {t('Track Another Application')}
                        </Button>
                    </div>

                    {needHelp && (
                        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold text-foreground mb-2">{needHelp.title}</h3>
                            <p className="text-muted-foreground mb-4">
                                {needHelp.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground">
                                <span>📧 {needHelp.email}</span>
                                <span className="hidden sm:inline">|</span>
                                <span>📞 {needHelp.phone}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Integration Widgets (Tawk.to, etc.) */}
            {integrationFields?.map((field) => (
                <div key={field.id}>
                    {field.component}
                </div>
            ))}
        </FrontendLayout>
    );
}