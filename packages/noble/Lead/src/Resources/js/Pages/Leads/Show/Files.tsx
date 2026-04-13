import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MediaPicker from '@/components/MediaPicker';
import { getImagePath, downloadFile } from '@/utils/helpers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Image, File, FileText, Video, Music, Download, Eye, Trash2 } from 'lucide-react';
import { Lead } from '../types';

interface FilesProps {
    lead: Lead;
}

export default function Files({ lead }: FilesProps) {
    const { t } = useTranslation();
    const [files, setFiles] = useState<string[]>([]);

    const handleFilesChange = (value: string | string[]) => {
        setFiles(Array.isArray(value) ? value : [value].filter(Boolean));
    };

    const handleSave = () => {
        router.post(
            route('lead.leads.store-file', lead.id),
            {
                additional_images: files,
            },
            {
                onSuccess: () => {
                    setFiles([]);
                },
            }
        );
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
            return <Image className="h-5 w-5 text-foreground" />;
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext || '')) {
            return <Video className="h-5 w-5 text-foreground" />;
        } else if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext || '')) {
            return <Music className="h-5 w-5 text-foreground" />;
        } else if (['txt', 'doc', 'docx', 'pdf', 'rtf'].includes(ext || '')) {
            return <FileText className="h-5 w-5 text-destructive" />;
        } else {
            return <File className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const isImage = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
    };

    return (
        <div className="flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-foreground">{t('Files')}</h4>
            <div className="mb-4">
                <MediaPicker
                    value={files}
                    onChange={handleFilesChange}
                    multiple={true}
                    placeholder={t('Select files')}
                    showPreview={false}
                    label=""
                />
                {files.length > 0 && (
                    <div className="mt-2 flex justify-end">
                        <Button onClick={handleSave}>{t('Save Files')}</Button>
                    </div>
                )}
            </div>
            {lead.files && lead.files.length > 0 ? (
                <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-96 flex-1 space-y-2 overflow-y-auto">
                    {lead.files?.map((file) => {
                        let imageUrl = getImagePath(file.file_path);
                        return (
                            <div
                                key={file.id}
                                className="group flex items-center gap-3 rounded-lg border bg-muted/50 p-3 transition-colors hover:bg-muted"
                            >
                                <div className="flex-shrink-0">
                                    {isImage(file.file_path) ? (
                                        <img
                                            src={imageUrl}
                                            alt={file.file_name || 'File'}
                                            className="h-10 w-10 rounded border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded border bg-card">
                                            {getFileIcon(file.file_path)}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className="truncate text-sm font-medium text-foreground"
                                        title={file.file_name || file.file_path}
                                    >
                                        {file.file_name || file.file_path.split('/').pop()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {file.file_path.split('.').pop()?.toUpperCase()} file
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => window.open(imageUrl, '_blank')}
                                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('View')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => downloadFile(imageUrl)}
                                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('Download')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        router.delete(route('lead.leads.delete-file', file.id))
                                                    }
                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('Delete')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <File className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p className="text-sm">{t('No files uploaded yet')}</p>
                </div>
            )}
        </div>
    );
}
