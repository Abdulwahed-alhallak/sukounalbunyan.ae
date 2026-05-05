import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Clock, FileText, AlertTriangle, ArrowRight, Package, TrendingUp, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardProps {
    stats: {
        activeContracts: number;
        totalRevenue: number;
        totalRentedItems: number;
    };
    endingSoon: Array<any>;
    overdueContracts: Array<any>;
    topRentedItems: Array<any>;
    monthlyRevenue: Array<{ name: string; total: number }>;
    recentContracts: Array<any>;
}

export default function Dashboard({ stats, endingSoon, overdueContracts, topRentedItems, monthlyRevenue, recentContracts }: DashboardProps) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Rental Dashboard') }]}
            pageTitle={t('Rental Overview')}
        >
            <Head title={t('Rental Dashboard')} />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('Dashboard')}</h2>
                    <p className="text-muted-foreground">{t('Overview of your rental operations and logistics.')}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href={route('rental.create')}>
                            <Plus className="mr-2 h-4 w-4" /> {t('New Contract')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('Active Contracts')}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeContracts}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('Currently active and deployed')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('Total paid over all time')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('Rented Items')}</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRentedItems}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('Total items currently out')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('Revenue Overview')}</CardTitle>
                        <CardDescription>{t('Monthly paid revenue for the last 6 months.')}</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={monthlyRevenue}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('Top Rented Items')}</CardTitle>
                        <CardDescription>{t('Equipment currently highest in demand.')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {topRentedItems.map((item, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="font-medium truncate pr-4">{item.product?.name || t('Unknown Product')}</div>
                                        <div className="text-muted-foreground whitespace-nowrap">{item.rented_quantity} {t('out')}</div>
                                    </div>
                                    <Progress value={Math.min(100, (item.rented_quantity / (item.quantity + item.rented_quantity)) * 100)} className="h-2" />
                                </div>
                            ))}
                            {topRentedItems.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">{t('No items are currently rented out.')}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-base text-destructive flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> {t('Overdue Returns')}
                            </CardTitle>
                            <CardDescription>{t('Contracts past their scheduled end date.')}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-2">
                            {overdueContracts.map((contract) => (
                                <div key={contract.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-medium text-sm flex items-center gap-2">
                                            <Link href={route('rental.show', contract.id)} className="hover:underline">{contract.contract_number}</Link>
                                            <Badge variant="destructive" className="h-5 text-[10px]">{t('Overdue')}</Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 truncate w-[200px]">{contract.customer?.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-destructive font-medium">{formatDate(contract.end_date)}</div>
                                        <Button variant="ghost" size="sm" className="h-7 mt-1" asChild>
                                            <Link href={route('rental.show', contract.id)}>{t('View')} <ArrowRight className="h-3 w-3 ml-1" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {overdueContracts.length === 0 && (
                                <div className="text-center text-muted-foreground py-4 text-sm">{t('No overdue contracts.')}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-base text-amber-500 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {t('Ending Soon (Next 7 Days)')}
                            </CardTitle>
                            <CardDescription>{t('Contracts scheduled to end shortly.')}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-2">
                            {endingSoon.map((contract) => (
                                <div key={contract.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-medium text-sm flex items-center gap-2">
                                            <Link href={route('rental.show', contract.id)} className="hover:underline">{contract.contract_number}</Link>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 truncate w-[200px]">{contract.customer?.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{formatDate(contract.end_date)}</div>
                                        <Button variant="ghost" size="sm" className="h-7 mt-1" asChild>
                                            <Link href={route('rental.show', contract.id)}>{t('Manage')} <ArrowRight className="h-3 w-3 ml-1" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {endingSoon.length === 0 && (
                                <div className="text-center text-muted-foreground py-4 text-sm">{t('No contracts ending soon.')}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </AuthenticatedLayout>
    );
}
