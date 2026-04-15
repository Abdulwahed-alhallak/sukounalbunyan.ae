import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FrontendLayout from '../../Components/Frontend/FrontendLayout';
import { useFormFields } from '@/hooks/useFormFields';

interface Job {
    id: number;
    encrypted_id: string;
    title: string;
    terms_condition?: string;
}

interface JobTermsProps {
    [key: string]: any;
    job: Job;
    userSlug: string;
    brandSettings: {
        logo?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
    };
}

export default function JobTerms({ job, userSlug, brandSettings }: JobTermsProps) {
    const { t } = useTranslation();

    const integrationFields = useFormFields('getIntegrationFields', {}, () => {}, {}, 'create', t, 'Recruitment');

    return (
        <FrontendLayout userSlug={userSlug} brandSettings={brandSettings}>
            <Head title={`Terms & Conditions - ${job.title}`} />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-foreground">{t('Terms & Conditions')}</h1>
                    <p className="text-muted-foreground">
                        {t('For position')} : {job.title}
                    </p>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="p-8">
                        {job.terms_condition ? (
                            <div
                                className="prose prose-lg max-w-none leading-relaxed text-foreground"
                                dangerouslySetInnerHTML={{ __html: job.terms_condition }}
                            />
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-lg text-muted-foreground">
                                    {t('No terms and conditions specified for this position.')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Integration Widgets (Tawk.to, etc.) */}
            {integrationFields?.map((field) => (
                <div key={field.id}>{field.component}</div>
            ))}
        </FrontendLayout>
    );
}
