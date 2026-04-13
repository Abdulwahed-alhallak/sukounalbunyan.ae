import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface ErrorProps {
    status: number;
}

export default function Error({ status }: ErrorProps) {
    const { t } = useTranslation();
    
    const title =
        {
            503: t('Service Unavailable'),
            500: t('Server Error'),
            404: t('Page Not Found'),
            403: t('Forbidden'),
        }[status] || t('Error');

    const description =
        {
            503: t('Sorry, we are doing some maintenance. Please check back soon.'),
            500: t('Whoops, something went wrong on our servers.'),
            404: t('Sorry, the page you are looking for could not be found.'),
            403: t('Sorry, you are forbidden from accessing this page.'),
        }[status] || t('An unexpected error occurred.');

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <Head title={title} />
            <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-card">
                <div className="p-8">
                    <div className="mb-8">
                        <div className="text-9xl font-black text-foreground/10">{status}</div>
                    </div>

                    <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">{title}</h1>

                    <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{description}</p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <svg
                            className="-ms-1 me-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        {t('Return to Dashboard')}
                    </Link>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-muted/50 px-8 py-4">
                    <div className="text-xs font-medium tracking-wide text-muted-foreground">
                        {t('Noble Architecture ECOSYSTEM')}
                    </div>
                    <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-foreground/20"></div>
                        <div className="h-2 w-2 rounded-full bg-foreground/15"></div>
                        <div className="h-2 w-2 rounded-full bg-foreground/10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
