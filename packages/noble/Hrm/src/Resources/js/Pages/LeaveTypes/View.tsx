import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Calendar, FileText, Palette, DollarSign, Hash } from 'lucide-react';
import { LeaveType } from './types';

interface ViewProps {
    leavetype: LeaveType;
}

export default function View({ leavetype }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Calendar className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Leave Type Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{leavetype.name}</p>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {t('Name')}
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full border border-border"
                                    style={{ backgroundColor: leavetype.color || '#FF6B6B' }}
                                ></div>
                                <p className="font-medium">{leavetype.name || '-'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Hash className="h-4 w-4" />
                                {t('Max Days Per Year')}
                            </label>
                            <p className="mt-1 font-medium">{leavetype.max_days_per_year || '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                {t('Is Paid')}
                            </label>
                            <div className="mt-1">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                        leavetype.is_paid ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                    }`}
                                >
                                    {leavetype.is_paid ? t('Paid') : t('Unpaid')}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Palette className="h-4 w-4" />
                                {t('Color')}
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                                <div
                                    className="h-6 w-6 rounded border border-border"
                                    style={{ backgroundColor: leavetype.color || '#FF6B6B' }}
                                ></div>
                                <span className="text-sm text-muted-foreground">{leavetype.color || '#FF6B6B'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {leavetype.description && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{leavetype.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
