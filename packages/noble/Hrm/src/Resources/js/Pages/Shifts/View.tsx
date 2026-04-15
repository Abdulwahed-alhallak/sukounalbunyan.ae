import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Clock, FileText, Calendar, User, Moon, Sun } from 'lucide-react';
import { Shift } from './types';
import { formatTime, formatDate } from '@/utils/helpers';

interface ViewProps {
    [key: string]: any;
    shift: Shift;
}

export default function View({ shift }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Shift Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{shift.shift_name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {t('Shift Name')}
                            </label>
                            <p className="mt-1 font-medium">{shift.shift_name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('Start Time')}
                            </label>
                            <p className="mt-1 font-medium">{shift.start_time ? formatTime(shift.start_time) : '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('End Time')}
                            </label>
                            <p className="mt-1 font-medium">{shift.end_time ? formatTime(shift.end_time) : '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                {shift.is_night_shift ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                {t('Night Shift')}
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`rounded-full px-2 py-1 text-sm ${
                                        shift.is_night_shift ? 'bg-muted text-foreground' : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {shift.is_night_shift ? t('Yes') : t('No')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('Break Start Time')}
                            </label>
                            <p className="mt-1 font-medium">
                                {shift.break_start_time ? formatTime(shift.break_start_time) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('Break End Time')}
                            </label>
                            <p className="mt-1 font-medium">
                                {shift.break_end_time ? formatTime(shift.break_end_time) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="h-4 w-4" />
                                {t('Created By')}
                            </label>
                            <p className="mt-1 font-medium">{shift.creator?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Created At')}
                            </label>
                            <p className="mt-1 font-medium">{shift.created_at ? formatDate(shift.created_at) : '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
