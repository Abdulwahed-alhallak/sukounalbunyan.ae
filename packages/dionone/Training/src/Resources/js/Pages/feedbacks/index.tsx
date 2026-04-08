import { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputError from '@/components/ui/input-error';
import { Star, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from '@/utils/helpers';

export default function Index() {
    const { t } = useTranslation();
    const { task, feedbacks, auth } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);


    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        comments: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('training.tasks.feedbacks.store', task.id), {
            onSuccess: () => {
                reset();
                setModalOpen(false);
            },
        });
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5]?.map((star) => (
                    <span
                        key={star}
                        className={`text-xl ${star <= rating ? 'text-muted-foreground' : 'text-muted-foreground/60'} ${
                            interactive ? 'cursor-pointer hover:text-muted-foreground' : ''
                        }`}
                        onClick={interactive ? () => onRatingChange(star) : undefined}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {label: t('Training')}, 
                {label: t('Training List'), url: route('training.trainings.index')},
                {label: task.training.title, url: route('training.trainings.tasks.index', task.training.id)},
                {label: task.title, url: route('training.trainings.tasks.index', task.training.id)},
                {label: t('Feedbacks')}
            ]}
            pageTitle={`${task.title} - ${t('Feedbacks')}`}
            pageActions={
                <div className="flex gap-2">
                    <TooltipProvider>
                        {auth.user?.permissions?.includes('create-training-feedbacks') && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button size="sm" onClick={() => setModalOpen(true)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Add Feedback')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            }
        >
            <Head title={t('Task Feedbacks')} />



            <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                            <Star className="h-5 w-5 text-muted-foreground" />
                            {t('Feedbacks')} 
                            <span className="bg-foreground/10 text-foreground text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {feedbacks.length}
                            </span>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {t('Task')}: <span className="font-medium">{task.title}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {feedbacks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Star className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">{t('No feedbacks yet')}</h3>
                            <p className="text-muted-foreground">{t('Be the first to share your feedback on this task.')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {feedbacks?.map((feedback, index) => (
                                <div key={feedback.id} className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-background font-semibold text-sm">
                                            {feedback.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-foreground truncate">{feedback.user?.name || 'Unknown User'}</h4>
                                            <p className="text-xs text-muted-foreground">{formatDate(feedback.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5]?.map((star) => (
                                                <span key={star} className={`text-sm ${star <= feedback.rating ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">{feedback.rating}/5</span>
                                    </div>
                                    {feedback.comments && (
                                        <div className="bg-muted/50 rounded p-3 border-l-2 border-foreground">
                                            <p className="text-sm text-foreground line-clamp-3">{feedback.comments}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Add Feedback')}</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>{t('Rating')}</Label>
                            {renderStars(data.rating, true, (rating) => setData('rating', rating))}
                            <InputError message={errors.rating} />
                        </div>

                        <div>
                            <Label htmlFor="comments">{t('Comments')}</Label>
                            <Textarea
                                id="comments"
                                value={data.comments}
                                onChange={(e) => setData('comments', e.target.value)}
                                placeholder={t('Enter your feedback comments')}
                                rows={3}
                            />
                            <InputError message={errors.comments} />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? t('Submitting...') : t('Submit Feedback')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}