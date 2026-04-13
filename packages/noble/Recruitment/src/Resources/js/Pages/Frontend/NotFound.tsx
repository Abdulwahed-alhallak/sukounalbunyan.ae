import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { AlertTriangle, Home, Search, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
    userSlug: string;
    brandSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
}

export default function NotFound({ userSlug, brandSettings }: NotFoundProps) {
    const { t } = useTranslation();

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings}>
            <Head title={t('Page Not Found')} />

            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <Card className="border shadow-sm">
                    <CardContent className="p-12 text-center">
                        {/* Error Icon */}
                        <div className="mb-8">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                <AlertTriangle className="h-12 w-12 text-destructive" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="mb-8">
                            <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
                            <h2 className="mb-4 text-3xl font-bold text-foreground">{t('Page Not Found')}</h2>
                            <p className="mb-2 text-lg text-muted-foreground">
                                {t('Sorry, the page you are looking for could not be found.')}
                            </p>
                            <p className="text-muted-foreground">
                                {t('The page may have been moved, deleted, or you may have entered an incorrect URL.')}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                className="bg-muted px-6 py-3 text-background hover:bg-card"
                                onClick={() =>
                                    (window.location.href = route('recruitment.frontend.careers.jobs.index', {
                                        userSlug,
                                    }))
                                }
                            >
                                <Home className="mr-2 h-5 w-5" />
                                {t('Back to Jobs')}
                            </Button>

                            <Button
                                variant="outline"
                                className="border-border px-6 py-3 text-foreground hover:bg-muted/50"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                {t('Go Back')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FrontendLayout>
    );
}
