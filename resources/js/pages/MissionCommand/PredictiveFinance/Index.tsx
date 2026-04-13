import React from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PredictiveFinanceIndex({ chartData, metrics }: { chartData: any[]; metrics: any }) {
    const { t } = useTranslation();
    return (
        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground dark:text-foreground">
                        <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" strokeWidth={1.5} />
                        {t('AI Financial Telemetry')}
                        <Badge className="bg-foreground text-background hover:bg-foreground/90">{t('ALPHA V1.0')}</Badge>
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-muted-foreground dark:text-muted-foreground">
                        {t('Predictive machine learning models analyzing cash flow, payroll, and burn rates.')}
                    </p>
                </div>
                <div className="text-start sm:text-end">
                    <div className="text-[10px] sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('Model Accuracy Rate')}</div>
                    <div className="text-xl sm:text-2xl font-black text-foreground">{metrics.accuracy}%</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                <Card className="border-border bg-muted/50 dark:border-border dark:bg-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-[10px] sm:text-sm font-medium text-muted-foreground">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            {t('Next Quarter Predicted Revenue')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">${metrics.predictedRevenue.toLocaleString()}</div>
                        <p className="mt-1 text-[9px] sm:text-xs text-muted-foreground">
                            {metrics.revenueGrowth > 0 ? '+' : ''}
                            {metrics.revenueGrowth}% {t('vs Last Month')}
                        </p>
                    </CardContent>
                </Card>
                <Card
                    className={`relative overflow-hidden border-border bg-muted/50 dark:border-border dark:bg-foreground`}
                >
                    {metrics.danger && (
                        <div className="absolute end-0 top-0 p-4 opacity-10">
                            <AlertTriangle className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-[10px] sm:text-sm font-medium text-muted-foreground">
                            <Activity className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            {t('Runway Status (Burn Rate)')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold text-foreground">
                            {metrics.runway >= 99 ? t('Healthy') : `${metrics.runway} ${t('Months')}`}
                        </div>
                        <p className="mt-1 text-[9px] sm:text-xs text-muted-foreground">
                            {metrics.danger ? t('High burn rate detected.') : t('Stable cash deployment.')}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-muted/50 dark:border-border dark:bg-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-[10px] sm:text-sm font-medium text-muted-foreground">
                            <DollarSign className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                            {t('Avg Customer LTV')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">${metrics.avgLtv.toLocaleString()}</div>
                        <p className="mt-1 text-[9px] sm:text-xs text-muted-foreground">{t('Calculated via CRM converted leads')}</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-muted/50 dark:border-border dark:bg-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-[10px] sm:text-sm font-medium text-muted-foreground">
                            <Brain className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                            {t('AI Recommendations')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-[12px] sm:text-lg font-bold leading-tight text-foreground">{metrics.recommendation}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border bg-muted/50 p-4 sm:p-6 dark:border-border dark:bg-foreground">
                <h3 className="mb-6 text-sm sm:text-lg font-bold text-foreground dark:text-foreground">
                    {t('Revenue & Expense Forecast (YTD + Pipeline)')}
                </h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(0, 0%, 50%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(0, 0%, 50%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                            <XAxis dataKey="month" stroke="#71717a" />
                            <YAxis stroke="#71717a" />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#a1a1aa"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                name={t('Actual Revenue')}
                            />
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                stroke="#52525b"
                                strokeDasharray="5 5"
                                fill="none"
                                name={t('AI Predicted Revenue')}
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#71717a"
                                fillOpacity={1}
                                fill="url(#colorExpenses)"
                                name={t('Expenses (Payroll + OPEX)')}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}

PredictiveFinanceIndex.layout = (page: any) => {
    return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};
