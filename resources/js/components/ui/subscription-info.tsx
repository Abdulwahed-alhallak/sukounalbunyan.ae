import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

interface UserSubscriptionInfo {
    is_superadmin: boolean;
    active_plan_id?: number;
    available_modules_count: number;
}

interface Props {
    userSubscriptionInfo: UserSubscriptionInfo;
    totalModulesCount: number;
}

export function SubscriptionInfo({ userSubscriptionInfo, totalModulesCount }: Props) {
    const { t } = useTranslation();

    if (userSubscriptionInfo.is_superadmin) {
        return (
            <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <InfoIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        {t('Super Admin Access')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {t('You have access to all {{count}} available features as a super admin.', {
                            count: totalModulesCount,
                        })}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border bg-card">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    {t('Subscription Features')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('Available Features')}</span>
                    <Badge variant="outline">{userSubscriptionInfo.available_modules_count}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t(
                        'Only modules from your current subscription package are shown. To access more modules, upgrade your subscription.'
                    )}
                </p>
            </CardContent>
        </Card>
    );
}
