import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Calendar, User, Tag, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChecklistItem } from './types';

interface ViewProps {
    checklistitem: ChecklistItem;
}

export default function View({ checklistitem }: ViewProps) {
    const { t } = useTranslation();

    const getCategoryBadge = (category: string) => {
        const styles = {
            Other: 'bg-muted text-foreground',
            Documentation: 'bg-muted text-foreground',
            HR: 'bg-muted text-foreground',
            'IT Setup': 'bg-muted text-foreground',
            Training: 'bg-muted text-foreground',
            Facilities: 'bg-muted text-foreground',
        };
        return styles[category] || 'bg-muted text-foreground';
    };

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <CheckCircle className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                        <DialogTitle className="text-xl font-semibold">{t('Checklist Item Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="space-y-6 p-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                {t('Task Name')}
                            </label>
                            <p className="text-base font-medium">{checklistitem.task_name}</p>
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                {t('Checklist')}
                            </label>
                            <p className="text-base font-medium">{checklistitem.checklist?.name || '-'}</p>
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                {t('Category')}
                            </label>
                            {checklistitem.category ? (
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getCategoryBadge(checklistitem.category)}`}
                                >
                                    {checklistitem.category}
                                </span>
                            ) : (
                                <p className="text-muted-foreground">-</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <User className="h-4 w-4" />
                                {t('Assigned To Role')}
                            </label>
                            <p className="text-base">{checklistitem.assigned_to_role || '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {t('Due Day')}
                            </label>
                            {checklistitem.due_day ? (
                                <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                                    {t('Day')} {checklistitem.due_day}
                                </span>
                            ) : (
                                <p className="text-muted-foreground">-</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                {t('Status')}
                            </label>
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                    checklistitem.status ? 'bg-muted text-foreground' : 'bg-muted text-destructive'
                                }`}
                            >
                                {checklistitem.status ? t('Active') : t('Inactive')}
                            </span>
                        </div>

                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                {t('Required')}
                            </label>
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                    checklistitem.is_required ? 'bg-muted text-destructive' : 'bg-muted text-foreground'
                                }`}
                            >
                                {checklistitem.is_required ? t('Yes') : t('No')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {checklistitem.description && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-muted-foreground">
                            {t('Description')}
                        </label>
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="whitespace-pre-wrap text-base leading-relaxed">{checklistitem.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
