import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building, DollarSign, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

interface StaffProps {
    stats: {
        total_clients: number;
        total_vendors: number;
        monthly_revenue: number;
        monthly_expense: number;
    };
    recentActivities: Array<{
        type: string;
        title: string;
        amount: number;
        date: string;
    }>;
}

export default function StaffDashboard({ stats, recentActivities }: StaffProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[{label: t('Account')}, {label: t('Dashboard')}]}
            pageTitle={t('Dashboard')}
            pageTitleClass="text-lg"
        >
            <Head title={t('Dashboard')} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="bg-gradient-to-r from-muted/50 to-muted border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">{t('Total Clients')}</CardTitle>
                        <Users className="h-8 w-8 text-foreground opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.total_clients}</div>
                        <p className="text-xs text-foreground opacity-80 mt-1">{t('Active clients')}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-muted/50 to-muted border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">{t('Total Vendors')}</CardTitle>
                        <Building className="h-8 w-8 text-foreground opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.total_vendors}</div>
                        <p className="text-xs text-foreground opacity-80 mt-1">{t('Active vendors')}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-muted/50 to-muted border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground">{t('Monthly Revenue')}</CardTitle>
                        <TrendingUp className="h-8 w-8 text-foreground opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.monthly_revenue)}</div>
                        <p className="text-xs text-foreground opacity-80 mt-1">{t('Current month')}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-muted/50 to-muted border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-destructive">{t('Monthly Expense')}</CardTitle>
                        <TrendingDown className="h-8 w-8 text-destructive opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{formatCurrency(stats.monthly_expense)}</div>
                        <p className="text-xs text-destructive opacity-80 mt-1">{t('Current month')}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('Monthly Summary')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <TrendingUp className="h-4 w-4 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('Revenue')}</p>
                                        <p className="text-sm text-muted-foreground">{t('Current month')}</p>
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-foreground">
                                    {formatCurrency(stats.monthly_revenue)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <TrendingDown className="h-4 w-4 text-destructive" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('Expense')}</p>
                                        <p className="text-sm text-muted-foreground">{t('Current month')}</p>
                                    </div>
                                </div>
                                <div className="text-lg font-bold text-destructive">
                                    {formatCurrency(stats.monthly_expense)}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-muted rounded-full">
                                        <DollarSign className="h-4 w-4 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('Net Profit')}</p>
                                        <p className="text-sm text-muted-foreground">{t('Current month')}</p>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${(stats.monthly_revenue - stats.monthly_expense) >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                                    {formatCurrency(stats.monthly_revenue - stats.monthly_expense)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base">{t('Recent Activities')}</CardTitle>
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-96 overflow-y-auto space-y-3">
                            {recentActivities.length > 0 ? (
                                recentActivities?.map((activity, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-full ${activity.type === 'Revenue' ? 'bg-muted' : 'bg-muted'}`}>
                                                {activity.type === 'Revenue' ?
                                                    <TrendingUp className="h-4 w-4 text-foreground" /> :
                                                    <TrendingDown className="h-4 w-4 text-destructive" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground">{activity.type}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${activity.type === 'Revenue' ? 'text-foreground' : 'text-destructive'}`}>
                                            {activity.type === 'Revenue' ? '+' : '-'}{formatCurrency(activity.amount)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('No recent activities')}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
