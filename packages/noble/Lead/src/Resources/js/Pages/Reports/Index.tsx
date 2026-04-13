import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export default function Index() {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout breadcrumbs={[{ label: t('Lead') }, { label: t('Reports') }]} pageTitle={t('Reports')}>
            <Head title={t('Reports')} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => (window.location.href = route('lead.reports.leads'))}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                            <div className="bg-muted/500 rounded-lg p-2 text-background">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">{t('Lead Reports')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-muted-foreground">{t('View detailed lead analytics and reports')}</p>
                        <Button variant="outline" size="sm">
                            {t('View Reports')}
                        </Button>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => (window.location.href = route('lead.reports.deals'))}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                            <div className="bg-muted/500 rounded-lg p-2 text-background">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-lg">{t('Deal Reports')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-muted-foreground">{t('View detailed deal analytics and reports')}</p>
                        <Button variant="outline" size="sm">
                            {t('View Reports')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
