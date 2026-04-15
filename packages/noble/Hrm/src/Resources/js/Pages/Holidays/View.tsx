import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Calendar, Tag, FileText, Globe } from 'lucide-react';
import { Holiday } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    [key: string]: any;
    holiday: Holiday;
}

export default function View({ holiday }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Calendar className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Holiday Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('Holiday Name')}
                        </label>
                        <p className="mt-1 font-medium">{holiday.name || '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Tag className="h-4 w-4" />
                            {t('Holiday Type')}
                        </label>
                        <p className="mt-1 font-medium">{holiday.holiday_type?.holiday_type || '-'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('Start Date')}
                        </label>
                        <p className="mt-1 font-medium">{holiday.start_date ? formatDate(holiday.start_date) : '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('End Date')}
                        </label>
                        <p className="mt-1 font-medium">{holiday.end_date ? formatDate(holiday.end_date) : '-'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Tag className="h-4 w-4" />
                            {t('Paid')}
                        </label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    holiday.is_paid ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                }`}
                            >
                                {holiday.is_paid ? t('Yes') : t('No')}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            {t('Google Calendar Sync')}
                        </label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    holiday.is_sync_google_calendar
                                        ? 'bg-muted text-foreground'
                                        : 'bg-muted text-destructive'
                                }`}
                            >
                                {holiday.is_sync_google_calendar ? t('Yes') : t('No')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            {t('Outlook Calendar Sync')}
                        </label>
                        <div className="mt-1">
                            <span
                                className={`rounded-full px-2 py-1 text-sm ${
                                    holiday.is_sync_outlook_calendar
                                        ? 'bg-muted text-foreground'
                                        : 'bg-muted text-destructive'
                                }`}
                            >
                                {holiday.is_sync_outlook_calendar ? t('Yes') : t('No')}
                            </span>
                        </div>
                    </div>
                </div>

                {holiday.description && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{holiday.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
