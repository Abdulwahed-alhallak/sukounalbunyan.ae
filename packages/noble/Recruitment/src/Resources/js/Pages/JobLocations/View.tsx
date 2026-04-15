import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { JobLocation } from './types';

interface ViewProps {
    [key: string]: any;
    joblocation: JobLocation;
}

export default function View({ joblocation }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <MapPin className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Job Location Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Name')}</label>
                            <p className="mt-1 text-sm text-foreground">{joblocation.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Postal Code')}</label>
                            <p className="mt-1 text-sm text-foreground">{joblocation.postal_code || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Address')}</label>
                            <p
                                className={`mt-1 text-sm ${
                                    joblocation.remote_work ? 'font-medium text-foreground' : 'text-foreground'
                                }`}
                            >
                                {joblocation.remote_work ? t('Remote Work') : joblocation.address || '-'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Type')}</label>
                            <div className="mt-1">
                                <span
                                    className={`rounded-full px-2 py-1 text-sm ${
                                        joblocation.remote_work
                                            ? 'bg-muted text-foreground'
                                            : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {joblocation.remote_work ? t('Remote') : t('On-site')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Country')}</label>
                            <p className="mt-1 text-sm text-foreground">{joblocation.country || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('State')}</label>
                            <p className="mt-1 text-sm text-foreground">{joblocation.state || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('City')}</label>
                            <p className="mt-1 text-sm text-foreground">{joblocation.city || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">{t('Status')}</label>
                            <div className="mt-1">
                                <span
                                    className={`rounded-full px-2 py-1 text-sm ${
                                        joblocation.status ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                    }`}
                                >
                                    {joblocation.status ? t('Active') : t('Inactive')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
