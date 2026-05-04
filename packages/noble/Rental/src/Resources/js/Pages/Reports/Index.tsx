import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Package, Users, ArrowRight, TrendingUp } from 'lucide-react';

interface UtilizationItem {
    id: number;
    name: string;
    in_stock: number;
    in_custody: number;
    total: number;
    utilization_rate: number;
}

interface RevenueItem {
    customer_id: number;
    customer: { id: number; name: string };
    revenue: number;
}

interface ReportsProps {
    utilization: UtilizationItem[];
    revenue: RevenueItem[];
}

export default function ReportsIndex({ utilization, revenue }: ReportsProps) {
    const { t } = useTranslation();

    const totalInCustody = utilization.reduce((acc, curr) => acc + curr.in_custody, 0);
    const avgUtilization = utilization.length > 0 
        ? utilization.reduce((acc, curr) => acc + curr.utilization_rate, 0) / utilization.length 
        : 0;

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental Management'), url: route('rental.index') },
                { label: t('Reports') }
            ]}
            pageTitle={t('Rental Analytics & Reports')}
        >
            <Head title={t('Rental Reports')} />

            <div className="space-y-8">
                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('Material on Site')}</CardTitle>
                            <Package className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalInCustody.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t('Total units currently with customers')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-chart-2/5 border-chart-2/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('Avg. Efficiency')}</CardTitle>
                            <TrendingUp className="h-4 w-4 text-chart-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgUtilization.toFixed(1)}%</div>
                            <div className="mt-2">
                                <Progress value={avgUtilization} className="h-1" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-chart-3/5 border-chart-3/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{t('Active Customers')}</CardTitle>
                            <Users className="h-4 w-4 text-chart-3" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{revenue.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t('Unique customers with rental billing')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Utilization Table */}
                    <Card className="shadow-lg border-none bg-gradient-to-br from-background to-muted/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                {t('Material Efficiency')}
                            </CardTitle>
                            <CardDescription>
                                {t('Tracking scaffolding availability vs site distribution')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('Product')}</TableHead>
                                        <TableHead className="text-right">{t('On Site')}</TableHead>
                                        <TableHead className="text-right">{t('Efficiency')}</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {utilization.map((item) => (
                                        <TableRow key={item.id} className="group">
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-right">{item.in_custody}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-xs font-semibold">{item.utilization_rate}%</span>
                                                    <Progress value={item.utilization_rate} className="h-1 w-16" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('rental.reports.custody', item.id)}>
                                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Revenue Table */}
                    <Card className="shadow-lg border-none bg-gradient-to-br from-background to-muted/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-chart-3" />
                                {t('Revenue by Customer')}
                            </CardTitle>
                            <CardDescription>
                                {t('Total invoiced rent across the lifecycle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('Customer')}</TableHead>
                                        <TableHead className="text-right">{t('Total Revenue')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {revenue.map((item) => (
                                        <TableRow key={item.customer_id}>
                                            <TableCell className="font-medium">{item.customer?.name || t('Unknown')}</TableCell>
                                            <TableCell className="text-right font-bold text-chart-2">
                                                {Number(item.revenue).toLocaleString()} <span className="text-[0.6rem] font-normal text-muted-foreground uppercase">{t('AED')}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
