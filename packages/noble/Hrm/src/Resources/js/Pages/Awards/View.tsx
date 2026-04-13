import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Tag, User, Calendar, FileText, FileImage } from 'lucide-react';
import { Award } from './types';
import { formatDate, getImagePath } from '@/utils/helpers';

interface ViewAwardProps {
    award: Award;
}

export default function View({ award }: ViewAwardProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Tag className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Award Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-4 w-4" />
                            {t('Employee Name')}
                        </label>
                        <p className="mt-1 font-medium">{award.employee?.name || '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Tag className="h-4 w-4" />
                            {t('Award Type')}
                        </label>
                        <p className="mt-1 font-medium">{award.award_type?.name || '-'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('Award Date')}
                        </label>
                        <p className="mt-1 font-medium">{award.award_date ? formatDate(award.award_date) : '-'}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileImage className="h-4 w-4" />
                            {t('Certificate')}
                        </label>
                        <div className="mt-1">
                            {award.certificate ? (
                                <a
                                    href={getImagePath(award.certificate)}
                                    target="_blank"
                                    className="flex items-center gap-1 text-foreground hover:text-foreground"
                                >
                                    {t('View Certificate')}
                                </a>
                            ) : (
                                <p className="font-medium">-</p>
                            )}
                        </div>
                    </div>
                </div>

                {award.description && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{award.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
