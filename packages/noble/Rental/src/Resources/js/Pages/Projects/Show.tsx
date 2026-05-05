import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/helpers';
import {
    FolderOpen, FileText, Plus, Edit,
    MapPin, Phone, User, Package,
    TrendingUp, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function statusVariant(s: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (s === 'active') return 'default';
    if (s === 'closed' || s === 'completed') return 'secondary';
    return 'outline';
}

export default function ShowProject() {
    const { t }                     = useTranslation();
    const { project, summary, custody } = usePage<any>().props;

    const handleDelete = () => {
        if (confirm(t('Delete this project? Only possible if no active contracts exist.'))) {
            router.delete(route('rental-projects.destroy', project.id));
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Rental Projects'), url: route('rental-projects.index') },
                { label: project.name },
            ]}
            pageTitle={project.name}
        >
            <Head title={project.name} />

            {/* ── Color header band ── */}
            <div
                className="h-2 w-full rounded-t-xl mb-6"
                style={{ backgroundColor: project.color }}
            />

            {/* ── Top actions ── */}
            <div className="flex flex-wrap gap-2 justify-end mb-6">
                <Button variant="outline" asChild className="gap-2">
                    <Link href={route('rental-projects.edit', project.id)}>
                        <Edit className="h-4 w-4" />
                        {t('Edit Project')}
                    </Link>
                </Button>
                <Button className="gap-2" asChild>
                    <Link href={route('rental.create') + `?rental_project_id=${project.id}`}>
                        <Plus className="h-4 w-4" />
                        {t('New Contract')}
                    </Link>
                </Button>
            </div>

            {/* ── KPI cards ── */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card className="border-l-4" style={{ borderLeftColor: project.color }}>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-xs text-muted-foreground">{t('Total Contracts')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.total_contracts}</div>
                        <p className="text-xs text-muted-foreground">{summary.active_contracts} {t('active')}</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-xs text-blue-600">{t('Total Invoiced')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-700">{formatCurrency(summary.total_invoiced)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-xs text-emerald-600">{t('Total Paid')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">{formatCurrency(summary.total_paid)}</div>
                    </CardContent>
                </Card>
                <Card className={summary.balance_due > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50'}>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-xs text-muted-foreground">{t('Balance Due')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${summary.balance_due > 0 ? 'text-destructive' : 'text-gray-500'}`}>
                            {formatCurrency(summary.balance_due)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* ── Left: Tabs ── */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="contracts">
                        <TabsList className="w-full mb-4">
                            <TabsTrigger value="contracts" className="flex-1">{t('Contracts')}</TabsTrigger>
                            <TabsTrigger value="custody" className="flex-1">{t('Materials in Custody')}</TabsTrigger>
                            <TabsTrigger value="quotations" className="flex-1">{t('Quotations')}</TabsTrigger>
                        </TabsList>

                        {/* Contracts Tab */}
                        <TabsContent value="contracts">
                            <Card>
                                <CardContent className="p-0">
                                    {project.contracts.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>{t('No contracts yet.')}</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t('Contract')}</TableHead>
                                                    <TableHead>{t('Period')}</TableHead>
                                                    <TableHead>{t('Status')}</TableHead>
                                                    <TableHead className="text-right">{t('Invoiced')}</TableHead>
                                                    <TableHead className="text-right">{t('Balance')}</TableHead>
                                                    <TableHead />
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {project.contracts.map((c: any) => {
                                                    const bal = Math.max(0, c.total_invoiced - c.paid_amount);
                                                    return (
                                                        <TableRow key={c.id}>
                                                            <TableCell className="font-medium">{c.contract_number}</TableCell>
                                                            <TableCell className="text-sm text-muted-foreground">
                                                                {formatDate(c.start_date)}
                                                                {c.end_date ? ` → ${formatDate(c.end_date)}` : ''}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={statusVariant(c.status)}>
                                                                    {c.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">{formatCurrency(c.total_invoiced)}</TableCell>
                                                            <TableCell className={`text-right font-medium ${bal > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                                                                {formatCurrency(bal)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button size="sm" variant="ghost" asChild>
                                                                    <Link href={route('rental.show', c.id)}>
                                                                        <FileText className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Custody Tab */}
                        <TabsContent value="custody">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">{t('Materials Currently at Site (Active Contracts)')}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {custody.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground">
                                            <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>{t('No materials in custody.')}</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t('Material')}</TableHead>
                                                    <TableHead className="text-center">{t('Qty in Custody')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {custody.map((item: any) => (
                                                    <TableRow key={item.product_id}>
                                                        <TableCell className="font-medium">{item.product_name}</TableCell>
                                                        <TableCell className="text-center font-bold text-primary">
                                                            {item.quantity}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Quotations Tab */}
                        <TabsContent value="quotations">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm">{t('Quotations')}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {project.quotations.length === 0 ? (
                                        <div className="text-center py-10 text-muted-foreground">
                                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                            <p>{t('No quotations for this project yet.')}</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>{t('Quotation')}</TableHead>
                                                    <TableHead>{t('Date')}</TableHead>
                                                    <TableHead>{t('Status')}</TableHead>
                                                    <TableHead className="text-right">{t('Amount')}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {project.quotations.map((q: any) => (
                                                    <TableRow key={q.id}>
                                                        <TableCell className="font-medium">{q.quotation_number}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">{formatDate(q.quotation_date)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{q.status}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">{formatCurrency(q.total_amount)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* ── Right sidebar: Project details ── */}
                <div className="space-y-4">
                    {/* Client card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {t('Client')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: project.customer?.color ?? '#6366F1' }}
                                >
                                    {project.customer?.name?.[0]?.toUpperCase() ?? 'C'}
                                </div>
                                <div>
                                    <p className="font-medium">{project.customer?.name}</p>
                                    <p className="text-xs text-muted-foreground">{project.customer?.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Site info */}
                    {(project.site_name || project.site_address) && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {t('Site Information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {project.site_name && (
                                    <div>
                                        <span className="text-muted-foreground">{t('Site')}: </span>
                                        <span className="font-medium">{project.site_name}</span>
                                    </div>
                                )}
                                {project.site_address && (
                                    <div>
                                        <span className="text-muted-foreground">{t('Address')}: </span>
                                        <span>{project.site_address}</span>
                                    </div>
                                )}
                                {project.site_contact_person && (
                                    <div>
                                        <span className="text-muted-foreground">{t('Contact')}: </span>
                                        <span>{project.site_contact_person}</span>
                                        {project.site_contact_phone && (
                                            <span className="text-muted-foreground"> · {project.site_contact_phone}</span>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Damage fees */}
                    {summary.total_damage_fees > 0 && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-orange-700">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">{t('Total Damage Fees')}</span>
                                </div>
                                <p className="text-xl font-bold text-orange-700 mt-1">
                                    {formatCurrency(summary.total_damage_fees)}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Danger zone */}
                    <Card className="border-destructive/20">
                        <CardContent className="p-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                                onClick={handleDelete}
                            >
                                {t('Delete Project')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
