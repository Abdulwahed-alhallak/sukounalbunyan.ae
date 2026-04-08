import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { formatDate } from '@/utils/helpers';

interface PerformanceIndicator {
    id: number;
    name: string;
    description: string;
    measurement_unit: string;
    target_value: string;
    status: string;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        name: string;
    };
}

interface ShowProps {
    indicator: PerformanceIndicator;
}

export default function Show({ indicator }: ShowProps) {
    const { t } = useTranslation();
    const { categories = [] } = usePage<any>().props;

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-muted text-foreground' : 'bg-muted text-destructive';
    };

    const getStatusLabel = (status: string) => {
        return status === 'active' ? t('Active') : t('Inactive');
    };

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-foreground/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-semibold">{t('Performance Indicator Details')}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{indicator.name}</p>
                    </div>
                </div>
            </DialogHeader>
            
            <div className="overflow-y-auto flex-1 p-4 space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Name')}</label>
                            <p className="mt-1 text-sm text-foreground">{indicator.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Category')}</label>
                            <p className="mt-1 text-sm text-foreground">
                                {categories?.find((cat: any) => cat.id.toString() === indicator.category?.id?.toString())?.name || indicator.category?.name || '-'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Measurement Unit')}</label>
                            <p className="mt-1 text-sm text-foreground">{indicator.measurement_unit || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Target Value')}</label>
                            <p className="mt-1 text-sm text-foreground">{indicator.target_value || '-'}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Status')}</label>
                            <p className="mt-1 text-sm text-foreground">
                                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(indicator.status)}`}>
                                    {getStatusLabel(indicator.status)}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">{t('Created At')}</label>
                            <p className="mt-1 text-sm text-foreground">{formatDate(indicator.created_at)}</p>
                        </div>
                    </div>
                </div>

                {indicator.description && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">{t('Description')}</label>
                        <p className="mt-1 text-sm text-foreground">{indicator.description}</p>
                    </div>
                )}
            </div>
        </DialogContent>
    );
}