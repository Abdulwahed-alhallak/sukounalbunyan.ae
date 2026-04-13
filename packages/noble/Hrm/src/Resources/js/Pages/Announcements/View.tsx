import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Megaphone, FileText, Calendar, AlertCircle, CheckCircle, Building2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Announcement } from './types';
import { formatDate } from '@/utils/helpers';

interface ViewProps {
    announcement: Announcement;
}

export default function View({ announcement }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-foreground/10 p-2">
                        <Megaphone className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Announcement Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                {t('Title')}
                            </label>
                            <p className="mt-1 font-medium">{announcement.title || '-'}</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Tag className="h-4 w-4" />
                                {t('Category')}
                            </label>
                            <p className="mt-1 font-medium">
                                {announcement.announcement_category?.announcement_category || '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                {t('Priority')}
                            </label>
                            <div className="mt-1">
                                {announcement.priority ? (
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                            announcement.priority === 'low'
                                                ? 'bg-muted text-foreground'
                                                : announcement.priority === 'medium'
                                                  ? 'bg-muted text-foreground'
                                                  : announcement.priority === 'high'
                                                    ? 'bg-muted text-foreground'
                                                    : 'bg-muted text-destructive'
                                        }`}
                                    >
                                        {t(
                                            announcement.priority.charAt(0).toUpperCase() +
                                                announcement.priority.slice(1)
                                        )}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                {t('Status')}
                            </label>
                            <div className="mt-1">
                                {announcement.status ? (
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                            announcement.status === 'active'
                                                ? 'bg-muted text-foreground'
                                                : announcement.status === 'inactive'
                                                  ? 'bg-muted text-destructive'
                                                  : 'bg-muted text-foreground'
                                        }`}
                                    >
                                        {t(announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1))}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('Start Date')}
                            </label>
                            <p className="mt-1 font-medium">
                                {announcement.start_date ? formatDate(announcement.start_date) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {t('End Date')}
                            </label>
                            <p
                                className={`mt-1 font-medium ${announcement.end_date && new Date(announcement.end_date) < new Date() ? 'text-destructive' : ''}`}
                            >
                                {announcement.end_date ? formatDate(announcement.end_date) : '-'}
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                {t('Departments')}
                            </label>
                            <div className="mt-1">
                                {announcement.departments && announcement.departments.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {announcement.departments?.map((dept: any) => (
                                            <Badge key={dept.id} variant="outline" className="text-xs">
                                                {dept.department_name || dept.name}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                {t('Approved By')}
                            </label>
                            <p className="mt-1 font-medium">{announcement.approved_by?.name || '-'}</p>
                        </div>
                    </div>
                </div>

                {announcement.description && (
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 rounded-lg bg-muted/50 p-3">
                            <p className="text-sm">{announcement.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}
