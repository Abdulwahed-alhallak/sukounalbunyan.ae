import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Search, FileText, RotateCcw, CheckCircle, Trash2, BarChart3, CheckCheck, ScanBarcode } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import RentalScannerModal from './components/RentalScannerModal';

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'active':  return 'default';
        case 'closed':  return 'secondary';
        default:        return 'outline';
    }
}

function paymentVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'paid':    return 'default'; // Green/Primary
        case 'partial': return 'outline';
        case 'unpaid':  return 'destructive';
        default:        return 'secondary';
    }
}

export default function Index() {
    const { t } = useTranslation();
    const { contracts, filters, stats } = usePage<any>().props;

    const [search, setSearch] = React.useState(filters?.search ?? '');
    const [status, setStatus] = React.useState(filters?.status ?? 'all');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const applyFilters = (newSearch: string, newStatus: string) => {
        router.get(route('rental.index'), { search: newSearch, status: newStatus }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm(t('Are you sure you want to delete this contract? Inventory will be restored.'))) {
            router.delete(route('rental.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Rental Contracts') }]}
            pageTitle={t('Rental Contracts')}
        >
            <Head title={t('Rental Contracts')} />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-4 p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{stats.active}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">{t('Active Contracts')}</div>
                    </CardContent>
                </Card>
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-4 p-4 text-center">
                        <div className="text-xl font-bold text-orange-600">{formatCurrency(stats.total_accrued)}</div>
                        <div className="text-[10px] text-orange-700/70 mt-1 uppercase tracking-wider font-bold">{t('Pending Accrued')}</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4 p-4 text-center">
                        <div className="text-xl font-bold text-blue-600">{formatCurrency(stats.total_deposits)}</div>
                        <div className="text-[10px] text-blue-700/70 mt-1 uppercase tracking-wider font-bold">{t('Security Deposits')}</div>
                    </CardContent>
                </Card>
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="pt-4 p-4 text-center">
                        <div className="text-xl font-bold text-destructive">{formatCurrency(stats.total_balance_due)}</div>
                        <div className="text-[10px] text-destructive/70 mt-1 uppercase tracking-wider font-bold">{t('Outstanding')}</div>
                    </CardContent>
                </Card>
                <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="pt-4 p-4 text-center">
                        <div className="text-xl font-bold text-purple-600">{formatCurrency(stats.total_damage_fees)}</div>
                        <div className="text-[10px] text-purple-700/70 mt-1 uppercase tracking-wider font-bold">{t('Damage Fees')}</div>
                    </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4 p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600">{stats.expiring_soon}</div>
                        <div className="text-[10px] text-amber-700/70 mt-1 uppercase tracking-wider font-bold">{t('Expiring Soon')}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                    <CardTitle>{t('All Rental Contracts')}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-8 w-48"
                                placeholder={t('Search contract...')}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    applyFilters(e.target.value, status);
                                }}
                            />
                        </div>
                        {/* Status filter */}
                        <Select value={status} onValueChange={(v) => { setStatus(v); applyFilters(search, v); }}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder={t('All Status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('All Status')}</SelectItem>
                                <SelectItem value="active">{t('Active')}</SelectItem>
                                <SelectItem value="closed">{t('Closed')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
                            <ScanBarcode className="mr-2 h-4 w-4" /> {t('Scan QR')}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('rental.reports.index')}>
                                <BarChart3 className="mr-2 h-4 w-4" /> {t('Reports & Analytics')}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('rental.create')}>
                                <Plus className="mr-2 h-4 w-4" /> {t('New Contract')}
                            </Link>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('Contract #')}</TableHead>
                                <TableHead>{t('Customer')}</TableHead>
                                <TableHead>{t('Start Date')}</TableHead>
                                <TableHead>{t('Billing Cycle')}</TableHead>
                                <TableHead>{t('Items')}</TableHead>
                                <TableHead>{t('Accrued Rent')}</TableHead>
                                <TableHead>{t('Status')}</TableHead>
                                <TableHead>{t('Invoiced')}</TableHead>
                                <TableHead>{t('Payment')}</TableHead>
                                <TableHead className="text-right">{t('Balance Due')}</TableHead>
                                <TableHead className="text-right">{t('Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contracts.data.map((contract: any) => (
                                <TableRow key={contract.id}>
                                    <TableCell className="font-mono font-medium">{contract.contract_number}</TableCell>
                                    <TableCell>{contract.customer?.name ?? '—'}</TableCell>
                                    <TableCell>{formatDate(contract.start_date)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{contract.billing_cycle}</Badge>
                                    </TableCell>
                                    <TableCell>{contract.items?.length ?? 0}</TableCell>
                                    <TableCell className="font-bold text-primary">{formatCurrency(contract.accrued_rent)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(contract.status)}>
                                            {t(contract.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatCurrency(contract.total_invoiced)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={paymentVariant(contract.payment_status)}>
                                            {t(contract.payment_status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${contract.balance_due > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                        {formatCurrency(contract.balance_due)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {contract.status === 'draft' && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => router.post(route('rental.activate', contract.id))}
                                                >
                                                    <CheckCheck className="h-4 w-4 mr-1" />
                                                    {t('Activate')}
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                                                <Link href={route('rental.show', contract.id)}>
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    {t('View')}
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(contract.id)}
                                                disabled={contract.total_invoiced > 0 || contract.paid_amount > 0}
                                                title={contract.total_invoiced > 0 || contract.paid_amount > 0 ? t('Cannot delete invoiced contract') : t('Delete Contract')}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {contracts.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                        {t('No rental contracts found.')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {contracts.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-muted-foreground">
                                {t('Showing')} {contracts.from}–{contracts.to} {t('of')} {contracts.total}
                            </span>
                            <div className="flex gap-2">
                                {contracts.links.map((link: any, i: number) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <RentalScannerModal 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
            />
        </AuthenticatedLayout>
    );
}
