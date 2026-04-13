import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Users, Play, X } from 'lucide-react';
import { formatDateTime, getImagePath } from '@/utils/helpers';
import { ZoomMeeting } from './types';
import { toast } from 'sonner';

interface ShowModalProps {
    isOpen: boolean;
    onClose: () => void;
    zoommeeting: ZoomMeeting;
    users: Array<{id: number; name: string; avatar?: string}>;
}

export default function Show({ isOpen, onClose, zoommeeting, users }: ShowModalProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t('Meeting URL copied to clipboard'));
    };

    const getParticipantNames = () => {
        if (!zoommeeting.participants) return [];
        let items = [];
        if (typeof zoommeeting.participants === 'string') {
            try {
                items = JSON.parse(zoommeeting.participants);
            } catch {
                items = [zoommeeting.participants];
            }
        } else if (Array.isArray(zoommeeting.participants)) {
            items = zoommeeting.participants;
        }
        return items?.map((item: any) => {
            const user = users.find((u: any) => u.id.toString() === item?.toString());
            return user?.name || item;
        });
    };

    const statusColors = {
        "Scheduled": "bg-muted text-foreground",
        "Started": "bg-muted text-foreground",
        "Ended": "bg-muted text-foreground",
        "Cancelled": "bg-muted text-destructive"
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('Meeting Details')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Title')}</label>
                            <p className="mt-1 text-sm text-foreground">{zoommeeting.title}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Meeting ID')}</label>
                            <p className="mt-1 text-sm text-foreground">{zoommeeting.meeting_id || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Meeting Password')}</label>
                            <p className="mt-1 text-sm text-foreground">{zoommeeting.meeting_password || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Start Time')}</label>
                            <p className="mt-1 text-sm text-foreground">{zoommeeting.start_time ? formatDateTime(zoommeeting.start_time) : '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Duration')}</label>
                            <p className="mt-1 text-sm text-foreground">{zoommeeting.duration ? `${zoommeeting.duration} minutes` : '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Status')}</label>
                            <div className="mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${(statusColors as any)[zoommeeting.status] || 'bg-muted text-foreground'}`}>
                                    {zoommeeting.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Host')}</label>
                            {zoommeeting.host?.name ? (
                                <div className="mt-1 flex items-center gap-2">
                                    <img
                                        src={getImagePath(zoommeeting.host?.avatar || '')}
                                        alt={zoommeeting.host.name}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                    />
                                    <span className="text-sm text-foreground">{zoommeeting.host.name}</span>
                                </div>
                            ) : (
                                <p className="mt-1 text-sm text-foreground">-</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Description')}</label>
                        <p className="mt-1 text-sm text-foreground">{zoommeeting.description || '-'}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">{t('Participants')}</label>
                        <div className="mt-1">
                            {(() => {
                                if (!zoommeeting.participants) return <span className="text-sm text-muted-foreground">-</span>;
                                let items = [];
                                if (typeof zoommeeting.participants === 'string') {
                                    try {
                                        items = JSON.parse(zoommeeting.participants);
                                    } catch {
                                        items = [zoommeeting.participants];
                                    }
                                } else if (Array.isArray(zoommeeting.participants)) {
                                    items = zoommeeting.participants;
                                }
                                if (items.length === 0) return <span className="text-sm text-muted-foreground">-</span>;
                                return (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <TooltipProvider>
                                            {items?.map((item: any, index: number) => {
                                                const modelItem = users.find((u: any) => u.id.toString() === item?.toString());
                                                const userName = modelItem?.name || item;
                                                return (
                                                    <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                                                          <img
                                                                src={getImagePath(modelItem?.avatar || '')}
                                                                alt={userName}
                                                                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                                            />
                                                        <span className="text-sm font-medium text-foreground">{userName}</span>
                                                    </div>
                                                );
                                            })}
                                        </TooltipProvider>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Host Video')}</label>
                            <div className="mt-1">
                                <Badge variant={zoommeeting.host_video ? "default" : "secondary"}>
                                    {zoommeeting.host_video ? t('Enabled') : t('Disabled')}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Participant Video')}</label>
                            <div className="mt-1">
                                <Badge variant={zoommeeting.participant_video ? "default" : "secondary"}>
                                    {zoommeeting.participant_video ? t('Enabled') : t('Disabled')}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Waiting Room')}</label>
                            <div className="mt-1">
                                <Badge variant={zoommeeting.waiting_room ? "default" : "secondary"}>
                                    {zoommeeting.waiting_room ? t('Enabled') : t('Disabled')}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Recording')}</label>
                            <div className="mt-1">
                                <Badge variant={zoommeeting.recording ? "default" : "secondary"}>
                                    {zoommeeting.recording ? t('Enabled') : t('Disabled')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {zoommeeting.meeting_id && ['Scheduled', 'Started'].includes(zoommeeting.status) && (
                        <div className="border-t pt-6">
                            <h4 className="text-sm font-medium text-foreground mb-4">{t('Meeting Links')}</h4>
                            <div className="space-y-3">
                                {auth.user?.permissions?.includes('join-zoom-meetings') && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground w-20">{t('Join URL')}:</span>
                                        <code className="flex-1 text-xs bg-muted p-2 rounded break-all">
                                            {zoommeeting.join_url || `https://zoom.us/j/${zoommeeting.meeting_id}`}
                                        </code>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(zoommeeting.join_url || `https://zoom.us/j/${zoommeeting.meeting_id}`, 'join')}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('Copy Join URL')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                                {auth.user?.permissions?.includes('start-zoom-meetings') && (zoommeeting.host_id === auth.user?.id || auth.user?.type === 'company') && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground w-20">{t('Start URL')}:</span>
                                        <code className="flex-1 text-xs bg-muted p-2 rounded break-all">
                                            {zoommeeting.start_url || `https://zoom.us/s/${zoommeeting.meeting_id}`}
                                        </code>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(zoommeeting.start_url || `https://zoom.us/s/${zoommeeting.meeting_id}`, 'start')}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('Copy Start URL')}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <TooltipProvider>
                            {zoommeeting.meeting_id && ['Scheduled', 'Started'].includes(zoommeeting.status) && auth.user?.permissions?.includes('join-zoom-meetings') && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => window.open(zoommeeting.join_url || `https://zoom.us/j/${zoommeeting.meeting_id}`, '_blank')}
                                            className="text-foreground hover:text-foreground"
                                        >
                                            <Users className="h-4 w-4 mr-2" />
                                            {t('Join Meeting')}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Join Meeting')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {zoommeeting.meeting_id && ['Scheduled', 'Started'].includes(zoommeeting.status) && auth.user?.permissions?.includes('start-zoom-meetings') && (zoommeeting.host_id === auth.user?.id || auth.user?.type === 'company') && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => window.open(zoommeeting.start_url || `https://zoom.us/s/${zoommeeting.meeting_id}`, '_blank')}
                                            className="text-background bg-foreground hover:bg-foreground/80"
                                        >
                                            <Play className="h-4 w-4 mr-2" />
                                            {t('Start Meeting')}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('Start Meeting')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </TooltipProvider>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}