import React, { useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import SupportTicketLayout from './Frontend/Layouts/SupportTicketLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Paperclip, Send, Ticket, ThumbsUp } from 'lucide-react';

import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { route } from 'ziggy-js';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/utils/helpers';

interface Attachment {
    name: string;
    path: string;
}

interface Conversion {
    id: number;
    description: string;
    sender: string;
    created_at: string;
    attachments: Attachment[];
    replyBy: { name: string };
}

interface TicketData {
    id: number;
    ticket_id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    description: string;
    created_at: string;
    attachments: Attachment[];
    conversions: Conversion[];
}

interface ShowProps {
    [key: string]: any;
    ticket: TicketData;
    workspace?: any;
    settings?: {
        faq_is_on?: string;
        knowledge_base_is_on?: string;
        privacy_policy_enabled?: boolean;
        terms_conditions_enabled?: boolean;
    };
    brandSettings?: {
        logo_dark?: string;
        favicon?: string;
        titleText?: string;
        footerText?: string;
        privacyEnabled?: boolean;
        termsEnabled?: boolean;
        customPages?: Array<{
            slug: string;
            name: string;
        }>;
    };
    slug: string;
}

export default function Show({ ticket, workspace, settings, brandSettings, slug }: ShowProps) {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data, setData, processing, errors, reset } = useForm({
        reply_description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('description', data.reply_description);

        if (selectedFiles && selectedFiles.length > 0) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('files[]', selectedFiles[i]);
            }
        }

        // Check if this is admin view or public view
        const isAdminView = window.location.pathname.includes('/support-tickets/');

        // Get encrypted ticket ID from URL
        const urlParts = window.location.pathname.split('/');
        const encryptedTicketId = urlParts[urlParts.length - 1];

        router.post(
            route('support-ticket.send-conversion.store', {
                slug: slug,
                ticketId: encryptedTicketId,
            }),
            formData,
            {
                onSuccess: () => {
                    reset();
                    setSelectedFiles(null);
                    setImagePreviews([]);
                },
                onError: (errors) => {},
            }
        );
    };

    const toggleToolbar = (tool: string) => {
        setActiveToolbar((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
    };

    const formatDate = (dateString: string) => {
        return formatDateTime(dateString);
    };

    const getStatusColor = (status: string) => {
        const colors = {
            open: 'bg-muted text-foreground',
            Open: 'bg-muted text-foreground',
            'In Progress': 'bg-muted text-foreground',
            closed: 'bg-muted text-destructive',
            Closed: 'bg-muted text-destructive',
            'On Hold': 'bg-muted text-foreground',
        };
        return colors[status as keyof typeof colors] || 'bg-muted text-foreground';
    };

    return (
        <SupportTicketLayout title={`Ticket - ${ticket.ticket_id}`} settings={settings} brandSettings={brandSettings}>
            {/* Ticket ID Header */}
            <div className="mb-8 flex justify-center">
                <div className="inline-block rounded-full bg-foreground px-6 py-3 text-background shadow-lg">
                    <div className="flex items-center space-x-2">
                        <Ticket className="h-5 w-5" />
                        <span className="font-semibold">
                            {t('Ticket')} - {ticket.ticket_id}
                        </span>
                    </div>
                </div>
            </div>

            {/* Ticket Info and Conversation */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Conversation */}
                <div className="lg:col-span-2">
                    {/* Ticket Subject */}
                    <Card className="mb-6 shadow-md">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col justify-between gap-y-2 md:flex-row md:items-center">
                                <h2 className="text-xl font-bold text-foreground md:text-2xl">{ticket.subject}</h2>
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(ticket.status)}`}
                                >
                                    {ticket.status}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                <div>
                                    <span className="block text-muted-foreground">Created:</span>
                                    <span className="font-medium">{formatDateTime(ticket.created_at)}</span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground">Customer:</span>
                                    <span className="font-medium">{ticket.name}</span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground">Email:</span>
                                    <span className="font-medium">{ticket.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Original Message */}
                    <div className="mb-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60 font-semibold text-background md:h-10 md:w-10">
                                    {ticket.name ? ticket.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>
                            <div className="flex-grow">
                                <div className="mb-2 flex flex-col justify-between md:flex-row md:items-center">
                                    <div>
                                        <span className="font-medium text-foreground">{ticket.name}</span>
                                        <span className="ms-2 text-sm text-muted-foreground">
                                            ({formatDate(ticket.created_at)})
                                        </span>
                                    </div>
                                </div>
                                <div className="rounded-xl border-s-4 border-foreground bg-muted/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                    <div dangerouslySetInnerHTML={{ __html: ticket.description }} />

                                    {/* Attachments */}
                                    {ticket.attachments &&
                                        Array.isArray(ticket.attachments) &&
                                        ticket.attachments.length > 0 && (
                                            <div className="mt-4 rounded-lg border border-border bg-card/50 p-3">
                                                <b className="mb-2 flex items-center gap-2">
                                                    <Paperclip className="h-4 w-4" />
                                                    Attachments:
                                                </b>
                                                {ticket.attachments?.map((attachment, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span>{attachment.name}</span>
                                                        <button
                                                            onClick={async () => {
                                                                const url = `/storage/${attachment.path}`;
                                                                const response = await fetch(url);
                                                                const blob = await response.blob();
                                                                const link = document.createElement('a');
                                                                link.href = URL.createObjectURL(blob);
                                                                link.download = attachment.name;
                                                                link.click();
                                                                URL.revokeObjectURL(link.href);
                                                            }}
                                                            className="text-foreground hover:text-foreground"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Conversations */}
                        {ticket.conversions &&
                            ticket.conversions?.map((conversion) => (
                                <div key={conversion.id} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60 font-semibold text-background md:h-10 md:w-10">
                                            {conversion.sender === 'admin' ? 'A' : 'U'}
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="mb-2 flex flex-col justify-between md:flex-row md:items-center">
                                            <div>
                                                <span className="font-medium text-foreground">
                                                    {conversion.sender === 'admin'
                                                        ? conversion.replyBy?.name || 'Admin'
                                                        : ticket.name}
                                                </span>
                                                <span className="ms-2 text-sm text-muted-foreground">
                                                    ({formatDate(conversion.created_at)})
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                                                conversion.sender === 'admin'
                                                    ? 'border-s-4 border-foreground bg-muted/50'
                                                    : 'border-s-4 border-foreground bg-muted/50'
                                            }`}
                                        >
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: conversion.description || 'No description',
                                                }}
                                            />

                                            {/* Conversion Attachments */}
                                            {conversion.attachments &&
                                                Array.isArray(conversion.attachments) &&
                                                conversion.attachments.length > 0 && (
                                                    <div className="mt-4 rounded-lg border border-border bg-card/50 p-3">
                                                        <b className="mb-2 flex items-center gap-2">
                                                            <Paperclip className="h-4 w-4" />
                                                            Attachments:
                                                        </b>
                                                        {conversion.attachments?.map((attachment, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between"
                                                            >
                                                                <span>{attachment.name}</span>
                                                                <button
                                                                    onClick={async () => {
                                                                        const url = `/storage/${attachment.path}`;
                                                                        const response = await fetch(url);
                                                                        const blob = await response.blob();
                                                                        const link = document.createElement('a');
                                                                        link.href = URL.createObjectURL(blob);
                                                                        link.download = attachment.name;
                                                                        link.click();
                                                                        URL.revokeObjectURL(link.href);
                                                                    }}
                                                                    className="text-foreground hover:text-foreground"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Reply Form */}
                    {ticket.status !== 'Closed' ? (
                        <Card className="overflow-hidden shadow-md">
                            <CardContent className="p-4">
                                <form onSubmit={handleSubmit}>
                                    <RichTextEditor
                                        content={data.reply_description}
                                        onChange={(value) => setData('reply_description', value)}
                                        placeholder="Write your reply here..."
                                        className="mb-4"
                                    />

                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-foreground">
                                            {t('Attachments')}
                                        </label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                                setSelectedFiles(e.target.files);
                                                if (e.target.files) {
                                                    const previews: string[] = [];
                                                    for (let i = 0; i < e.target.files.length; i++) {
                                                        const file = e.target.files[i];
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            previews.push(event.target?.result as string);
                                                            if (previews.length === e.target.files!.length) {
                                                                setImagePreviews(previews);
                                                            }
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                } else {
                                                    setImagePreviews([]);
                                                }
                                            }}
                                            className="block w-full text-sm text-muted-foreground file:me-4 file:rounded-full file:border-0 file:bg-muted/50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-muted"
                                        />
                                        {imagePreviews.length > 0 && (
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {imagePreviews?.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-20 w-full rounded border object-cover"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processing || !data.reply_description.trim()}
                                            className="bg-foreground hover:bg-foreground"
                                        >
                                            <Send className="me-2 h-4 w-4" />
                                            {processing ? t('Sending...') : t('Send Reply')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-4 text-center text-muted-foreground">
                                {t('Ticket is closed and cannot receive replies.')}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Ticket Sidebar */}
                <div className="space-y-6">
                    <Card className="overflow-hidden shadow-md">
                        <div className="bg-foreground px-4 py-3 text-background">
                            <h3 className="flex items-center font-medium">
                                <Ticket className="me-2 h-4 w-4" />
                                {t('Ticket Information')}
                            </h3>
                        </div>
                        <CardContent className="space-y-4 p-4">
                            {[
                                { label: t('Status'), value: ticket.status },
                                { label: t('Ticket ID'), value: `#${ticket.ticket_id}` },
                                { label: t('Created'), value: formatDateTime(ticket.created_at) },
                                { label: t('Customer'), value: ticket.name },
                                { label: t('Email'), value: ticket.email },
                            ]?.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.label}:</span>
                                    <span className="font-medium text-foreground">{item.value}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SupportTicketLayout>
    );
}
