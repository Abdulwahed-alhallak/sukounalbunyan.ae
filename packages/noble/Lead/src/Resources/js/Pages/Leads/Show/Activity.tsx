import { useTranslation } from 'react-i18next';
import { CheckSquare, Mail, Phone, Users, MessageSquare, Activity as ActivityIcon } from 'lucide-react';
import NoRecordsFound from '@/components/no-records-found';
import { formatDateTime } from '@/utils/helpers';
import { Lead } from '../types';

interface ActivityProps {
    [key: string]: any;
    lead: Lead;
}

export default function Activity({ lead }: ActivityProps) {
    const { t } = useTranslation();

    return (
        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[75vh] w-full overflow-y-auto rounded-none">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lead.activities && lead.activities.length > 0 ? (
                    lead.activities?.map((activity: any, index: number) => (
                        <div key={index} className="rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10">
                                        {(() => {
                                            const remark = activity.remark || '';
                                            if (remark.includes('task') || remark.includes('Task'))
                                                return <CheckSquare className="h-4 w-4 text-foreground" />;
                                            if (remark.includes('email') || remark.includes('Email'))
                                                return <Mail className="h-4 w-4 text-foreground" />;
                                            if (remark.includes('call') || remark.includes('Call'))
                                                return <Phone className="h-4 w-4 text-foreground" />;
                                            if (remark.includes('user') || remark.includes('User'))
                                                return <Users className="h-4 w-4 text-foreground" />;
                                            if (remark.includes('discussion') || remark.includes('Discussion'))
                                                return <MessageSquare className="h-4 w-4 text-foreground" />;
                                            return <ActivityIcon className="h-4 w-4 text-foreground" />;
                                        })()}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 text-sm text-foreground">
                                        {(() => {
                                            try {
                                                const parsed = JSON.parse(activity.remark || '{}');
                                                return parsed.title || 'Activity';
                                            } catch {
                                                return activity.remark || 'Activity';
                                            }
                                        })()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(activity.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex min-h-[400px] items-center justify-center">
                        <NoRecordsFound
                            icon={ActivityIcon}
                            title={t('No Activities found')}
                            description={t('Activities will appear here when actions are performed.')}
                            className="h-auto"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
