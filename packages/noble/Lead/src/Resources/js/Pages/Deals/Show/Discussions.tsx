import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import NoRecordsFound from '@/components/no-records-found';
import { formatDateTime } from '@/utils/helpers';
import { Deal } from '../types';

interface DiscussionsProps {
    [key: string]: any;
    deal: Deal;
    onRegisterAddHandler: (handler: () => void) => void;
}

export default function Discussions({ deal, onRegisterAddHandler }: DiscussionsProps) {
    useEffect(() => {
        onRegisterAddHandler(() => setDiscussionModalOpen(true));
    }, [onRegisterAddHandler]);
    const { t } = useTranslation();
    const [discussionModalOpen, setDiscussionModalOpen] = useState(false);
    const [discussionForm, setDiscussionForm] = useState({ message: '' });

    const handleDiscussionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('lead.deals.store-discussion', deal.id), discussionForm, {
            onSuccess: () => {
                setDiscussionForm({ message: '' });
                setDiscussionModalOpen(false);
            },
        });
    };

    return (
        <>
            <div className="max-h-[75vh] space-y-3 overflow-y-auto">
                {deal.discussions && deal.discussions.length > 0 ? (
                    deal.discussions?.map((discussion: any, index: number) => {
                        return (
                            <div
                                key={index}
                                className="rounded-e-lg border-s-4 border-foreground bg-gradient-to-r from-muted/50 to-muted/50 p-5 shadow-sm"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-muted p-2">
                                            <MessageSquare className="h-4 w-4 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {discussion.creator?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDateTime(discussion.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-border bg-card p-4">
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                        {discussion.comment}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <NoRecordsFound
                        icon={MessageSquare}
                        title={t('No Discussions found')}
                        description={t('Get started by adding your first discussion.')}
                        onCreateClick={() => setDiscussionModalOpen(true)}
                        createButtonText={t('Add Message')}
                        className="h-auto"
                    />
                )}
            </div>

            <Dialog open={discussionModalOpen} onOpenChange={setDiscussionModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Add Message')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDiscussionSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="message">{t('Message')}</Label>
                            <Textarea
                                id="message"
                                value={discussionForm.message}
                                onChange={(e) => setDiscussionForm({ ...discussionForm, message: e.target.value })}
                                placeholder={t('Enter your message')}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setDiscussionModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit">{t('Save')}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
