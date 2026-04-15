import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Layout from './Layout';
import { Search, Ticket, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchProps {
    [key: string]: any;
    workspace: any;
}

export default function SearchPage({ workspace }: SearchProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        ticket_id: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ticket.search', workspace.slug));
    };

    return (
        <Layout title={t('Search Tickets')}>
            <div className="mb-6 text-center lg:mb-8">
                <h2 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">{t('Search Your Ticket')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('Enter your ticket ID and email to view your ticket status')}
                </p>
            </div>

            <div className="mx-auto max-w-2xl">
                <Card className="shadow-md">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    <Ticket className="me-1 inline h-4 w-4" />
                                    {t('Ticket ID')} *
                                </label>
                                <Input
                                    value={data.ticket_id}
                                    onChange={(e) => setData('ticket_id', e.target.value)}
                                    placeholder={t('Enter your ticket ID')}
                                    required
                                    className={errors.ticket_id ? 'border-destructive' : ''}
                                />
                                {errors.ticket_id && (
                                    <p className="mt-1 text-sm text-destructive">{errors.ticket_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    <Mail className="me-1 inline h-4 w-4" />
                                    {t('Email Address')} *
                                </label>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('Enter your email address')}
                                    required
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                            </div>

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-foreground px-8 hover:bg-foreground"
                                >
                                    <Search className="me-2 h-4 w-4" />
                                    {processing ? t('Searching...') : t('Search Ticket')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
