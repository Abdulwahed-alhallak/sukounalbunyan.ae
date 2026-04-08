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

export default function ModuleAttachments({ moduleId, attachments, deleteRoute, onRefresh, onDelete, canDelete = true }: ModuleAttachmentsProps) {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg group hover:border-border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-lg text-foreground group-hover:scale-110 transition-transform">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground truncate max-w-[200px]">{attachment.file_name}</span>
                                    <span className="text-[10px] text-muted-foreground">{t('Uploaded by')}: {attachment.uploader?.name || t('System')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => window.open(getImagePath(attachment.file_path), '_blank')} className="h-8 w-8 p-0 text-foreground hover:text-foreground">
                                    <Download className="h-4 w-4" />
                                </Button>
                                {canDelete && (
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(attachment.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/50/50 border border-dashed border-border rounded-xl">
                    <Paperclip className="h-8 w-8 text-muted-foreground/60 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">{t('No premium mission payloads attached')}</p>
                </div>
            )}
        </div>
    );
}
