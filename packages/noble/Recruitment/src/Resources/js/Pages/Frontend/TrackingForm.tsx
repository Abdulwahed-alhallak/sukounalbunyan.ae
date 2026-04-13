import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, HelpCircle, Mail, Hash } from 'lucide-react';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { useFormFields } from '@/hooks/useFormFields';

interface TrackingFormProps {
    userSlug: string;
    brandSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
    trackingFaq?:
        | {
              question: string;
              answer: string;
          }[]
        | null;
}

export default function TrackingForm({ userSlug, brandSettings, trackingFaq }: TrackingFormProps) {
    const { t } = useTranslation();

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');

    const [formData, setFormData] = useState({
        trackingId: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.trackingId.trim() || !formData.email.trim()) {
            setError(t('Please fill in both tracking ID and email address'));
            return;
        }

        setIsSubmitting(true);
        setError('');

        // Submit form data to backend for validation
        router.post(
            route('recruitment.frontend.careers.track.verify', { userSlug }),
            {
                tracking_id: formData.trackingId.trim(),
                email: formData.email.trim(),
            },
            {
                onSuccess: (page) => {
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    if (errors.message) {
                        setError(errors.message);
                    } else {
                        setError(t('Invalid tracking ID or email address. Please check your details and try again.'));
                    }
                },
            }
        );
    };

    const isFormValid = () => {
        return formData.trackingId.trim() && formData.email.trim();
    };

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings} currentPage="track-form">
            <Head title={t('Track Your Application')} />

            <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground">{t('Check Your Application Status')}</h2>
                    <p className="mb-2 text-lg text-muted-foreground">
                        {t('Enter your tracking ID and email address to view your application progress')}
                    </p>
                </div>

                {/* Tracking Form */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Tracking ID */}
                            <div>
                                <Label htmlFor="trackingId" className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Tracking ID')}
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        id="trackingId"
                                        type="text"
                                        value={formData.trackingId}
                                        onChange={(e) => handleInputChange('trackingId', e.target.value.toUpperCase())}
                                        placeholder={t('Enter tracking id')}
                                        className="h-12 pl-10"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t('Format')}: {t('TRK11A1BC1D1111E')}
                                </p>
                            </div>

                            {/* Email Address */}
                            <div>
                                <Label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                                    {t('Email Address')}
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder={t('Enter the email address')}
                                        className="h-12 pl-10"
                                        required
                                    />
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t('Use the same email address you provided during application')}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="rounded-lg border border-border bg-muted/50 p-4">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="h-12 w-full bg-muted text-lg text-background hover:bg-card"
                                    disabled={!isFormValid() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                                            {t('Searching...')}
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <Search className="mr-2 h-5 w-5" />
                                            {t('Track Application')}
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Section */}
                {trackingFaq && trackingFaq.length > 0 && (
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <HelpCircle className="h-6 w-6 text-foreground" />
                                </div>
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold text-foreground">{t('Need Help?')}</h3>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        {trackingFaq?.map((faq, index) => (
                                            <div key={index}>
                                                <h4 className="font-medium text-foreground">{faq.question}</h4>
                                                <p>{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Integration Widgets (Tawk.to, etc.) */}
            {integrationFields?.map((field) => (
                <div key={field.id}>{field.component}</div>
            ))}
        </FrontendLayout>
    );
}
