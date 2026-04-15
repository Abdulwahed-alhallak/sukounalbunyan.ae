import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchInput } from '@/components/ui/search-input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateTime, getImagePath } from '@/utils/helpers';

interface CommentsTabProps {
    [key: string]: any;
    contract: any;
    setDeleteConfig: (config: any) => void;
}

export default function CommentsTab({ contract, setDeleteConfig }: CommentsTabProps) {
    const { t } = useTranslation();
    const pageProps = usePage<any>().props;
    const { auth } = pageProps;
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');
    const [createCommentText, setCreateCommentText] = useState('');
    const [commentPage, setCommentPage] = useState(1);
    const [commentPerPage, setCommentPerPage] = useState(10);
    const [commentSearch, setCommentSearch] = useState('');
    const [commentSearchInput, setCommentSearchInput] = useState('');

    const handleCommentSubmit = () => {
        if (editCommentId) {
            router.put(
                route('contract-comments.update', editCommentId),
                { comment: commentText },
                {
                    onSuccess: () => {
                        setCommentDialogOpen(false);
                        setCommentText('');
                        setEditCommentId(null);
                        router.reload();
                    },
                }
            );
        } else {
            router.post(
                route('contract-comments.store', contract.id),
                { comment: commentText },
                {
                    onSuccess: () => {
                        setCommentDialogOpen(false);
                        setCommentText('');
                        router.reload();
                    },
                }
            );
        }
    };

    const handleCreateCommentSubmit = () => {
        router.post(
            route('contract-comments.store', contract.id),
            { comment: createCommentText },
            {
                onSuccess: () => {
                    setCreateCommentText('');
                    router.reload();
                },
            }
        );
    };

    const openEditComment = (comment: any) => {
        setEditCommentId(comment.id);
        setCommentText(comment.comment);
        setCommentDialogOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('Comments')}</CardTitle>
                    <div className="flex items-center gap-3">
                        <SearchInput
                            value={commentSearchInput}
                            onChange={(value) => setCommentSearchInput(value)}
                            onSearch={() => {
                                setCommentSearch(commentSearchInput);
                                setCommentPage(1);
                            }}
                            onClear={() => {
                                setCommentSearch('');
                                setCommentSearchInput('');
                                setCommentPage(1);
                            }}
                            placeholder={t('Search comments...')}
                            className="w-64"
                        />
                        <Select
                            value={commentPerPage.toString()}
                            onValueChange={(value) => {
                                setCommentPerPage(Number(value));
                                setCommentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">{t('5 per page')}</SelectItem>
                                <SelectItem value="10">{t('10 per page')}</SelectItem>
                                <SelectItem value="20">{t('20 per page')}</SelectItem>
                                <SelectItem value="50">{t('50 per page')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    {auth.user?.permissions?.includes('create-contract-comments') && (
                        <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={
                                            auth.user?.avatar
                                                ? getImagePath(auth.user.avatar, pageProps)
                                                : auth.user?.profile_photo_url
                                        }
                                        alt={auth.user?.name}
                                    />
                                    <AvatarFallback className="bg-muted text-xs text-foreground">
                                        {auth.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="mb-2 text-sm font-medium text-foreground">{auth.user?.name}</p>
                                    <Textarea
                                        value={createCommentText}
                                        onChange={(e) => setCreateCommentText(e.target.value)}
                                        placeholder={t('Write your comment...')}
                                        rows={3}
                                        className="mb-3 resize-none border-border bg-card focus:border-border"
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleCreateCommentSubmit}
                                            disabled={!createCommentText.trim()}
                                            size="sm"
                                        >
                                            {t('Send')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(() => {
                        const filteredComments = contract.comments
                            ? contract.comments.filter(
                                  (comment: any) =>
                                      comment.comment.toLowerCase().includes(commentSearch.toLowerCase()) ||
                                      comment.user?.name.toLowerCase().includes(commentSearch.toLowerCase())
                              )
                            : [];

                        const paginatedComments = {
                            data: filteredComments.slice(
                                (commentPage - 1) * commentPerPage,
                                commentPage * commentPerPage
                            ),
                            total: filteredComments.length,
                            last_page: Math.ceil(filteredComments.length / commentPerPage),
                        };

                        return paginatedComments.data.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {paginatedComments.data?.map((comment: any) => (
                                        <div
                                            key={comment.id}
                                            className="group max-w-fit rounded-lg border border-border p-4 transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            comment.user?.avatar
                                                                ? getImagePath(comment.user.avatar, pageProps)
                                                                : comment.user?.profile_photo_url
                                                        }
                                                        alt={comment.user?.name}
                                                    />
                                                    <AvatarFallback className="bg-muted text-xs text-foreground">
                                                        {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="text-sm font-medium">
                                                            {comment.user?.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDateTime(comment.created_at)}
                                                        </span>
                                                        {(comment.user_id === auth.user?.id ||
                                                            comment.created_by === auth.user?.id) && (
                                                            <TooltipProvider>
                                                                <div className="flex gap-1">
                                                                    {auth.user?.permissions?.includes(
                                                                        'edit-contract-comments'
                                                                    ) && (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        openEditComment(comment)
                                                                                    }
                                                                                    className="h-6 w-6 p-0 text-foreground hover:text-foreground"
                                                                                >
                                                                                    <Edit className="h-3 w-3" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>{t('Edit')}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                    {auth.user?.permissions?.includes(
                                                                        'delete-contract-comments'
                                                                    ) && (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        setDeleteConfig({
                                                                                            type: 'comment',
                                                                                            id: comment.id,
                                                                                            route: 'contract-comments.destroy',
                                                                                            message: t(
                                                                                                'Are you sure you want to delete this comment?'
                                                                                            ),
                                                                                        })
                                                                                    }
                                                                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>{t('Delete')}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                </div>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 rounded-lg border border-border bg-muted/50 p-3">
                                                        <p className="text-sm text-foreground">{comment.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filteredComments.length > commentPerPage && (
                                    <div className="bg-muted/50/30 mt-4 border-t px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                {t('Showing')}{' '}
                                                <span className="font-medium text-foreground">
                                                    {(commentPage - 1) * commentPerPage + 1}
                                                </span>{' '}
                                                {t('to')}{' '}
                                                <span className="font-medium text-foreground">
                                                    {Math.min(commentPage * commentPerPage, filteredComments.length)}
                                                </span>{' '}
                                                {t('of')}{' '}
                                                <span className="font-medium text-foreground">
                                                    {filteredComments.length}
                                                </span>{' '}
                                                {t('results')}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
                                                    disabled={commentPage === 1}
                                                    className="h-8 px-3"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    {t('Previous')}
                                                </Button>
                                                <div className="flex items-center space-x-1">
                                                    {Array.from(
                                                        { length: Math.min(5, paginatedComments.last_page) },
                                                        (_, i) => {
                                                            let pageNum;
                                                            if (paginatedComments.last_page <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (commentPage <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (commentPage >= paginatedComments.last_page - 2) {
                                                                pageNum = paginatedComments.last_page - 4 + i;
                                                            } else {
                                                                pageNum = commentPage - 2 + i;
                                                            }

                                                            return (
                                                                <Button
                                                                    key={pageNum}
                                                                    variant={
                                                                        commentPage === pageNum ? 'default' : 'outline'
                                                                    }
                                                                    size="sm"
                                                                    onClick={() => setCommentPage(pageNum)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    {pageNum}
                                                                </Button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setCommentPage((p) =>
                                                            Math.min(paginatedComments.last_page, p + 1)
                                                        )
                                                    }
                                                    disabled={commentPage === paginatedComments.last_page}
                                                    className="h-8 px-3"
                                                >
                                                    {t('Next')}
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
                                <p className="text-sm text-muted-foreground">
                                    {commentSearch ? t('No comments found') : t('No comments yet')}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {commentSearch
                                        ? t('Try adjusting your search')
                                        : t('Be the first to add a comment')}
                                </p>
                            </div>
                        );
                    })()}
                </CardContent>
            </Card>

            {editCommentId && (
                <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                {t('Edit Comment')}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage
                                        src={
                                            auth.user?.avatar
                                                ? getImagePath(auth.user.avatar, pageProps)
                                                : auth.user?.profile_photo_url
                                        }
                                        alt={auth.user?.name}
                                    />
                                    <AvatarFallback className="bg-muted text-xs text-foreground">
                                        {auth.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="mb-2 text-sm font-medium text-foreground">{auth.user?.name}</p>
                                    <Textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder={t('Write your comment...')}
                                        rows={3}
                                        className="resize-none border-border focus:border-border focus:ring-border"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setCommentDialogOpen(false);
                                    setCommentText('');
                                    setEditCommentId(null);
                                }}
                            >
                                {t('Cancel')}
                            </Button>
                            <Button onClick={handleCommentSubmit} disabled={!commentText.trim()}>
                                {t('Update')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
