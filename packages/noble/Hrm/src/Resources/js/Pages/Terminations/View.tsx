import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { User, Calendar, FileText, UserX, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Termination } from './types';
import { formatDate, getImagePath } from '@/utils/helpers';

interface ViewProps {
    termination: Termination;
}

export default function View({ termination }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                        <UserX className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Termination Details')}</DialogTitle>
                    </div>
                </div>
            </DialogHeader>
            
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t('Employee')}
                        </label>
                        <p className="mt-1 font-medium">{termination.employee?.name || '-'}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {t('Termination Type')}
                        </label>
                        <p className="mt-1 font-medium">{termination.termination_type?.termination_type || '-'}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {t('Notice Date')}
                        </label>
                        <p className="mt-1 font-medium">{termination.notice_date ? formatDate(termination.notice_date) : '-'}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t('Approved By')}
                        </label>
                        <p className="mt-1 font-medium">{termination.approved_by?.name || '-'}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {t('Termination Date')}
                        </label>
                        <p className="mt-1 font-medium">{termination.termination_date ? formatDate(termination.termination_date) : '-'}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {t('Status')}
                        </label>
                        <div className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                                termination.status === 'pending' ? 'bg-muted text-foreground' :
                                termination.status === 'approved' ? 'bg-muted text-foreground' :
                                termination.status === 'rejected' ? 'bg-muted text-destructive' :
                                'bg-muted text-foreground'
                            }`}>
                                {t(termination.status?.charAt(0).toUpperCase() + termination.status?.slice(1) || 'Pending')}
                            </span>
                        </div>
                    </div>
                </div>
                
                {termination.reason && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {t('Reason')}
                        </label>
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{termination.reason}</p>
                        </div>
                    </div>
                )}
                
                {termination.description && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {t('Description')}
                        </label>
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{termination.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}