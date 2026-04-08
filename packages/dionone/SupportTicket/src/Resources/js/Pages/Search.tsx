import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Layout from './Layout';
import { Search, Ticket, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchProps {
    workspace: any;
}

export default function SearchPage({ workspace }: SearchProps) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        ticket_id: '',
        email: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ticket.search', workspace.slug));
    };

    return (
        <Layout title={t('Search Tickets')}>
            <div className="text-center lg:mb-8 mb-6">
                <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-foreground">{t('Search Your Ticket')}</h2>
                <p className="text-muted-foreground mt-2">{t('Enter your ticket ID and email to view your ticket status')}</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <Card className="shadow-md">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Ticket className="inline h-4 w-4 mr-1" />
                                    {t('Ticket ID')} *
                                </label>
                                <Input
                                    value={data.ticket_id}
                                    onChange={(e) => setData('ticket_id', e.target.value)}
                                    placeholder={t('Enter your ticket ID')}
                                    required
                                    className={errors.ticket_id ? 'border-destructive' : ''}
                                />
                                {errors.ticket_id && <p className="text-destructive text-sm mt-1">{errors.ticket_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Mail className="inline h-4 w-4 mr-1" />
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
                                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div className="text-center">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-foreground hover:bg-foreground px-8"
                                >
                                    <Search className="h-4 w-4 mr-2" />
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