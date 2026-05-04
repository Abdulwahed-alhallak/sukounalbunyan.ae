import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, ExternalLink, Building2 } from 'lucide-react';

interface CustodyItem {
    contract_id: number;
    contract_number: string;
    customer: string;
    warehouse: string;
    quantity: number;
    start_date: string;
}

interface CustodyProps {
    product: any;
    custody: CustodyItem[];
}

export default function CustodyDetails({ product, custody }: CustodyProps) {
    const { t } = useTranslation();

    const totalInCustody = custody.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental Management'), url: route('rental.index') },
                { label: t('Reports'), url: route('rental.reports.index') },
                { label: t('Custody Details') }
            ]}
            pageTitle={`${t('Custody Details')}: ${product.name}`}
        >
            <Head title={`${t('Custody')}: ${product.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('rental.reports.index')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('Back to Reports')}
                        </Link>
                    </Button>

                    <Badge variant="secondary" className="px-4 py-1 text-lg">
                        {t('Total on Site')}: {totalInCustody.toLocaleString()}
                    </Badge>
                </div>

                <Card className="border-none shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Package className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{product.name}</CardTitle>
                                <CardDescription>
                                    {t('Detailed distribution of this material across all active sites.')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[150px]">{t('Contract #')}</TableHead>
                                    <TableHead>{t('Customer')}</TableHead>
                                    <TableHead>{t('Warehouse Origin')}</TableHead>
                                    <TableHead className="text-right">{t('Current Custody')}</TableHead>
                                    <TableHead>{t('Rented Since')}</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {custody.length > 0 ? (
                                    custody.map((item) => (
                                        <TableRow key={item.contract_id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-mono font-bold text-primary">
                                                {item.contract_number}
                                            </TableCell>
                                            <TableCell className="font-medium">{item.customer}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-3 w-3 text-muted-foreground" />
                                                    {item.warehouse}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="font-mono text-base border-primary/30">
                                                    {item.quantity.toLocaleString()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(item.start_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild title={t('View Contract')}>
                                                    <Link href={route('rental.show', item.contract_id)}>
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            {t('No materials currently at site.')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
