import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SupportTicketLayout from './Layouts/SupportTicketLayout';
import { getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { Search, Ticket, Mail } from 'lucide-react';

interface SearchFormData {
    ticket_id: string;
    email: string;
}

interface SearchTicketProps {
    settings: {
        faq_is_on: string;
        knowledge_base_is_on: string;
    };
    brandSettings?: {
        logo_dark?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
        privacyEnabled?: boolean;
        termsEnabled?: boolean;
    };
    titleSections?: {
        search_ticket?: {
            title: string;
            description: string;
        };
    };
    slug: string;
}

export default function SearchTicket({ settings, brandSettings, titleSections, slug }: SearchTicketProps) {
    const { t } = useTranslation();
    const pageTitle = titleSections?.search_ticket?.title || t('Find Your Support Ticket');
    const pageDescription =
        titleSections?.search_ticket?.description || t('Track the status of your existing support tickets');

    const { data, setData, post, processing, errors } = useForm({
        ticket_id: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('support-ticket.search.post', [slug]));
    };

    return (
        <SupportTicketLayout title={pageTitle} settings={settings} brandSettings={brandSettings}>
            {/* Page Title */}
            <div className="mb-6 text-center lg:mb-8">
                <h2 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">{pageTitle}</h2>
                <p className="mt-2 text-muted-foreground">{pageDescription}</p>
            </div>

            <div className="mx-auto max-w-4xl">
                <Card className="shadow-md">
                    <CardContent className="p-4 md:p-8">
                        <div className="relative overflow-hidden rounded-xl bg-foreground p-4 shadow-md md:p-6">
                            <div className="flex flex-col-reverse items-center gap-6 md:flex-row md:gap-8">
                                <div className="w-full md:w-1/3">
                                    <img
                                        src={getImagePath(
                                            'packages/noble/SupportTicket/src/Resources/assets/images/search-person.svg'
                                        )}
                                        alt="Search illustration"
                                        className="h-auto w-full"
                                    />
                                </div>
                                <div className="w-full text-background md:w-2/3">
                                    <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl lg:text-3xl">
                                        {t('Find Your Ticket')}
                                    </h2>
                                    <p className="mb-4">
                                        {t(
                                            'Enter your ticket ID and email to check the status of your support request'
                                        )}
                                    </p>

                                    {/* Search Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Ticket className="h-5 w-5 text-background/70" />
                                            </div>
                                            <Input
                                                type="text"
                                                value={data.ticket_id}
                                                onChange={(e) => setData('ticket_id', e.target.value)}
                                                placeholder={t('Enter Ticket ID (e.g., TKT-123456)')}
                                                className="w-full rounded-lg border border-white/30 bg-card/10 py-3 pl-10 pr-4 text-background placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                                                required
                                            />
                                            {errors.ticket_id && (
                                                <p className="mt-1 text-sm text-destructive/70">{errors.ticket_id}</p>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Mail className="h-5 w-5 text-background/70" />
                                            </div>
                                            <Input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder={t('Email address used for the ticket')}
                                                className="w-full rounded-lg border border-white/30 bg-card/10 py-3 pl-10 pr-4 text-background placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-destructive/70">{errors.email}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-card text-foreground shadow-md transition duration-300 hover:bg-muted hover:shadow-lg md:w-auto"
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            {processing ? t('Searching...') : t('Search Ticket')}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SupportTicketLayout>
    );
}
