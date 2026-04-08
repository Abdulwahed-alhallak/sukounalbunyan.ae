import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Trash2, Paperclip, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatMessageProps } from './types';
import { formatDateTime, getImagePath } from '@/utils/helpers';
import { isImageFile } from '@/utils/fileHelpers';
import { usePage } from '@inertiajs/react';

export default function ChatMessage({ reply, isOwnMessage, onDelete, canDelete }: ChatMessageProps) {
    const pageProps = usePage().props as any;
    const { imageUrlPrefix } = pageProps;
    const { t } = useTranslation();
    const [showActions, setShowActions] = useState(false);



    return (
        <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                <div
                    className={`rounded-lg p-3 ${
                        reply.is_internal
                            ? 'bg-muted border-l-4 border-border text-foreground'
                            : isOwnMessage
                                ? 'bg-foreground text-background'
                                : 'bg-muted text-foreground'
                    }`}
                    onMouseEnter={() => setShowActions(true)}
                    onMouseLeave={() => setShowActions(false)}
                >
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                                reply.is_internal
                                    ? 'text-foreground'
                                    : isOwnMessage ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                                {reply.creator?.name}
                            </span>
                            {reply.is_internal && (
                                <span className="text-xs bg-muted text-foreground px-2 py-0.5 rounded-full font-medium">
                                    {t('Internal Note')}
                                </span>
                            )}
                        </div>
                        {showActions && canDelete && onDelete && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(reply.id)}
                                            className={`h-6 w-6 p-0 ${
                                                reply.is_internal
                                                    ? 'text-foreground hover:text-destructive hover:bg-muted'
                                                    : isOwnMessage
                                                        ? 'text-foreground hover:text-background hover:bg-accent'
                                                        : 'text-muted-foreground hover:text-destructive hover:bg-muted'
                                            }`}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Delete')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    <div
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: reply.message }}
                    />

                    {(() => {
                        let attachments = [];
                        if (typeof reply.attachments === 'string') {
                            try {
                                attachments = JSON.parse(reply.attachments);
                            } catch {
                                attachments = [reply.attachments];
                            }
                        } else if (Array.isArray(reply.attachments)) {
                            attachments = reply.attachments;
                        }
                        return attachments.length > 0 ? (
                            <div className="mt-2 space-y-1">
                                {attachments.map((attachment: string, index: number) => {
                                    const isImage = isImageFile(attachment);
                                    return (
                                        <div key={index} className={`flex items-center gap-2 p-2 rounded ${
                                            isOwnMessage ? 'bg-foreground/20' : 'bg-muted'
                                        }`}>
                                            {isImage ? (
                                                <img
                                                    src={getImagePath(attachment)}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded"

                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 flex-1">
                                                    <Paperclip className="h-4 w-4" />
                                                    <span className="text-sm">{attachment}</span>
                                                </div>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = isImage ? getImagePath(attachment) : `${imageUrlPrefix}/${attachment}`;
                                                    link.download = attachment.split('/').pop() || 'file';
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null;
                    })()}
                </div>

                <div className={`text-xs text-muted-foreground mt-1 ${
                    isOwnMessage ? 'text-right' : 'text-left'
                }`}>
                    {formatDateTime(reply.created_at)}
                </div>
            </div>
        </div>
    );
}