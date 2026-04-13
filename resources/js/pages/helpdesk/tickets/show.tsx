import { useState, useEffect, useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import ChatMessage from '../components/ChatMessage';
import ReplyForm from '../components/ReplyForm';
import { formatDate } from '@/utils/helpers';
import { ShowHelpdeskTicketProps, HelpdeskReply } from './types';

export default function Show() {
    const { ticket, auth } = usePage<ShowHelpdeskTicketProps>().props;
    const { t } = useTranslation();
    const [replies, setReplies] = useState<HelpdeskReply[]>(ticket.replies || []);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, replyId: null as number | null });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [replies]);

    const handleReplyAdded = (newReply: HelpdeskReply) => {
        setReplies((prev) => [...prev, newReply]);
    };

    const handleDeleteReply = (replyId: number) => {
        setDeleteDialog({ isOpen: true, replyId });
    };

    const confirmDeleteReply = async () => {
        if (!deleteDialog.replyId) return;

        try {
            const response = await fetch(route('helpdesk-replies.destroy', deleteDialog.replyId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                setReplies((prev) => prev.filter((reply) => reply.id !== deleteDialog.replyId));
                setDeleteDialog({ isOpen: false, replyId: null });
                // Show success message
                router.reload({
                    only: [],
                    onSuccess: () => {
                        // Flash message from controller will be displayed
                    },
                });
            }
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            open: 'bg-muted text-foreground',
            in_progress: 'bg-muted text-foreground',
            resolved: 'bg-muted text-foreground',
            closed: 'bg-muted text-foreground',
        };
        return (
            <span className={`rounded-full px-2 py-1 text-sm ${colors[status as keyof typeof colors]}`}>
                {t(status.replace('_', ' '))}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            low: 'bg-muted text-foreground',
            medium: 'bg-muted text-foreground',
            high: 'bg-muted text-foreground',
            urgent: 'bg-muted text-destructive',
        };
        return (
            <span className={`rounded-full px-2 py-1 text-sm ${colors[priority as keyof typeof colors]}`}>
                {t(priority)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Support Tickets', url: route('helpdesk-tickets.index') },
                { label: `#${ticket.ticket_id} - ${ticket.title}` },
            ]}
            pageTitle={`Ticket #${ticket.ticket_id}`}
        >
            <Head title={`Ticket #${ticket.ticket_id} - ${ticket.title}`} />

            {/* Ticket Header */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                            <div className="mb-4 flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-foreground">
                                    #{ticket.ticket_id} - {ticket.title}
                                </h1>
                                <div className="flex gap-2">
                                    {getStatusBadge(ticket.status)}
                                    {getPriorityBadge(ticket.priority)}
                                </div>
                            </div>
                            <div
                                className="prose prose-sm max-w-none text-foreground"
                                dangerouslySetInnerHTML={{ __html: ticket.description }}
                            />
                        </div>

                        <div className="space-y-4 lg:w-80">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {t('Category')}
                                    </label>
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {ticket.category?.name || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {t('Created By')}
                                    </label>
                                    <p className="mt-1 text-sm font-medium text-foreground">{ticket.creator?.name}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {t('Created At')}
                                </label>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {formatDate(ticket.created_at)}
                                </p>
                            </div>
                            {ticket.assignedTo && (
                                <div>
                                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                        {t('Assigned To')}
                                    </label>
                                    <p className="mt-1 text-sm font-medium text-foreground">{ticket.assignedTo.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Full Page Conversation */}
            <Card className="flex flex-col" style={{ height: 'calc(100vh - 50px)' }}>
                <CardHeader className="bg-muted/50/50 border-b py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">{t('Conversation')}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {replies.length} {replies.length === 1 ? t('message') : t('messages')}
                        </div>
                    </div>
                </CardHeader>

                {/* Messages Area - Full Height */}
                <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="flex h-full flex-col">
                        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 space-y-6 overflow-y-auto p-6">
                            {replies.length === 0 ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                            <svg
                                                className="h-8 w-8 text-muted-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="mb-2 text-lg font-medium text-foreground">
                                            {t('No messages yet')}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {t('Start the conversation by sending a message below.')}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {replies
                                        .filter((reply) => !reply.is_internal || auth.user?.type === 'superadmin')
                                        .map((reply) => (
                                            <ChatMessage
                                                key={reply.id}
                                                reply={reply}
                                                isOwnMessage={reply.created_by === auth.user?.id}
                                                onDelete={handleDeleteReply}
                                                canDelete={auth.user?.permissions?.includes('delete-helpdesk-replies')}
                                            />
                                        ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Reply Form - Fixed at Bottom */}
                        {auth.user?.permissions?.includes('create-helpdesk-replies') && (
                            <div className="border-t bg-card">
                                <ReplyForm
                                    ticketId={ticket.id}
                                    onReplyAdded={handleReplyAdded}
                                    disabled={ticket.status === 'closed'}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <ConfirmationDialog
                open={deleteDialog.isOpen}
                onOpenChange={(open) => setDeleteDialog({ isOpen: open, replyId: null })}
                title={t('Delete Reply')}
                message={t('Are you sure you want to delete this reply?')}
                confirmText={t('Delete')}
                onConfirm={confirmDeleteReply}
                variant="destructive"
            />
        </AuthenticatedLayout>
    );
}
