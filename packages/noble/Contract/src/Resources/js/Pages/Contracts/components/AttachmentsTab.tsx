import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaPicker from '@/components/MediaPicker';
import {
    Upload,
    Download,
    Trash2,
    Eye,
    Paperclip,
    Grid,
    List,
    File,
    Image,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getImagePath, downloadFile, formatDate } from '@/utils/helpers';

interface AttachmentsTabProps {
    contract: any;
    setDeleteConfig: (config: any) => void;
}

export default function AttachmentsTab({ contract, setDeleteConfig }: AttachmentsTabProps) {
    const { t } = useTranslation();
    const pageProps = usePage<any>().props;
    const { auth } = pageProps;
    const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
    const [attachmentView, setAttachmentView] = useState<'list' | 'grid'>('list');
    const [attachmentPage, setAttachmentPage] = useState(1);
    const [attachmentsPerPage, setAttachmentsPerPage] = useState(18);

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const pdfTypes = ['pdf'];

        if (imageTypes.includes(extension || '')) return <Image className="h-4 w-4" />;
        if (pdfTypes.includes(extension || '')) return <File className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    const isImageFile = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '');
    };

    const paginatedAttachments = contract.attachments
        ? {
              data: contract.attachments.slice(
                  (attachmentPage - 1) * attachmentsPerPage,
                  attachmentPage * attachmentsPerPage
              ),
              total: contract.attachments.length,
              last_page: Math.ceil(contract.attachments.length / attachmentsPerPage),
          }
        : { data: [], total: 0, last_page: 1 };

    const handleAttachmentUpload = () => {
        if (selectedMedia.length > 0) {
            router.post(
                route('contract-attachments.store', contract.id),
                {
                    media_paths: selectedMedia,
                },
                {
                    onSuccess: () => {
                        setAttachmentDialogOpen(false);
                        setSelectedMedia([]);
                        router.reload();
                    },
                }
            );
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('Attachments')}</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-md border">
                            <Button
                                size="sm"
                                variant={attachmentView === 'list' ? 'default' : 'ghost'}
                                onClick={() => setAttachmentView('list')}
                                className="h-9 rounded-r-none px-2"
                            >
                                <List className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant={attachmentView === 'grid' ? 'default' : 'ghost'}
                                onClick={() => setAttachmentView('grid')}
                                className="h-9 rounded-l-none px-2"
                            >
                                <Grid className="h-3 w-3" />
                            </Button>
                        </div>
                        <Select
                            value={attachmentsPerPage.toString()}
                            onValueChange={(value) => {
                                setAttachmentsPerPage(Number(value));
                                setAttachmentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-9 w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="18">{t('18 per page')}</SelectItem>
                                <SelectItem value="36">{t('36 per page')}</SelectItem>
                                <SelectItem value="54">{t('54 per page')}</SelectItem>
                                <SelectItem value="100">{t('100 per page')}</SelectItem>
                            </SelectContent>
                        </Select>
                        {auth.user?.permissions?.includes('create-contract-attachments') && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" onClick={() => setAttachmentDialogOpen(true)} className="h-9">
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Upload')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {paginatedAttachments.data.length > 0 ? (
                        <>
                            {attachmentView === 'list' ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">{t('Preview')}</TableHead>
                                            <TableHead>{t('File Name')}</TableHead>
                                            <TableHead>{t('Uploaded By')}</TableHead>
                                            <TableHead>{t('Date')}</TableHead>
                                            <TableHead className="w-20">{t('Actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedAttachments.data?.map((attachment: any) => (
                                            <TableRow key={attachment.id}>
                                                <TableCell>
                                                    {auth.user?.permissions?.includes('view-contracts') ? (
                                                        isImageFile(attachment.file_name) ? (
                                                            <img
                                                                src={getImagePath(attachment.file_path, pageProps)}
                                                                alt={attachment.file_name}
                                                                className="h-10 w-10 rounded border object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted">
                                                                {getFileIcon(attachment.file_name)}
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted">
                                                            {getFileIcon(attachment.file_name)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{attachment.file_name}</TableCell>
                                                <TableCell>{attachment.uploader?.name || '-'}</TableCell>
                                                <TableCell>{formatDate(attachment.created_at)}</TableCell>
                                                <TableCell>
                                                    <TooltipProvider>
                                                        <div className="flex gap-1">
                                                            {auth.user?.permissions?.includes('view-contracts') && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    getImagePath(
                                                                                        attachment.file_path,
                                                                                        pageProps
                                                                                    ),
                                                                                    '_blank'
                                                                                )
                                                                            }
                                                                            className="text-foreground hover:text-foreground"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('View')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {auth.user?.permissions?.includes('view-contracts') && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() =>
                                                                                downloadFile(
                                                                                    getImagePath(
                                                                                        attachment.file_path,
                                                                                        pageProps
                                                                                    )
                                                                                )
                                                                            }
                                                                            className="text-foreground hover:text-foreground"
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Download')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {auth.user?.permissions?.includes(
                                                                'delete-contract-attachments'
                                                            ) &&
                                                                (attachment.uploaded_by === auth.user?.id ||
                                                                    attachment.created_by === auth.user?.id) && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() =>
                                                                                    setDeleteConfig({
                                                                                        type: 'attachment',
                                                                                        id: attachment.id,
                                                                                        route: 'contract-attachments.destroy',
                                                                                        message: t(
                                                                                            'Are you sure you want to delete this attachment?'
                                                                                        ),
                                                                                    })
                                                                                }
                                                                                className="text-destructive hover:text-destructive"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('Delete')}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                        </div>
                                                    </TooltipProvider>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="grid grid-cols-6 gap-4 p-4">
                                    {paginatedAttachments.data?.map((attachment: any) => (
                                        <div
                                            key={attachment.id}
                                            className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-lg"
                                        >
                                            <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted/50">
                                                {auth.user?.permissions?.includes('view-contracts') ? (
                                                    isImageFile(attachment.file_name) ? (
                                                        <img
                                                            src={getImagePath(attachment.file_path, pageProps)}
                                                            alt={attachment.file_name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-muted-foreground">
                                                            {getFileIcon(attachment.file_name)}
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="text-muted-foreground">
                                                        {getFileIcon(attachment.file_name)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="border-t bg-card p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={
                                                                    attachment.uploader?.avatar
                                                                        ? getImagePath(
                                                                              attachment.uploader.avatar,
                                                                              pageProps
                                                                          )
                                                                        : attachment.uploader?.profile_photo_url
                                                                }
                                                                alt={attachment.uploader?.name}
                                                            />
                                                            <AvatarFallback className="bg-muted text-xs text-foreground">
                                                                {attachment.uploader?.name?.charAt(0)?.toUpperCase() ||
                                                                    'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-xs font-medium text-foreground">
                                                            {attachment.uploader?.name || t('Unknown')}
                                                        </span>
                                                    </div>
                                                    <TooltipProvider>
                                                        <div className="flex gap-1">
                                                            {auth.user?.permissions?.includes('view-contracts') && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    getImagePath(
                                                                                        attachment.file_path,
                                                                                        pageProps
                                                                                    ),
                                                                                    '_blank'
                                                                                )
                                                                            }
                                                                            className="h-6 w-6 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <Eye className="h-3 w-3" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('View')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {auth.user?.permissions?.includes('view-contracts') && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() =>
                                                                                downloadFile(
                                                                                    getImagePath(
                                                                                        attachment.file_path,
                                                                                        pageProps
                                                                                    )
                                                                                )
                                                                            }
                                                                            className="h-6 w-6 p-0 text-foreground hover:text-foreground"
                                                                        >
                                                                            <Download className="h-3 w-3" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{t('Download')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {auth.user?.permissions?.includes(
                                                                'delete-contract-attachments'
                                                            ) &&
                                                                (attachment.uploaded_by === auth.user?.id ||
                                                                    attachment.created_by === auth.user?.id) && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() =>
                                                                                    setDeleteConfig({
                                                                                        type: 'attachment',
                                                                                        id: attachment.id,
                                                                                        route: 'contract-attachments.destroy',
                                                                                        message: t(
                                                                                            'Are you sure you want to delete this attachment?'
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
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {contract.attachments && contract.attachments.length > attachmentsPerPage && (
                                <div className="bg-muted/50/30 border-t px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {t('Showing')}{' '}
                                            <span className="font-medium text-foreground">
                                                {(attachmentPage - 1) * attachmentsPerPage + 1}
                                            </span>{' '}
                                            {t('to')}{' '}
                                            <span className="font-medium text-foreground">
                                                {Math.min(
                                                    attachmentPage * attachmentsPerPage,
                                                    contract.attachments.length
                                                )}
                                            </span>{' '}
                                            {t('of')}{' '}
                                            <span className="font-medium text-foreground">
                                                {contract.attachments.length}
                                            </span>{' '}
                                            {t('results')}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setAttachmentPage((p) => Math.max(1, p - 1))}
                                                disabled={attachmentPage === 1}
                                                className="h-8 px-3"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                {t('Previous')}
                                            </Button>
                                            <div className="flex items-center space-x-1">
                                                {Array.from(
                                                    { length: Math.min(5, paginatedAttachments.last_page) },
                                                    (_, i) => {
                                                        let pageNum;
                                                        if (paginatedAttachments.last_page <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (attachmentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (
                                                            attachmentPage >=
                                                            paginatedAttachments.last_page - 2
                                                        ) {
                                                            pageNum = paginatedAttachments.last_page - 4 + i;
                                                        } else {
                                                            pageNum = attachmentPage - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={
                                                                    attachmentPage === pageNum ? 'default' : 'outline'
                                                                }
                                                                size="sm"
                                                                onClick={() => setAttachmentPage(pageNum)}
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
                                                    setAttachmentPage((p) =>
                                                        Math.min(paginatedAttachments.last_page, p + 1)
                                                    )
                                                }
                                                disabled={attachmentPage === paginatedAttachments.last_page}
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
                            <Paperclip className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
                            <p className="text-sm text-muted-foreground">{t('No attachments found')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={attachmentDialogOpen} onOpenChange={setAttachmentDialogOpen}>
                <DialogContent>
                    <DialogHeader className="mb-4">
                        <DialogTitle>{t('Add Attachments')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <MediaPicker
                            multiple
                            value={selectedMedia}
                            onChange={(media) => setSelectedMedia(media as string[])}
                            showPreview={true}
                            placeholder={t('Select files to attach...')}
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setAttachmentDialogOpen(false)}>
                            {t('Cancel')}
                        </Button>
                        <Button onClick={handleAttachmentUpload} disabled={selectedMedia.length === 0}>
                            {t('Upload')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
