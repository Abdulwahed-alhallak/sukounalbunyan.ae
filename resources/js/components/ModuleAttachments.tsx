import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { FileText, Download, Trash2, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import { getImagePath } from '../utils/helpers';
import axios from 'axios';
import { toast } from 'sonner';

interface ModuleAttachmentsProps {
    moduleId?: number;
    attachments: any[];
    deleteRoute?: string;
    onRefresh?: () => void;
    onDelete?: (id: number) => void;
    canDelete?: boolean;
}

export default function ModuleAttachments({
    moduleId,
    attachments,
    deleteRoute,
    onRefresh,
    onDelete,
    canDelete = true,
}: ModuleAttachmentsProps) {
    const { t } = useTranslation();
    const { auth } = usePage<any>().props;

    const handleDelete = async (attachmentId: number) => {
        if (onDelete) {
            onDelete(attachmentId);
            return;
        }

        if (!deleteRoute) return;

        try {
            await axios.delete(route(deleteRoute, attachmentId));
            toast.success(t('Attachment deleted successfully'));
            if (onRefresh) onRefresh();
        } catch (error) {
            toast.error(t('Failed to delete attachment'));
        }
    };

    return (
        <div className="space-y-4">
            {attachments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {attachments.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="group flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-all hover:border-border"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-muted p-2 text-foreground transition-transform group-hover:scale-110">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="max-w-[200px] truncate text-sm font-bold text-foreground">
                                        {attachment.file_name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {t('Uploaded by')}: {attachment.uploader?.name || t('System')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(getImagePath(attachment.file_path), '_blank')}
                                    className="h-8 w-8 p-0 text-foreground hover:text-foreground"
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                                {canDelete && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(attachment.id)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-muted/50/50 rounded-xl border border-dashed border-border py-12 text-center">
                    <Paperclip className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-muted-foreground">
                        {t('No premium mission payloads attached')}
                    </p>
                </div>
            )}
        </div>
    );
}
